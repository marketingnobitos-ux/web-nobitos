import type { ComponentProps } from "react";
import { M_PLUS_Rounded_1c, Nunito_Sans } from "next/font/google";

// Template Tungku: judul M PLUS Rounded 1c 300 (tipis), tombol 400, isi Nunito Sans 300–400. Dimuat lewat TemplateFrame,
// hanya untuk brand TUNGKU. M PLUS Rounded 1c font Jepang: CSS-nya ±250 @font-face (±62 KB gzip) walau subset latin,
// jadi wajib tidak ikut terunduh brand lain. Gaya .tpl-tungku sementara masih di globals.css.
const mplusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  preload: false,
  variable: "--font-mplus-rounded",
});
const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["300", "400"], display: "swap", preload: false, variable: "--font-nunito-sans" });

export default function TungkuFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${mplusRounded.variable} ${nunitoSans.variable} tpl-tungku ${className ?? ""}`} />;
}
