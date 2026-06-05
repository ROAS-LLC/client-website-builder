import { createFileRoute } from "@tanstack/react-router";
import yasirHtml from "../../public/yasir/index.html?raw";

export const Route = createFileRoute("/yasir-vip")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(yasirHtml, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
