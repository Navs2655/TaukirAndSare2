/** @type {import('next').NextConfig} */

/** const BASE_PATH = "/taukirandsaranew"; */
 const BASE_PATH = "";

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: BASE_PATH,
  assetPrefix: `${BASE_PATH}/`,
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
};

export default nextConfig;
