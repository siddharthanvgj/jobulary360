import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobulary 360 — Enterprise 360° Assessment Platform",
    description: "AI-powered 360 feedback at enterprise scale. Customizable competency frameworks, real-time analytics, GDPR-compliant, and deployable across 40+ languages.",
    };

    export default function RootLayout({
      children,
      }: Readonly<{
        children: React.ReactNode;
        }>) {
          return (
              <html lang="en">
                    <body>{children}</body>
                        </html>
                          );
                          }