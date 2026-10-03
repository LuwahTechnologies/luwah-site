import { ContactSection } from "@/components/ContactSection";
import { getSiteSettings } from "@/lib/sanity";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Luwah Technologies. We respond within 24 hours. Free consultation available. Aurora, Colorado.",
  path: "/contact",
});

export const revalidate = 60;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-[var(--container-max)] px-6 pt-12">
        <div
          className="overflow-hidden rounded-2xl"
          style={{ height: "300px", border: "1px solid var(--color-border)" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/videos/Animation A.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
      <ContactSection
        contact={
          settings
            ? {
                email: settings.contactEmail,
                phone: settings.contactPhone,
                location: settings.location,
              }
            : undefined
        }
      />
    </div>
  );
}
