rm -r bin
mkdir -p bin
deno run -A build.ts
deno upgrade --version 1.9.2
deno compile --allow-net --unstable --no-check --lite --target x86_64-unknown-linux-gnu --output bin/sirvey-x86_64-linux   sirvey.ts
deno compile --allow-net --unstable --no-check --lite --target x86_64-pc-windows-msvc   --output bin/sirvey-x86_64-windows sirvey.ts
deno compile --allow-net --unstable --no-check --lite --target x86_64-apple-darwin      --output bin/sirvey-x86_64-macos   sirvey.ts
deno compile --allow-net --unstable --no-check --lite --target aarch64-apple-darwin     --output bin/sirvey-aarch64-macos  sirvey.ts
deno upgrade
