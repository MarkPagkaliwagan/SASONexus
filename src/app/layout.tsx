import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sasonexus.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "Student Affairs Services Office",
    template: "%s | SASO - San Pablo Colleges",
  },
  description:
    "Student Affairs and Services Office of San Pablo Colleges - Supporting students in their academic journey.",
  icons: [
    { rel: "icon", url: "/SASOLOGO.png" },
    { rel: "apple-touch-icon", url: "/SASOLOGO.png" },
  ],
  openGraph: {
    title: "Student Affairs Services Office",
    description:
      "Student Affairs and Services Office of San Pablo Colleges - Supporting students in their academic journey.",
    url: siteUrl,
    siteName: "SASO - San Pablo Colleges",
    images: [
      {
        url: `${siteUrl}/SASOLOGO.png`,
        width: 488,
        height: 487,
        alt: "SASO Logo",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Affairs Services Office",
    description:
      "Student Affairs and Services Office of San Pablo Colleges - Supporting students in their academic journey.",
    images: [`${siteUrl}/SASOLOGO.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
