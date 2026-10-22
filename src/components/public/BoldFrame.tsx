import type { ComponentProps } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "@/styles/tpl-bold.css";

// Template BOLD (bawaan). Dimuat lewat TemplateFrame, hanya untuk brand BOLD.
// Judul: sans tebal yang bulat & ramah; teks: DM Sans.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
  variable: "--font-bricolage",
});
const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

export default function BoldFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${bricolage.variable} ${dmSans.variable} ${className ?? ""}`} />;
}
