import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/aos/")({
  head: () => ({
    meta: [
      { title: "AOS Funnel: Pages for Review" },
      { name: "description", content: "Here are the pages for your webinar funnel for review." },
      { property: "og:title", content: "AOS Funnel: Pages for Review" },
      { property: "og:description", content: "Here are the pages for your webinar funnel for review." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AosIndex,
});

const demoLinks = [
  { href: "/aos/webinar", label: "Webinar Opt-In", desc: "Registration page" },
  { href: "/aos/vip", label: "VIP Upsell", desc: "$97 upgrade" },
  { href: "/aos/downsell", label: "Downsell", desc: "$27 recording + ebook" },
  { href: "/aos/confirmation", label: "Confirmation", desc: "Thank-you + video" },
];

function AosIndex() {
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

        <ol className="mt-10 divide-y divide-border rounded-lg border border-border">
          {demoLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <div className="font-medium text-foreground">{link.label}</div>
                    <div className="text-sm text-muted-foreground">{link.desc}</div>
                  </div>
                </div>
                <span className="text-muted-foreground">→</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
