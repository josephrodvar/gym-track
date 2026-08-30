import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Serwist's plugin always adds a webpack() key to the config, which
// conflicts with Turbopack (Next's default for `next dev`). Only wrap with
// Serwist for the production build (`next build --webpack`), which is the
// only place the service worker actually needs to be compiled.
const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default process.env.NODE_ENV === "production"
  ? withSerwist(nextConfig)
  : nextConfig;
