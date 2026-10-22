import type { ComponentProps } from "react";
import { Courier_Prime, Space_Mono } from "next/font/google";
import "@/styles/tpl-anglo.css";

// Template Anglo (kertas & zine): label/harga mesin ketik, paragraf Courier. Dimuat lewat TemplateFrame, hanya untuk
// brand ANGLO. Font judul spidol (Caveat Brush) di-self-host di tpl-anglo.css & di-preload di layout publik.
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false, variable: "--font-space-mono" });
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-courier-prime",
});

export default function AngloFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${spaceMono.variable} ${courierPrime.variable} tpl-anglo ${className ?? ""}`} />;
}
