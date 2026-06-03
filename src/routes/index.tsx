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

function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Demo Site Reviewer
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Contact your manager for your preview link.
        </p>
      </div>
    </main>
  );
}
