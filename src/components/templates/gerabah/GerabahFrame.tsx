import type { ComponentProps } from "react";
import { Archivo, Fraunces } from "next/font/google";
import "@/styles/tpl-gerabah.css";

// Template Gerabah (APW, referensi "Daily Dishes Lab"): judul & teks Archivo (variabel, sumbu lebar untuk judul kapital),
// aksen serif Fraunces. Dimuat lewat TemplateFrame, hanya untuk brand GERABAH.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", preload: false, variable: "--font-archivo" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], display: "swap", preload: false, variable: "--font-fraunces" });

export default function GerabahFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${archivo.variable} ${fraunces.variable} tpl-gerabah ${className ?? ""}`} />;
}
