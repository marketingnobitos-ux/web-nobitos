import { NextResponse } from "next/server";

// Resolusi brand dari hostname + proteksi /admin. Diisi di Milestone 2 & 4.
export function middleware() {
  return NextResponse.next();
}
