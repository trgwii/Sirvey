// deno run --allow-net=127.0.0.1:8080 sirvey.ts < spec.json

const listener = Deno.listen({
  hostname: "127.0.0.1",
  port: Number(Deno.args[0] ?? 8080),
});

import type { Survey } from "./schema.ts";

import {
  elements as dom,
  renderHTML,
} from "https://deno.land/x/hyperactive@v2.0.0-alpha.14/mod.ts";
import pub from "./public.b.ts";

const mimeMap = {
  ".css": "text/css",
};

let _spec = "";

const buf = new Uint8Array(1024);
let bytesRead: number | null = 0;
while ((bytesRead = await Deno.stdin.read(buf)) != null) {
  _spec += new TextDecoder().decode(buf.subarray(0, bytesRead));
}

const spec: Survey = JSON.parse(_spec);

const columns = spec.questions.map((q) => q.name);

console.log(columns.join(";"));

const handler = async (conn: Deno.Conn) => {
  for await (const e of Deno.serveHttp(conn)) {
    const url = new URL(e.request.url);
    const segments = url.pathname.split("/").slice(1);
    let cur = pub as any;
    for (const segment of segments) {
      cur = (cur ?? {})[segment];
    }
    if (cur instanceof Uint8Array) {
      const ext = "." + segments[segments.length - 1].split(".").pop();
      if (ext in mimeMap) {
        e.respondWith(
          new Response(cur, {
            headers: { "Content-Type": mimeMap[ext as keyof typeof mimeMap] },
          }),
        );
        continue;
      }
    }
    if (e.request.method === "POST" && url.pathname === "/submit") {
      e.request.text;
      const rawSurveyResponse = await e.request.text();
      const values = Object.fromEntries(
        rawSurveyResponse.split("&").map((pair) => pair.split("=")),
      );

      console.log(
        columns.map((c) =>
          decodeURIComponent((values[c] ?? "").replaceAll("+", " "))
            .replaceAll("\\", "\\\\")
            .replace(/[\r\n]+/g, "\\n")
            .replaceAll(";", "\\;")
        ).join(";"),
      );

      e.respondWith(
        new Response(null, { status: 302, headers: { Location: "/" } }),
      );
      continue;
    }
    e.respondWith(
      new Response(
        "<!DOCTYPE html>" + renderHTML(dom.html(
          dom.head(
            dom.meta({ charset: "utf-8" }),
            dom.title(spec.title),
            dom.link({ rel: "stylesheet", href: "/css/pico.min.css" }),
          ),
          dom.body(
            dom.main(
              { class: "container" },
              dom.form(
                { action: "/submit", method: "POST" },
                ...spec.questions.map((question) => {
                  if (question.type === "text") {
                    return dom.label(
                      { for: question.name },
                      question.name,
                      dom.input({
                        type: "text",
                        id: question.name,
                        name: question.name,
                        placeholder: question.name,
                      }),
                    );
                  }
                  if (question.type === "textarea") {
                    return dom.label(
                      { for: question.name },
                      question.name,
                      dom.textarea({
                        id: question.name,
                        name: question.name,
                        placeholder: question.name,
                      }),
                    );
                  }
                  if (question.type === "email") {
                    return dom.label(
                      { for: question.name },
                      question.name,
                      dom.input({
                        type: "email",
                        id: question.name,
                        name: question.name,
                        placeholder: question.name,
                      }),
                    );
                  }
                  if (question.type === "radio") {
                    return dom.fieldset(
                      dom.legend(
                        question.name,
                      ),
                      ...question.values.map((value, i) =>
                        dom.label(
                          { for: question.name },
                          dom.input({
                            type: "radio",
                            id: question.name,
                            name: question.name,
                            value,
                            ...i === 0 ? { checked: true } : {},
                          }),
                          value,
                        )
                      ),
                    );
                  }
                  if (question.type === "checkbox") {
                    return dom.fieldset(
                      dom.label(
                        { for: question.name },
                        dom.input({
                          type: "checkbox",
                          id: question.name,
                          name: question.name,
                        }),
                        question.name,
                      ),
                    );
                  }
                  if (question.type === "range") {
                    return dom.label(
                      { for: question.name },
                      question.name,
                      dom.input({
                        type: "range",
                        id: question.name,
                        name: question.name,
                        min: question.min,
                        max: question.max,
                        value: String(question.value),
                      }),
                    );
                  }
                  return dom.p(
                    "Unknown question:",
                    dom.br(),
                    dom.pre(JSON.stringify(question, null, "  ")),
                  );
                }),
                dom.input({ type: "submit", value: "Submit" }),
              ),
            ),
          ),
        )),
        { headers: { "Content-Type": "text/html" } },
      ),
    );
    continue;
  }
};

for await (const conn of listener) {
  handler(conn);
}