import { createClient } from '@supabase/supabase-js';
import { isDemoMode } from './demoData';
import { demoSupabase } from './demoSupabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let realSupabase: any = null;

if (supabaseUrl && supabaseAnonKey && !isDemoMode()) {
  realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = realSupabase || demoSupabase;

export type Database = {
  public: {
    Tables: {
      company_settings: {
        Row: {
          id: string;
          logo_url: string | null;
          name: string;
          address: string | null;
          phone: string | null;
          email: string | null;
          tax_rate: number;
          currency: string;
          timezone: string;
          branding_colors: Record<string, string> | null;
          whatsapp_business_number: string | null;
          auto_send_quote_whatsapp: boolean;
          auto_send_reminder_whatsapp: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Tables['company_settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Tables['company_settings']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'admin' | 'supervisor' | 'plumber' | 'electrician' | 'customer';
          status: 'active' | 'inactive';
          avatar_url: string | null;
          license_number: string | null;
          gps_tracking_enabled: boolean;
          current_location_lat: number | null;
          current_location_lng: number | null;
          last_location_update: string | null;
          whatsapp_number: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      customers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          whatsapp_number: string | null;
          address: string | null;
          type: 'residential' | 'commercial';
          notes: string | null;
          source: string | null;
          created_at: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          quote_number: string;
          customer_id: string;
          employee_id: string | null;
          status: 'draft' | 'sent' | 'pending_approval' | 'approved' | 'rejected' | 'expired';
          service_type: 'plumbing' | 'electrical' | 'both';
          description: string | null;
          line_items: Array<{item_name: string; qty: number; unit_price: number; total: number}>;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total: number;
          valid_until: string | null;
          approved_at: string | null;
          approved_by: string | null;
          rejection_reason: string | null;
          converted_to_job_id: string | null;
          before_photos: string[] | null;
          notes: string | null;
          sent_via: string | null;
          created_at: string;
        };
      };
      quote_approvals: {
        Row: {
          id: string;
          quote_id: string;
          token: string;
          customer_email: string | null;
          customer_whatsapp: string | null;
          status: 'pending' | 'approved' | 'rejected';
          viewed_at: string | null;
          responded_at: string | null;
          ip_address: string | null;
          signature_url: string | null;
          created_at: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          customer_id: string;
          employee_id: string | null;
          quote_id: string | null;
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          service_type: 'plumbing' | 'electrical' | 'both';
          address: string | null;
          lat: number | null;
          lng: number | null;
          scheduled_date: string | null;
          scheduled_time: string | null;
          estimated_duration: number | null;
          actual_start: string | null;
          actual_end: string | null;
          materials_used: Array<{part_id: string; name: string; qty: number; unit_price: number}> | null;
          total_cost: number;
          payment_status: 'unpaid' | 'paid' | 'partial';
          invoice_number: string | null;
          notes: string | null;
          before_photos: string[] | null;
          after_photos: string[] | null;
          created_at: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          job_id: string | null;
          customer_id: string;
          employee_id: string | null;
          date: string;
          time: string;
          duration: number;
          status: 'booked' | 'completed' | 'no_show' | 'cancelled';
          reminder_sent: boolean;
          confirmation_status: string | null;
          created_at: string;
        };
      };
      inventory_parts: {
        Row: {
          id: string;
          name: string;
          sku: string;
          category: 'plumbing_parts' | 'electrical_parts' | 'tools' | 'general';
          quantity_stock: number;
          quantity_minimum: number;
          price_cost: number;
          price_sale: number;
          supplier_id: string | null;
          location_warehouse: string | null;
          barcode: string | null;
          description: string | null;
          created_at: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          products_supplied: string[] | null;
          created_at: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          supplier_id: string;
          date: string;
          items: Array<{part_id: string; qty: number; unit_cost: number; total: number}>;
          total_amount: number;
          status: 'ordered' | 'received' | 'cancelled';
          receipt_url: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          job_id: string;
          amount: number;
          method: 'cash' | 'card' | 'check' | 'online';
          date: string;
          reference_number: string | null;
          status: string;
          created_at: string;
        };
      };
      pipeline_stages: {
        Row: {
          id: string;
          name: string;
          order: number;
          color: string;
          default_for_service_type: string | null;
          created_at: string;
        };
      };
      job_pipeline: {
        Row: {
          id: string;
          job_id: string;
          stage_id: string;
          entered_at: string;
          exited_at: string | null;
          notes: string | null;
        };
      };
      expenses: {
        Row: {
          id: string;
          category: string;
          amount: number;
          date: string;
          description: string | null;
          receipt_url: string | null;
          employee_id: string | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          message: string;
          read_status: boolean;
          created_at: string;
        };
      };
      time_tracking: {
        Row: {
          id: string;
          employee_id: string;
          job_id: string | null;
          clock_in: string;
          clock_out: string | null;
          break_duration: number;
          notes: string | null;
          created_at: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          job_id: string;
          invoice_number: string;
          issue_date: string;
          due_date: string;
          subtotal: number;
          tax_amount: number;
          total: number;
          status: 'draft' | 'sent' | 'paid' | 'overdue';
          pdf_url: string | null;
          created_at: string;
        };
      };
      whatsapp_logs: {
        Row: {
          id: string;
          type: string;
          to_number: string;
          message_preview: string;
          status: 'sent' | 'delivered' | 'failed';
          error_message: string | null;
          sent_at: string;
          related_id: string | null;
          created_at: string;
        };
      };
      whatsapp_templates: {
        Row: {
          id: string;
          name: string;
          template_body: string;
          type: string;
          is_active: boolean;
          created_at: string;
        };
      };
    };
  };
};

export type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type Customer = Tables['customers']['Row'];
export type Quote = Tables['quotes']['Row'];
export type QuoteApproval = Tables['quote_approvals']['Row'];
export type Job = Tables['jobs']['Row'];
export type Appointment = Tables['appointments']['Row'];
export type InventoryPart = Tables['inventory_parts']['Row'];
export type Supplier = Tables['suppliers']['Row'];
export type Purchase = Tables['purchases']['Row'];
export type Payment = Tables['payments']['Row'];
export type PipelineStage = Tables['pipeline_stages']['Row'];
export type Expense = Tables['expenses']['Row'];
export type Notification = Tables['notifications']['Row'];
export type Invoice = Tables['invoices']['Row'];
export type WhatsAppLog = Tables['whatsapp_logs']['Row'];
export type WhatsAppTemplate = Tables['whatsapp_templates']['Row'];
