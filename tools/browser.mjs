// Browser launch options shared by render.mjs and still.mjs.
// macOS: Google Chrome with Metal (the skill's default). Linux (no GPU): Playwright's bundled Chromium with
// SwiftShader WebGL, so the deterministic engine still renders, only slower.
export function launchOptions() {
  if (process.platform === "darwin")
    return {
      channel: "chrome",
      headless: true,
      args: [
        "--use-angle=metal",
        "--enable-gpu",
        "--ignore-gpu-blocklist",
        "--enable-unsafe-swiftshader=false",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
      ],
    };
  return {
    executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium",
    headless: true,
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--ignore-gpu-blocklist",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-dev-shm-usage",
    ],
  };
}
