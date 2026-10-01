import "server-only";
import { createClient, type SanityClient } from "@sanity/client";
import { reportError } from "@/lib/report";

/**
 * Server-only Sanity client used to PERSIST data (form submissions).
 * Kept separate from the read client because:
 *  - it must never reach the browser (the `server-only` import enforces this),
 *  - writes must bypass the CDN cache (useCdn: false),
 *  - it requires a token with write access (Editor role), unlike reads.
 *
 * SANITY_API_TOKEN must be an Editor/write token for create() to succeed.
 */
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_TOKEN;

let writeClient: SanityClient | null = null;
if (projectId && token) {
  writeClient = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token,
    useCdn: false,
  });
}

export interface SubmissionDoc {
  formType: "contact" | "consultation" | "partial";
  leadStatus?: string;
  submissionId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  companyName?: string;
  industry?: string;
  message?: string;
  helpAreas?: string[];
  urgency?: string;
  referralSource?: string;
  pos?: string;
  booking?: string;
  accounting?: string;
  submittedAt: string;
  ipHash?: string;
  source?: string;
}

/**
 * Persist a submission as a Sanity document. Returns true on success.
 * Never throws: a Sanity outage must not break the form response. The caller
 * decides how to react to a false return (e.g. still forward to n8n).
 */
export async function saveSubmission(doc: SubmissionDoc): Promise<boolean> {
  if (!writeClient) {
    console.error("Sanity write client not configured; submission not stored");
    return false;
  }
  try {
    await writeClient.create({
      _type: "submission",
      status: "new",
      ...doc,
    });
    return true;
  } catch (err) {
    reportError("sanity.write.submission", err);
    return false;
  }
}

export { writeClient };
