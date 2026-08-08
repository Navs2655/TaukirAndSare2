/** @type {import('next').NextConfig} */

// Single source of truth — change this one line when you move to your
// custom domain (set it to "" once basePath is no longer needed).
const BASE_PATH = "/TaukirandSara";

const nextConfig = {
  reactStrictMode: true,
  output: "export", // Static export — required for GitHub Pages (no Node server there)
  images: {
    unoptimized: true, // GitHub Pages can't run Next's image optimization server
  },
  // Required because this site is served from a subpath: navs2655.github.io/TaukirandSara
  // Without this, CSS/JS/fonts 404 silently and the page falls back to unstyled HTML.
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH ? `${BASE_PATH}/` : undefined,
  env: {
    // Exposed to client components so hardcoded asset paths (e.g. <audio src>)
    // can be prefixed correctly too — Next only auto-prefixes its own
    // components (Image, Link, Script), not raw src strings.
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
