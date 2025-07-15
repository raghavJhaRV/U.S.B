import dns from 'dns/promises';
import { URL } from 'url';

export async function resolveIPv4DatabaseUrl(originalUrl: string): Promise<string> {
  const parsed = new URL(originalUrl);
  const host = parsed.hostname;

  // Get all A records (IPv4)
  const addresses = await dns.resolve4(host);
  if (!addresses.length) throw new Error(`Could not resolve IPv4 address for DB host: ${host}`);

  parsed.hostname = addresses[0];
  parsed.host = `${addresses[0]}:${parsed.port}`;

  return parsed.toString();
}
