import { createFileRoute } from "@tanstack/react-router";
import registerHtml from "../../../public/yasir-webinar/register.html?raw";

export const Route = createFileRoute("/yasir-webinar/")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(registerHtml, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
