import { createFileRoute } from "@tanstack/react-router";
import registerHtml from "../../../public/yasir-webinar/register.html?raw";
import thankYouHtml from "../../../public/yasir-webinar/thank-you.html?raw";
import vipHtml from "../../../public/yasir-webinar/vip.html?raw";
import checkoutHtml from "../../../public/yasir-webinar/checkout.html?raw";

const pages: Record<string, string> = {
  register: registerHtml,
  "thank-you": thankYouHtml,
  vip: vipHtml,
  checkout: checkoutHtml,
};

export const Route = createFileRoute("/yasir-webinar/$page")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const html = pages[params.page];
        if (!html) return new Response("Not found", { status: 404 });
        return new Response(html, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
