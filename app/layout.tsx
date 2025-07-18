import { SessionProvider } from "next-auth/react";
import { ClientBasketProvider } from "@/app/components/ClientBasketProvider";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/utils";
import "./globals.css";
import { Karla } from "next/font/google";
import Logo from "@/app/components/Logo";
import Nav from "@/app/components/Nav";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { NavigationProvider } from "@/lib/NavigationContext";
import { getAPI } from "@/lib/functions";
import type { SiteConfig, General } from "@/lib/types";

const karla = Karla({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

// const getSiteConfig = cache(() => getAPI<SiteConfig>("/site-config"));
export async function generateMetadata(): Promise<Metadata> {
  // "use cache";
  const data = await getAPI<SiteConfig>(
    "/site-config?populate[social_media][populate]=*&populate[SEO][populate]=*",
  );
  const general: General = {
    title: data.title,
    tagline: data.SEO?.metaDescription ?? "Petition",
    image: data.logo ?? "logo",
    website: data.SEO?.ogUrl || "url",
    slug: data.title,
  };

  return siteMetadata({
    social: (data.social_media && data.social_media) || [],
    // geolocation: data.manages_places[0].address.geo_locaiton || [],
    general: general,
    seo: {
      metaTitle: data.title,
      metaDescription: data.SEO?.metaDescription,
      keywords: data.SEO?.keywords,
      ogUrl: data.SEO?.ogUrl,
      ogImage: data?.logo,
      ogDescription: data.SEO?.metaDescription,
    },
  });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getAPI<SiteConfig>(
    "/site-config?populate[social_media][populate]=*",
  );
  return (
    <html lang="en">
      <body className={`${karla.variable} w-full h-full`}>
        <SessionProvider basePath={process.env.BASE_AUTH_PATH}>
          <ClientBasketProvider>
            <Header>
              <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 items-end px-5 lg:px-0">
                <Logo tagline={data.tagline} />
                <NavigationProvider>
                  <Nav type="main" />
                </NavigationProvider>
              </div>
            </Header>
            {children}
            <Footer />
          </ClientBasketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
