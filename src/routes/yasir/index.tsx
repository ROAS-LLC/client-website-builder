import { createFileRoute } from "@tanstack/react-router";
import registerHtml from "../../../public/yasir/register.html?raw";

export const Route = createFileRoute("/yasir/")({
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
