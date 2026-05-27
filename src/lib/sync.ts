import type { Customer, RetailProduct, ShiftEntry, ShiftSlot } from '../types';
import { supabase } from './supabase';

export interface ConfigPayload {
  products: RetailProduct[];
  customers: Customer[];
}

export async function fetchConfig(): Promise<ConfigPayload | null> {
  const { data, error } = await supabase
    .from('config')
    .select('products, customers')
    .eq('id', 'main')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    products: (data.products as RetailProduct[]) ?? [],
    customers: (data.customers as Customer[]) ?? [],
  };
}

export async function pushConfig(payload: ConfigPayload): Promise<void> {
  const { error } = await supabase.from('config').upsert({
    id: 'main',
    products: payload.products,
    customers: payload.customers,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function fetchShift(
  date: string,
  slot: ShiftSlot,
): Promise<ShiftEntry | null> {
  const { data, error } = await supabase
    .from('shifts')
    .select('data')
    .eq('date', date)
    .eq('slot', slot)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data.data as ShiftEntry;
}

export async function pushShift(entry: ShiftEntry): Promise<void> {
  const { error } = await supabase.from('shifts').upsert({
    date: entry.date,
    slot: entry.slot,
    data: entry,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function removeShift(date: string, slot: ShiftSlot): Promise<void> {
  const { error } = await supabase
    .from('shifts')
    .delete()
    .eq('date', date)
    .eq('slot', slot);
  if (error) throw error;
}

export async function fetchAllShifts(): Promise<ShiftEntry[]> {
  const { data, error } = await supabase.from('shifts').select('data');
  if (error) throw error;
  return (data ?? []).map((row) => row.data as ShiftEntry);
}
