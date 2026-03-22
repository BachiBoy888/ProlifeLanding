const API_URL = import.meta.env.VITE_API_URL ?? '';

export type DeliveryType = 'air' | 'road' | 'express' | 'economy' | 'standard' | 'premium';
export type LeadEntryPoint = 'calculator' | 'contact_form' | 'lab_calculator';

export interface LeadPayload {
  name?: string;
  phone: string;
  company?: string;
  weight: number;
  volume: number;
  originCity?: string;
  deliveryType: DeliveryType;
  estimatedPrice?: number;
  estimatedCurrency?: string;
  estimatedDaysMin?: number;
  estimatedDaysMax?: number;
  source: 'prolife_site';
  leadEntryPoint: LeadEntryPoint;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  website: '';
}

export type SubmitResult = { ok: true } | { ok: false; status: number };

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: res.status };
}
