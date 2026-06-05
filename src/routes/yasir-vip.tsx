import { createFileRoute } from "@tanstack/react-router";
import vipHtml from "../../public/yasir-vip/index.html?raw";

export const Route = createFileRoute("/yasir-vip")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(vipHtml, {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
