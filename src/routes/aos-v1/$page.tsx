import { createFileRoute } from "@tanstack/react-router";
import page1Html from "../../../public/aos-v1/page1.html?raw";
import page2Html from "../../../public/aos-v1/page2.html?raw";
import page3Html from "../../../public/aos-v1/page3.html?raw";
import page4Html from "../../../public/aos-v1/page4.html?raw";

const pages: Record<string, string> = {
  page1: page1Html,
  page2: page2Html,
  page3: page3Html,
  page4: page4Html,
};

export const Route = createFileRoute("/aos-v1/$page")({
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
