import type { ComponentProps } from "react";
import { Anton, Oswald } from "next/font/google";
import "@/styles/tpl-dadak.css";

// Template Dadak (Aminoto, referensi "kado"): judul Anton (kondensed tebal), teks Oswald 400–600. Dimuat lewat
// TemplateFrame, hanya untuk brand DADAK.
const anton = Anton({ subsets: ["latin"], weight: "400", display: "swap", preload: false, variable: "--font-anton" });
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", preload: false, variable: "--font-oswald" });

export default function DadakFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${anton.variable} ${oswald.variable} tpl-dadak ${className ?? ""}`} />;
}
