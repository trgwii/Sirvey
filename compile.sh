rm -r bin
mkdir -p bin
deno run -A build.ts
deno upgrade --version 1.9.2
deno compile --allow-net --unstable --no-check --lite  --output bin/sirvey-aarch64-macos  --target aarch64-apple-darwin     sirvey.ts
deno compile --allow-net --unstable --no-check --lite  --output bin/sirvey-x86_64-linux   --target x86_64-unknown-linux-gnu sirvey.ts
deno compile --allow-net --unstable --no-check --lite  --output bin/sirvey-x86_64-macos   --target x86_64-apple-darwin      sirvey.ts
deno compile --allow-net --unstable --no-check --lite  --output bin/sirvey-x86_64-windows --target x86_64-pc-windows-msvc   sirvey.ts
if  [[ -z "${GITHUB_ACTION}" ]]; then
    deno upgrade
fi
