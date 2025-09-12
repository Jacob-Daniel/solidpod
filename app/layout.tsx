import { ClientBasketProvider } from "@/app/components/ClientBasketProvider";
import { SolidSessionProvider } from "@/lib/sessionContext";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/utils";
import "./globals.css";
import { Karla } from "next/font/google";
import Logo from "@/app/components/Logo";
import ThemeToggle from "@/app/components/ThemeToggle";
import Nav from "@/app/components/Nav";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { NavigationProvider } from "@/lib/navigationContext";
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
    tagline: data.SEO?.metaDescription ?? "Archive",
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
      <body
        className={`${karla.variable} w-full h-full min-h-[500px] text-slate-900 font-sans dark:bg-zinc-900 text-black dark:text-white`}
      >
        <SolidSessionProvider>
          <ClientBasketProvider>
            <Header>
              <div className="col-span-12 lg:col-start-2 lg:col-span-10 grid grid-cols-12 items-end px-5 lg:px-0 border-b border-gray-300 dark:border-zinc-800 relative">
                <Logo tagline={data.title} />
                <ThemeToggle type="desktop" />
                <NavigationProvider>
                  <Nav type="main" />
                </NavigationProvider>
              </div>
            </Header>
            <div className="w-full max-w-[1500px] align-middle mx-auto">
              {children}
            </div>

            <Footer />
          </ClientBasketProvider>
        </SolidSessionProvider>
      </body>
    </html>
  );
}
