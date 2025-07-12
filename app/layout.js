// app/layout.js
import "./globals.css";
import { Poppins } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper"; // ✅ normal import

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "TripForge AI – Smart Travel Itineraries",
  description: "Plan smarter, faster, and better trips with AI-powered multi-city itineraries tailored to your needs.",
  keywords: [
    "AI travel planner",
    "smart itinerary",
    "trip planner",
    "vacation AI",
    "travel assistant",
    "multi-city travel",
    "TripForge AI",
    "Hotel Booking",
    "Flight Booking"
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  openGraph: {
    title: "TripForge AI – Your AI-Powered Travel Assistant",
    description: "Get intelligent trip plans and optimized itineraries with TripForge AI.",
    url: "https://tripforge-ai.vercel.app",
    siteName: "TripForge AI",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "TripForge AI Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripForge AI – Smart Travel Planning",
    description: "Use AI to plan your perfect trip. Discover destinations, hotels, and create personalized itineraries.",
    images: ["/favicon.ico"],
    creator: "@TripForgeAI",
  },
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
