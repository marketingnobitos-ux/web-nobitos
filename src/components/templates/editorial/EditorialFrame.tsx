import type { ComponentProps } from "react";
import { Instrument_Sans } from "next/font/google";
import "@/styles/tpl-editorial.css";

// Template Editorial: satu keluarga sans geometris, italic untuk penekanan. Dimuat lewat TemplateFrame, hanya untuk
// brand EDITORIAL.
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-sans",
});

export default function EditorialFrame({ className, ...props }: ComponentProps<"div">) {
  return <div {...props} className={`${instrumentSans.variable} tpl-editorial ${className ?? ""}`} />;
}
