import { createFileRoute } from "@tanstack/react-router";
import siteHtml from "../../public/digitalservices/index.html?raw";

export const Route = createFileRoute("/digitalservices")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(siteHtml, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
