// src/services/airkitService.ts
import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

export type AirUserDetails = {
  uuid?: string;
  sub?: string;
  email?: string;
  name?: string;
  [k: string]: unknown;
};

let svc: AirService | null = null;

export function getAirService() {
  if (!svc) {
    const partnerId = import.meta.env.VITE_AIRKIT_PARTNER_ID as string;
    svc = new AirService({ partnerId });
  }
  return svc;
}

export async function initAir() {
  const s = getAirService();
  await s.init({
    buildEnv: BUILD_ENV.SANDBOX,     // enum, not "sandbox"
    enableLogging: true,
    skipRehydration: false,          // satisfy versions that expect it
  });
  return s;
}

export async function loginAir(): Promise<{ user: AirUserDetails; token: string }> {
  const s = await initAir();
  await s.login();
  const user = (await s.getUserInfo()) as AirUserDetails;
  const rawToken = await s.getAccessToken();
  const token = typeof rawToken === 'string' ? rawToken : (rawToken && (rawToken as any).token) || '';
  return { user, token };
}
