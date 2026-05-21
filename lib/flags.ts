export type FlagValue = { enabled: boolean; reason: string };
export type FlagMap = Record<string, FlagValue>;

const SDK_KEY = process.env.NEXT_PUBLIC_FFS_SDK_KEY ?? '';
const FFS_URL  = process.env.NEXT_PUBLIC_FFS_URL ?? '';

export async function evaluateFlags(environment = 'production'): Promise<FlagMap> {
  if (!SDK_KEY || !FFS_URL) return {};

  try {
    const res = await fetch(`${FFS_URL}/sdk/v1/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SDK-Key': SDK_KEY,
      },
      body: JSON.stringify({ environment, context: {} }),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return data.flags ?? {};
  } catch {
    return {};
  }
}
