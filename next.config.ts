import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: "C:/Users/vandi/Downloads/stitch_vegan_delights_homepage (1)/vegan-delights-app",
  }
};

export default withNextIntl(nextConfig);
