import { createFileRoute } from "@tanstack/react-router";
import registerHtml from "../../../public/yasir/register.html?raw";
import thankYouHtml from "../../../public/yasir/thank-you.html?raw";
import vipHtml from "../../../public/yasir/vip.html?raw";
import checkoutHtml from "../../../public/yasir/checkout.html?raw";

const pages: Record<string, string> = {
  register: registerHtml,
  "thank-you": thankYouHtml,
  vip: vipHtml,
  checkout: checkoutHtml,
};

export const Route = createFileRoute("/yasir/$page")({
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
