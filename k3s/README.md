# k3s hosting option

A way to run this site on the k3s cluster, alongside the Render deploy. Render
stays the live host. Nothing here has been deployed, and no DNS has been
changed.

| File | What it is |
|------|------------|
| `Dockerfile` | Multi-stage build. Uses Next's standalone output and runs as a non-root user. |
| `namespace.yaml` | The `luwah-site` namespace. |
| `deployment.yaml` | One pod, probes on `/api/health`, read-only root filesystem, runtime secrets from `luwah-site-env`. |
| `service.yaml` | ClusterIP on port 80. |
| `ingress.yaml` | Traefik ingress for one hostname. The host is a placeholder. |
| `kustomization.yaml` | Ties the above together and is the one place the image name and tag are set. |
| `argocd-app.example.yaml` | An example Argo CD Application. Not applied by anything. |

The repo root also has a `.dockerignore`, and `next.config.js` turns on
standalone output only when `NEXT_OUTPUT=standalone` is set. The Dockerfile sets
it. The Render build does not, so Render behaves exactly as before.

## Before the first deploy

Three placeholders keep an accidental `kubectl apply` from doing anything
useful. Replace them on purpose.

1. **Image.** In `kustomization.yaml`, set `newName` to the registry you push
   to and `newTag` to the build id. The default tag is `unset`, so the pod stops
   at `ImagePullBackOff`. If the registry is private, also create an image pull
   secret and add `imagePullSecrets` to `deployment.yaml`.
2. **Hostname.** In `ingress.yaml`, replace `luwah-site.example.com`. Point DNS
   at it only when you want traffic. The site's canonical URLs and sitemap
   name `luwahtechnologies.com`, so a copy on another host is not indexed as a
   duplicate. Keep the host private anyway, or add a noindex header in Traefik.
3. **Secret.** Create `luwah-site-env` (below). The pod will not start without
   it.

Two more things to line up:

- **Cloudflare Turnstile.** Add the new hostname to the widget's allowed
  hostnames, or the forms fail verification on that host.
- **TLS.** `ingress.yaml` has a commented `tls` block. Use it if cert-manager
  issues certificates. Skip it if Cloudflare terminates TLS in front of Traefik.

## Build and push the image

Runs on the MacBook, from the repo root. The nodes are amd64, so build for that
even on Apple silicon.

```bash
docker build -f k3s/Dockerfile --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=<project id> \
  --build-arg NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key> \
  --build-arg NEXT_PUBLIC_N8N_PARTIAL_WEBHOOK_URL=<url> \
  --build-arg NEXT_PUBLIC_BUILD_ID=$(git rev-parse --short HEAD) \
  -t <registry>/luwah-site:$(git rev-parse --short HEAD) . \
&& docker push <registry>/luwah-site:$(git rev-parse --short HEAD)
```

Why these are build arguments and not runtime settings: Next inlines every
`NEXT_PUBLIC_*` value into the JavaScript at build time, on the server as well
as in the browser. Setting one only on the running container changes nothing.

Optional arguments:

| Argument | Effect |
|----------|--------|
| `NEXT_PUBLIC_SANITY_DATASET` | Defaults to `production`. |
| `NEXT_PUBLIC_SENTRY_DSN` | Unset keeps the production DSN. Empty turns Sentry off. Another DSN sends this copy's errors elsewhere. |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Tags browser events, for example `k3s`. The pod sets `SENTRY_ENVIRONMENT=k3s` for server events, but a browser cannot read that. |
| `NEXT_PUBLIC_BUILD_TIME` | Shown on `/status`. Defaults to the build time. |

If Sanity is unreachable during the build, the build still succeeds. The pages
use the bundled content until the first webhook or the 60 second revalidation.

## Runtime secrets

`deployment.yaml` reads every runtime variable from a Secret named
`luwah-site-env`. Use Sealed Secrets, with 1Password as the source of the
values. Never commit a raw secret.

Runs on the MacBook, with the cluster kubeconfig and the `kubeseal` CLI. Adjust
the controller flags to match the cluster.

```bash
# 1. Write the values. The .local suffix keeps the file out of git and out of
#    the Docker build context.
$EDITOR .env.k3s.local

# 2. Seal it. This creates the SealedSecret and nothing else.
kubectl create secret generic luwah-site-env --namespace luwah-site \
  --from-env-file=.env.k3s.local --dry-run=client -o yaml \
| kubeseal --format yaml > k3s/sealedsecret-luwah-site-env.yaml \
&& rm .env.k3s.local
```

Then add `sealedsecret-luwah-site-env.yaml` under `resources:` in
`kustomization.yaml` and commit it. If sealed secrets suddenly fail to decrypt
later, suspect a Sealed Secrets controller key mismatch.

What goes in the file, from `.env.example`:

```
RESEND_API_KEY
NOTIFY_EMAIL_TO
NOTIFY_EMAIL_FROM
N8N_WEBHOOK_URL
N8N_WEB_WEBHOOK_URL
CLOUDFLARE_TURNSTILE_SECRET
SANITY_API_TOKEN            # an Editor token, it writes form submissions
CSRF_SECRET
WEBHOOK_HMAC_SECRET
REVALIDATION_SECRET
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_TURNSTILE_SITE_KEY
```

The last two are not secret and are already baked in at build time. Include them
anyway. The startup check in `src/lib/checkEnv.ts` reads the runtime
environment, so without them it logs both as missing on every boot.

`SENTRY_AUTH_TOKEN` is a build-time value for source map upload. It is not part
of this image, so this copy's Sentry stack traces are not symbolicated.

## Deploy

Preferred, the GitOps way. Edit the manifests in Git, push, and let Argo CD
sync. `argocd-app.example.yaml` shows an Application for the `luwah-k3s`
project. It has manual sync on purpose.

Direct, for a first look. Runs from the Lens terminal or the MacBook.

```bash
kubectl apply -k k3s/ \
&& kubectl rollout status deploy/luwah-site -n luwah-site
```

## Check it

```bash
# Which build is being served. Works through Cloudflare too.
curl -sI https://<host>/ | grep -i x-build-id

# Same id, in a browser: https://<host>/status
curl -s https://<host>/api/health
```

## Sanity webhook

Content edits reach the site through `POST /api/revalidate`. To have Sanity
refresh this copy, add a second webhook next to the Render one, with the URL
`https://<host>/api/revalidate`, the header `x-revalidation-secret` set to the
secret in `luwah-site-env`, and the projection `{ _type }`.

## Why one replica

Next keeps its regenerated pages in each pod. A webhook lands on one pod, so with
two replicas an edit would show on one and not the other until the 60 second
revalidation. One pod is enough for this site. If it ever needs more, add a
shared cache handler first.

A restart drops the regenerated pages, since the cache directory is an
`emptyDir`. The pages built into the image serve straight away and refresh on
the next request or webhook. That is also why a Sanity outage does not take the
site down: probes use `/api/health`, which never calls Sanity.
