# Luwah site rules

- Form inputs must have a label tied by id and a visible :focus-visible style. Never use outline-none alone.
- Reset the Turnstile widget after any failed submit.
- The client must enforce every rule the server enforces.
- Run `rm -rf .next` before `npm run test:smoke`. Run `npx tsc --noEmit` after any merge.
- Node 24+. npm only.
