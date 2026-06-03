import { createFileRoute } from "@tanstack/react-router";
import webinarHtml from "../../../public/aos/webinar.html?raw";
import vipHtml from "../../../public/aos/vip.html?raw";
import downsellHtml from "../../../public/aos/downsell.html?raw";
import confirmationHtml from "../../../public/aos/confirmation.html?raw";

const pages: Record<string, string> = {
  webinar: webinarHtml,
  vip: vipHtml,
  downsell: downsellHtml,
  confirmation: confirmationHtml,
};

export const Route = createFileRoute("/aos/$page")({
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
