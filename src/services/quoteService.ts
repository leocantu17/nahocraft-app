/**
 * Servicio de Tickets de Cotizaciones y Solicitudes de Clientes
 * Módulo desacoplado de Supabase (PostgreSQL + RLS)
 */

import { supabase, isSupabaseConfigured } from '../lib/conexion';
import type { Database } from '../types/supabase';
import type { QuoteTicket, QuoteFormData } from '../types';

// =============================================================================
// QUOTE TICKETS
// =============================================================================

export async function fetchQuoteTickets(): Promise<QuoteTicket[] | null> {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('quote_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return null;

  return data.map((q) => ({
    folio: q.folio,
    createdAt: q.created_at_display,
    status: q.status as QuoteTicket['status'],
    formData: q.form_data as unknown as QuoteFormData,
    referenceArtTitle: q.reference_art_title || undefined,
    quotedAmount: q.quoted_amount ? Number(q.quoted_amount) : undefined,
    adminNotes: q.admin_notes || undefined,
  }));
}

export async function insertQuoteTicket(ticket: QuoteTicket): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('quote_tickets').insert({
    folio: ticket.folio,
    created_at_display: ticket.createdAt,
    status: ticket.status,
    form_data: ticket.formData,
    reference_art_title: ticket.referenceArtTitle || null,
    quoted_amount: ticket.quotedAmount || null,
    admin_notes: ticket.adminNotes || null,
  });
  return !error;
}

export async function updateQuoteTicketDb(
  folio: string,
  partial: Partial<Pick<QuoteTicket, 'status' | 'quotedAmount' | 'adminNotes'>>
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const payload: Database['public']['Tables']['quote_tickets']['Update'] = {};
  if (partial.status !== undefined) payload.status = partial.status;
  if (partial.quotedAmount !== undefined) payload.quoted_amount = partial.quotedAmount;
  if (partial.adminNotes !== undefined) payload.admin_notes = partial.adminNotes;

  const { error } = await supabase
    .from('quote_tickets')
    .update(payload)
    .eq('folio', folio);

  return !error;
}

export async function deleteQuoteTicketDb(folio: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  const { error } = await supabase.from('quote_tickets').delete().eq('folio', folio);
  return !error;
}

