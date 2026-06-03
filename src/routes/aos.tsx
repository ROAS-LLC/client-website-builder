import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/aos")({
  head: () => ({
    meta: [
      { title: "AOS Funnel — Pages for Review" },
      { name: "description", content: "Here are the pages for your webinar funnel for review." },
      { property: "og:title", content: "AOS Funnel — Pages for Review" },
      { property: "og:description", content: "Here are the pages for your webinar funnel for review." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AosPage,
});

const demoLinks = [
  { href: "/aos-webinar/Webinar%20Opt-In.html", label: "Webinar Opt-In", desc: "Registration page" },
  { href: "/aos-webinar/Confirmation.html", label: "Confirmation", desc: "Thank-you + video" },
  { href: "/aos-webinar/VIP%20Upsell.html", label: "VIP Upsell", desc: "$97 upgrade" },
  { href: "/aos-webinar/Downsell.html", label: "Downsell", desc: "$27 recording + ebook" },
];

function AosPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Here are the pages for your webinar funnel for review
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Click any page below to preview it.
          </p>
        </div>

        <ul className="mt-10 divide-y divide-border rounded-lg border border-border">
          {demoLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-muted"
              >
                <div>
                  <div className="font-medium text-foreground">{link.label}</div>
                  <div className="text-sm text-muted-foreground">{link.desc}</div>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
