import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Demo Site Reviewer" },
      { name: "description", content: "Contact your manager for your preview link." },
      { property: "og:title", content: "Demo Site Reviewer" },
      { property: "og:description", content: "Contact your manager for your preview link." },
    ],
  }),
  component: Index,
});

const demoLinks = [
  { href: "/aos-webinar/Webinar%20Opt-In.html", label: "Webinar Opt-In", desc: "Registration page" },
  { href: "/aos-webinar/Confirmation.html", label: "Confirmation", desc: "Thank-you + video" },
  { href: "/aos-webinar/VIP%20Upsell.html", label: "VIP Upsell", desc: "$97 upgrade" },
  { href: "/aos-webinar/Downsell.html", label: "Downsell", desc: "$27 recording + ebook" },
];

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Demo Site Reviewer
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Contact your manager for your preview link.
        </p>

        <div className="mt-12 text-left">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            AOS Webinar Funnel
          </h2>
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
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
      </div>
    </main>
  );
}
