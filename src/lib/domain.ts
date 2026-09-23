// Kelola domain brand (PRD Bagian 10.4): validasi hostname & cek DNS.
import { lookup, Resolver } from "node:dns/promises";
import type { DomainStatus } from "@prisma/client";
import { normalizeHost } from "@/lib/brand";

export function serverIp(): string | null {
  return process.env.SERVER_IP?.trim() || null;
}

const LABEL = "(?!-)[a-z0-9-]{1,63}(?<!-)";
const HOSTNAME_RE = new RegExp(`^(?:${LABEL}\\.)+[a-z]{2,63}$`);

/** "https://WWW.Contoh.com:443/menu" -> "www.contoh.com" */
export function cleanHostname(input: string): string {
  const withoutScheme = input.trim().toLowerCase().replace(/^[a-z]+:\/\//, "");
  return normalizeHost(withoutScheme.split(/[/?#]/)[0]);
}

/** Pesan error kalau hostname tidak boleh dipakai, atau null kalau valid. */
export function hostnameError(hostname: string): string | null {
  if (!hostname) return "Hostname wajib diisi.";
  if (hostname.length > 253 || !HOSTNAME_RE.test(hostname)) {
    return "Format domain tidak valid. Contoh: pecelleleaminoto.com";
  }
  const adminHost = process.env.ADMIN_HOST ? normalizeHost(process.env.ADMIN_HOST) : null;
  if (adminHost && hostname === adminHost) return "Domain ini dipakai untuk panel admin.";
  return null;
}

export type DnsCheck = { status: Exclude<DomainStatus, "ACTIVE">; addresses: string[]; message: string };

// Tanya DNS publik agar hasil segar (tidak kena cache DNS lokal/ISP).
const PUBLIC_DNS = ["1.1.1.1", "8.8.8.8"];
// Error jaringan ke server DNS (bukan jawaban "domain tidak ada").
const NETWORK_ERRORS = new Set(["ECONNREFUSED", "ETIMEOUT", "ECONNRESET", "ESERVFAIL", "EREFUSED", "EOF"]);

async function resolveA(hostname: string): Promise<string[]> {
  const resolver = new Resolver({ timeout: 5000, tries: 2 });
  resolver.setServers(PUBLIC_DNS);
  try {
    return await resolver.resolve4(hostname);
  } catch (e) {
    if (!NETWORK_ERRORS.has((e as { code?: string }).code ?? "")) throw e;
    // Cadangan: resolver sistem operasi.
    const results = await lookup(hostname, { all: true, family: 4 });
    return results.map((r) => r.address);
  }
}

/** Resolve A record dan bandingkan dengan SERVER_IP. */
export async function checkDns(hostname: string, expectedIp: string): Promise<DnsCheck> {
  try {
    const addresses = await resolveA(hostname);
    if (addresses.includes(expectedIp)) {
      return { status: "VERIFIED", addresses, message: `Sudah mengarah ke server (${expectedIp}).` };
    }
    return {
      status: "PENDING",
      addresses,
      message: `Belum mengarah ke server. A record saat ini: ${addresses.join(", ")} — seharusnya ${expectedIp}.`,
    };
  } catch (e) {
    const code = (e as { code?: string }).code ?? "UNKNOWN";
    const reason =
      code === "ENOTFOUND" || code === "NXDOMAIN"
        ? "domain tidak ditemukan"
        : code === "ENODATA"
          ? "belum ada A record"
          : code === "ETIMEOUT"
            ? "DNS tidak merespons"
            : code;
    return { status: "ERROR", addresses: [], message: `Gagal resolve DNS (${reason}).` };
  }
}
