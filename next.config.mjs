import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gscbuqtjqhleygrworlc.supabase.co", "images.unsplash.com"],
  },
};

export default nextConfig;
