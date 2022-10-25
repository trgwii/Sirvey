// deno run --allow-write=package.json,package-lock.json,public,node_modules --allow-read=node_modules --allow-run=cmd,npm build.ts

await Deno.writeTextFile(
  "package.json",
  JSON.stringify({
    dependencies: {
      "@picocss/pico": "^1.5.6",
    },
  }),
);
if (
  !(await Deno.run({
    cmd: [
      ...Deno.build.os === "windows" ? ["cmd", "/c"] : [],
      "npm",
      "install",
    ],
  }).status()).success
) {
  throw new Error("npm install failed");
}
await Deno.remove("package.json").catch(() => {});
await Deno.remove("package-lock.json").catch(() => {});
await Deno.remove("public", { recursive: true }).catch(() => {});
await Deno.mkdir("public/css", { recursive: true });
await Deno.copyFile(
  "node_modules/@picocss/pico/css/pico.min.css",
  "public/css/pico.min.css",
);
await Deno.remove("node_modules", { recursive: true }).catch(() => {});
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
