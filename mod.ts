import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/emoji-grouped")) {
    const file = await Deno.readFile("./build/emoji-grouped.json");
    return new Response(file, {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=31536000"

      },
    });
  }

  if (pathname.startsWith("/emoji-list")) {
    const file = await Deno.readFile("./build/emoji-list.json");
    return new Response(file, {
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=31536000"
      },
    });
  }

  return new Response(
    `<html>
      <head>
      </head>
      <body>
        <h3>List of Assets served</h3>
        <dl>
          <dt><code>/emoji-list</code></dt>
          <dd>List of Emojis</dd>

          <dt><code>/emoji-grouped</code></dt>
          <dd>List of Emojis grouped by categories</dd>
        </dl>
      </body>
    </html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

console.log("Listening on http://localhost:8000");
serve(handleRequest);
