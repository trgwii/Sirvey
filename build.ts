// deno run --allow-write=public --allow-net=unpkg.com --allow-run=cmd,deno build.ts

await Deno.remove("public", { recursive: true }).catch(() => {});
await Deno.mkdir("public/css", { recursive: true });

const res = await fetch(
  "https://unpkg.com/@picocss/pico@1.5.6/css/pico.min.css",
);
await Deno.writeFile(
  "public/css/pico.min.css",
  new Uint8Array(await res.arrayBuffer()),
);
if (
  !(await Deno.run({
    cmd: [
      ...Deno.build.os === "windows" ? ["cmd", "/c"] : [],
      "deno",
      "run",
      "--allow-read=public",
      "--allow-write=public.b.ts",
      "https://raw.githubusercontent.com/trgwii/bundler/ebddf1f8fdb933d7b69bb44920bcba48853a7039/bundler.ts",
      "ts-bundle",
      "public",
      "public.b.ts",
    ],
  }).status()).success
) {
  throw new Error("bundling failed");
}
