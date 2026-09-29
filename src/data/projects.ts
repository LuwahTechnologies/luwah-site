export interface Project {
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  client?: string;
  location?: string;
  industry?: string;
  completed?: string;
  metrics: { value: string; label: string }[];
  overview?: string;
  challenge?: string[];
  solution?: string[];
  technologies?: string[];
  /** Sanity _updatedAt. Absent on the bundled projects. */
  updatedAt?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "eloquence-wax-skin",
    category: "Web Design & Infrastructure",
    title: "Full Digital Presence for a Premium Waxing & Skincare Studio",
    description:
      "Custom Next.js website, business email, self-hosted link hub, and Cloudflare infrastructure — delivered end-to-end for a beauty brand launching from scratch.",
    image: "/images/pexels-sejio402-6704970.jpg",
    client: "Kany Kante — Eloquence Wax & Skin",
    location: "Arvada, Colorado",
    industry: "Beauty & Wellness — Waxing, Facials, Intimate Care",
    completed: "2026",
    metrics: [
      { value: "Sub-second", label: "Load time" },
      { value: "$0/mo", label: "Email cost" },
      { value: "~150ms", label: "LinkStack TTFB" },
    ],
    overview:
      "Eloquence Wax & Skin is a premium waxing and skincare studio offering hair removal, facial treatments, and intimate care services. The client needed a complete digital presence built from scratch — a professional website, business email, a link-in-bio page for social media, and reliable hosting infrastructure to support her growing clientele. Luwah Technologies delivered a full end-to-end solution: from domain and DNS configuration to a custom-built website, self-hosted link management, and secure cloud-based infrastructure.",
    challenge: [
      "A professional website that reflected her brand's warm, elevated aesthetic",
      "A business email address to communicate with clients professionally",
      "A central link hub for social media profiles and booking",
      "A reliable, cost-effective hosting solution that she could own and control",
    ],
    solution: [
      "Custom website built with Next.js 16, Tailwind CSS v4, and Framer Motion — featuring animated hero, services pages, bundles, gallery, FAQ, booking integration, and legal pages",
      "Business email (info@eloquencewaxskin.com) configured through Cloudflare Email Routing at zero cost",
      "Self-hosted LinkStack instance on Raspberry Pi 5 running Proxmox, containerized with Docker and MariaDB, exposed via Cloudflare Tunnel",
      "Full DNS management through Cloudflare with SSL/TLS encryption, cache rules, and security headers",
    ],
    technologies: [
      "Next.js 16",
      "Tailwind CSS v4",
      "Framer Motion",
      "Docker",
      "MariaDB",
      "LinkStack",
      "Cloudflare DNS, Tunnel, Email Routing",
      "Render",
      "Proxmox",
      "Raspberry Pi 5",
    ],
  },
  {
    slug: "denver-racquet-club-gmail-automation",
    category: "Operations",
    title: "Gmail to Google Sheets: A Racquet Club's Contact Forms on Autopilot",
    description:
      "A native Google Apps Script pipeline that monitors Gmail for Wix form submissions, parses contact fields, flags profanity, and analyzes sentiment — twice daily, zero dependencies.",
    image: "/images/pexels-brett-sayles-4520560.jpg",
    client: "Sean Naegeli — Denver Racquet Club",
    location: "Denver, Colorado",
    industry: "Sports & Recreation",
    completed: "2026",
    metrics: [
      { value: "2x/day", label: "Auto-runs" },
      { value: "0", label: "Manual entry" },
      { value: "100%", label: "Native Google" },
    ],
    overview:
      "Denver Racquet Club needed a way to automatically capture website contact form submissions arriving via Gmail and store them in a structured Google Sheet — eliminating manual copy/paste data entry. The request was to use Google Apps Script only (no third-party tools, no n8n, no Zapier) to keep it native to the Google ecosystem with zero external dependencies.",
    challenge: [
      "Manual copy/paste of contact form submissions from Gmail into spreadsheets",
      "No visibility into message sentiment or urgency",
      "No profanity detection for incoming messages",
      "Requirement to stay fully within the Google ecosystem — no third-party tools",
    ],
    solution: [
      "Automated Gmail monitoring with label-based query filtering and duplicate prevention",
      "Field parsing from Wix form emails — First Name, Last Name, Email, Phone, Message",
      "Profanity detection with punctuation-aware regex boundaries to avoid false positives",
      "Sentiment analysis with priority levels (HIGH / MEDIUM / LOW / Neutral) and color-coded rows",
      "Execution logging to a dedicated Log tab with timestamped status entries",
      "Runs automatically at 7:00 AM and 7:00 PM daily via time-based triggers",
      "Auto-built Sentiment Reference sheet for staff training",
    ],
    technologies: [
      "Google Apps Script",
      "Gmail API",
      "Google Sheets",
      "PropertiesService",
      "Regex-based NLP",
    ],
  },
  {
    slug: "automated-lead-generation-pipeline",
    category: "Sales & Marketing",
    title: "How I Turned Google Maps Into a Statewide Sales Machine",
    description:
      "An automated pipeline scrapes emails, pulls owner names from public records, and exports ready-to-contact leads — 90% faster.",
    image: "/images/geralt-ai-10171006_1920.jpg",
    completed: "2025",
    metrics: [
      { value: "60%", label: "Hours saved" },
      { value: "Daily", label: "Automated outreach" },
      { value: "90%", label: "Faster sourcing" },
    ],
    overview:
      "Small businesses spend hours manually searching for leads on Google Maps, copying contact info, and cross-referencing public records. This automation replaced that entire workflow with a pipeline that scrapes business listings, enriches them with owner names and emails from public records, and exports structured lead sheets ready for outreach.",
    challenge: [
      "Manual lead research taking a full day per batch",
      "Inconsistent data quality from manual copy-paste",
      "No enrichment — missing owner names, emails, and phone numbers",
      "Outreach delayed by slow lead sourcing",
    ],
    solution: [
      "Automated Google Maps scraping for business listings by category and location",
      "Public records cross-referencing for owner names and contact details",
      "Email and phone number extraction and validation",
      "Structured CSV export with pre-enriched, ready-to-contact leads",
      "Daily automated runs to keep the pipeline fresh",
    ],
    technologies: [
      "Python",
      "Selenium",
      "BeautifulSoup",
      "Google Maps API",
      "CSV/Excel export",
    ],
  },
  {
    slug: "doyle-group-resume-formatter",
    category: "Staffing & Operations",
    title: "Automated Resume Formatting Saves a Staffing Firm 20+ Hours a Week",
    description:
      "n8n + Claude AI pipeline: resumes upload, PII is scrubbed, content restructures into branded DOCX templates — in under 60 seconds.",
    image: "/images/pexels-thirdman-5256521.jpg",
    completed: "2025",
    metrics: [
      { value: "<60s", label: "Per resume" },
      { value: "20+ hrs", label: "Saved weekly" },
      { value: "100%", label: "PII scrubbed" },
    ],
    overview:
      "A staffing firm was spending 20+ hours per week manually reformatting candidate resumes into their branded template. Each resume required reading the original, extracting relevant information, scrubbing personal identifiable information, and rebuilding the content in a Word document. This automation reduced that process to under 60 seconds per resume.",
    challenge: [
      "20+ hours per week spent manually reformatting resumes",
      "Inconsistent formatting across team members",
      "PII compliance risk from manual handling",
      "Bottleneck in candidate submission pipeline",
    ],
    solution: [
      "n8n workflow triggered by file upload to a watched folder",
      "Claude AI extracts and restructures resume content into standardized sections",
      "Automated PII scrubbing — removes SSN, address, date of birth",
      "Branded DOCX template generation with consistent formatting",
      "Processed resumes delivered to output folder, ready for submission",
    ],
    technologies: [
      "n8n",
      "Claude AI",
      "Node.js",
      "DOCX templating",
      "File system triggers",
    ],
  },
  {
    slug: "automated-community-messaging",
    category: "Communications",
    title: "This iPhone Automation Runs a Chess Club (Without the Organizer)",
    description:
      "An Apple Shortcut reads the schedule, writes personalized messages, and posts to WhatsApp. Zero cost. 100% hands-free.",
    image: "/images/pexels-computer-accessories-1841254_1920.jpg",
    completed: "2025",
    metrics: [
      { value: "100%", label: "Consistency" },
      { value: "0", label: "Manual effort" },
      { value: "$0", label: "Total cost" },
    ],
    overview:
      "A chess club organizer was manually writing and sending daily WhatsApp messages to coordinate meeting times, locations, and attendance. The messages needed to be personalized based on the day's schedule. This automation eliminated all manual effort using only native Apple tools — no subscriptions, no third-party apps.",
    challenge: [
      "Daily manual message writing and sending",
      "Messages needed to vary based on the day's schedule",
      "Organizer unavailability caused missed communications",
      "No budget for third-party automation tools",
    ],
    solution: [
      "Apple Shortcut that reads a schedule spreadsheet to determine the day's event details",
      "Dynamic message composition with personalized content based on schedule data",
      "Automated posting to WhatsApp group — no manual intervention required",
      "Runs daily whether the organizer is at their desk, on vacation, or asleep",
    ],
    technologies: [
      "Apple Shortcuts",
      "iCloud Spreadsheet",
      "WhatsApp",
      "iOS Automation",
    ],
  },
  {
    slug: "zero-cost-business-infrastructure",
    category: "Operations",
    title: "I Got Quoted $600 for a Website. I Built One in 3 Days for $0.",
    description:
      "Deployed a fully branded landing page with legal docs, contact forms, and a resource hub — all self-hosted, zero monthly fees.",
    image: "/images/rupixen-desk-4505087_1920.jpg",
    completed: "2025",
    metrics: [
      { value: "$0/mo", label: "Recurring costs" },
      { value: "100%", label: "Ownership" },
      { value: "3 days", label: "Time to launch" },
    ],
    overview:
      "After being quoted $600 for a basic business website, the decision was made to build one in-house. The result was a fully branded landing page with legal documentation, contact forms, and a resource hub — deployed and self-hosted with zero monthly fees and complete ownership of the code and infrastructure.",
    challenge: [
      "High cost quotes from web agencies for a simple business site",
      "Need for legal pages, contact forms, and a resource hub",
      "Desire for full ownership with no recurring platform fees",
      "Tight timeline — needed to launch quickly",
    ],
    solution: [
      "Custom-built landing page with modern design and responsive layout",
      "Legal documentation pages (Terms & Conditions, Privacy Policy)",
      "Integrated contact form with email delivery",
      "Resource hub for client materials and documentation",
      "Self-hosted deployment with zero monthly recurring costs",
    ],
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Cloudflare",
      "Self-hosted infrastructure",
    ],
  },
  {
    slug: "self-hosted-cloud-storage",
    category: "Cloud & Backup",
    title: "I Canceled iCloud, Google Drive, and Arlo — Here's What Replaced Them",
    description:
      "Photos, files, and security footage on my own server with full 3-2-1 backups. $40+/month gone.",
    image: "/images/pexels-brett-sayles-2881227.jpg",
    completed: "2025",
    metrics: [
      { value: "85%", label: "Cost reduction" },
      { value: "3-2-1", label: "Backup redundancy" },
      { value: "$40+/mo", label: "Subscriptions canceled" },
    ],
    overview:
      "Three paid cloud subscriptions — iCloud, Google Drive, and Arlo camera storage — were replaced with a self-hosted solution running on personal hardware. Photos, files, and security footage now live on a private server with full 3-2-1 backup redundancy, eliminating over $40/month in recurring fees while maintaining complete data ownership and privacy.",
    challenge: [
      "Over $40/month in cloud storage subscriptions",
      "Data spread across multiple providers with no unified access",
      "Privacy concerns — personal photos and footage stored on third-party servers",
      "No control over data retention policies or AI training usage",
    ],
    solution: [
      "Centralized file and photo storage on self-hosted infrastructure",
      "Security camera footage stored locally with remote access",
      "Full 3-2-1 backup strategy — local, offsite, and cloud cold storage",
      "Unified access across all devices with private sync",
    ],
    technologies: [
      "Proxmox",
      "Nextcloud",
      "Frigate NVR",
      "Raspberry Pi",
      "Cloudflare Tunnel",
      "Backblaze B2",
    ],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PROJECTS.map((p) => p.slug);
}
