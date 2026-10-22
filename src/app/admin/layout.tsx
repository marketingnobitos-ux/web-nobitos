import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./admin.css";

// Font Admin saja (tidak ikut situs brand).
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin Nobitos", template: "%s · Admin Nobitos" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className={`adm ${manrope.variable}`}>{children}</div>;
}
