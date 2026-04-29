const DEMO_DATA_KEY = 'profix_demo_data';

export interface DemoUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'supervisor' | 'plumber' | 'electrician' | 'customer';
  status: 'active' | 'inactive';
  avatar_url: string | null;
  phone: string | null;
  whatsapp_number: string | null;
  license_number: string | null;
  gps_tracking_enabled: boolean;
  current_location_lat: number | null;
  current_location_lng: number | null;
}

export interface DemoData {
  profiles: DemoUser[];
  customers: any[];
  quotes: any[];
  quote_approvals: any[];
  jobs: any[];
  appointments: any[];
  inventory_parts: any[];
  suppliers: any[];
  purchases: any[];
  payments: any[];
  pipeline_stages: any[];
  job_pipeline: any[];
  expenses: any[];
  notifications: any[];
  time_tracking: any[];
  invoices: any[];
  whatsapp_logs: any[];
  whatsapp_templates: any[];
  company_settings: any;
}

const defaultDemoData: DemoData = {
  profiles: [
    { id: 'admin-001', email: 'admin@profix.com', full_name: 'Admin ProFix', role: 'admin', status: 'active', avatar_url: null, phone: '+13055551234', whatsapp_number: '+13055551234', license_number: null, gps_tracking_enabled: false, current_location_lat: null, current_location_lng: null },
    { id: 'emp-001', email: 'mike@profix.com', full_name: 'Mike Johnson', role: 'plumber', status: 'active', avatar_url: null, phone: '+13055552345', whatsapp_number: '+13055552345', license_number: 'PLB-12345', gps_tracking_enabled: true, current_location_lat: 25.7617, current_location_lng: -80.1918 },
    { id: 'emp-002', email: 'sarah@profix.com', full_name: 'Sarah Williams', role: 'electrician', status: 'active', avatar_url: null, phone: '+13055553456', whatsapp_number: '+13055553456', license_number: 'ELC-67890', gps_tracking_enabled: true, current_location_lat: 25.78, current_location_lng: -80.18 },
    { id: 'emp-003', email: 'carlos@profix.com', full_name: 'Carlos Mendez', role: 'plumber', status: 'active', avatar_url: null, phone: '+13055554567', whatsapp_number: '+13055554567', license_number: 'PLB-54321', gps_tracking_enabled: true, current_location_lat: 25.75, current_location_lng: -80.20 },
    { id: 'emp-004', email: 'lisa@profix.com', full_name: 'Lisa Chen', role: 'electrician', status: 'active', avatar_url: null, phone: '+13055555678', whatsapp_number: '+13055555678', license_number: 'ELC-11111', gps_tracking_enabled: false, current_location_lat: null, current_location_lng: null },
    { id: 'emp-005', email: 'robert@profix.com', full_name: 'Robert Taylor', role: 'supervisor', status: 'active', avatar_url: null, phone: '+13055556789', whatsapp_number: '+13055556789', license_number: null, gps_tracking_enabled: false, current_location_lat: null, current_location_lng: null },
  ],
  customers: [
    { id: 'cust-001', name: 'Juan Perez', email: 'juan@email.com', phone: '+13055551111', whatsapp_number: '+13055551111', address: '456 Oak Ave, Miami, FL', type: 'residential', notes: 'Cliente frecuente', source: 'referral', created_at: '2024-01-15T10:00:00Z' },
    { id: 'cust-002', name: 'Maria Garcia', email: 'maria@email.com', phone: '+13055552222', whatsapp_number: '+13055552222', address: '789 Pine St, Miami, FL', type: 'residential', notes: '', source: 'google', created_at: '2024-02-10T10:00:00Z' },
    { id: 'cust-003', name: 'Carlos Rodriguez', email: 'carlos@email.com', phone: '+13055553333', whatsapp_number: '+13055553333', address: '321 Elm Dr, Miami, FL', type: 'residential', notes: '', source: 'walk-in', created_at: '2024-03-05T10:00:00Z' },
    { id: 'cust-004', name: 'Ana Lopez', email: 'ana@email.com', phone: '+13055554444', whatsapp_number: '+13055554444', address: '654 Maple Rd, Miami, FL', type: 'residential', notes: '', source: 'website', created_at: '2024-03-20T10:00:00Z' },
    { id: 'cust-005', name: 'Luis Martinez', email: 'luis@email.com', phone: '+13055555555', whatsapp_number: '+13055555555', address: '987 Cedar Ln, Miami, FL', type: 'commercial', notes: 'Dueño de restaurante', source: 'referral', created_at: '2024-04-01T10:00:00Z' },
    { id: 'cust-006', name: 'Laura Sanchez', email: 'laura@email.com', phone: '+13055556666', whatsapp_number: '+13055556666', address: '147 Birch St, Miami, FL', type: 'residential', notes: '', source: 'walk-in', created_at: '2024-04-10T10:00:00Z' },
    { id: 'cust-007', name: 'Pedro Gomez', email: 'pedro@email.com', phone: '+13055557777', whatsapp_number: '+13055557777', address: '258 Spruce Ave, Miami, FL', type: 'commercial', notes: '', source: 'google', created_at: '2024-04-15T10:00:00Z' },
    { id: 'cust-008', name: 'Sofia Diaz', email: 'sofia@email.com', phone: '+13055558888', whatsapp_number: '+13055558888', address: '369 Willow Dr, Miami, FL', type: 'residential', notes: '', source: 'website', created_at: '2024-05-01T10:00:00Z' },
  ],
  quotes: [
    { id: 'q-001', quote_number: 'Q-100001', customer_id: 'cust-001', employee_id: 'admin-001', status: 'draft', service_type: 'plumbing', description: 'Fuga en baño principal', line_items: [{ item_name: 'PVC Pipe 1/2"', qty: 5, unit_price: 5.00, total: 25.00 }, { item_name: 'Faucet Bathroom', qty: 1, unit_price: 69.99, total: 69.99 }], subtotal: 94.99, tax_amount: 6.65, discount_amount: 0, total: 101.64, valid_until: '2024-12-31T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: '', sent_via: null, created_at: '2024-04-01T10:00:00Z', customers: { name: 'Juan Perez', email: 'juan@email.com', phone: '+13055551111' } },
    { id: 'q-002', quote_number: 'Q-100002', customer_id: 'cust-002', employee_id: 'emp-001', status: 'sent', service_type: 'electrical', description: 'Instalación de luces LED', line_items: [{ item_name: 'LED Bulb 60W', qty: 10, unit_price: 5.99, total: 59.90 }, { item_name: 'Electrical Wire 12AWG', qty: 50, unit_price: 1.20, total: 60.00 }], subtotal: 119.90, tax_amount: 8.39, discount_amount: 0, total: 128.29, valid_until: '2025-01-05T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: '', sent_via: 'email', created_at: '2024-04-05T10:00:00Z', customers: { name: 'Maria Garcia', email: 'maria@email.com', phone: '+13055552222' } },
    { id: 'q-003', quote_number: 'Q-100003', customer_id: 'cust-003', employee_id: 'emp-002', status: 'pending_approval', service_type: 'both', description: 'Renovación completa baño y electricidad', line_items: [{ item_name: 'PVC Pipe 3/4"', qty: 10, unit_price: 7.00, total: 70.00 }, { item_name: 'GFCI Outlet', qty: 3, unit_price: 22.99, total: 68.97 }, { item_name: 'Labor', qty: 8, unit_price: 75.00, total: 600.00 }], subtotal: 738.97, tax_amount: 51.73, discount_amount: 50.00, total: 740.70, valid_until: '2025-01-10T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: 'Cliente VIP', sent_via: 'both', created_at: '2024-04-08T10:00:00Z', customers: { name: 'Carlos Rodriguez', email: 'carlos@email.com', phone: '+13055553333' } },
    { id: 'q-004', quote_number: 'Q-100004', customer_id: 'cust-004', employee_id: 'emp-003', status: 'approved', service_type: 'plumbing', description: 'Cambio de water heater', line_items: [{ item_name: 'Water Heater Element', qty: 2, unit_price: 49.99, total: 99.98 }, { item_name: 'Labor', qty: 4, unit_price: 75.00, total: 300.00 }], subtotal: 399.98, tax_amount: 28.00, discount_amount: 0, total: 427.98, valid_until: '2024-12-20T23:59:59Z', approved_at: '2024-04-12T14:30:00Z', approved_by: 'Ana Lopez', rejection_reason: null, converted_to_job_id: 'job-004', before_photos: [], notes: '', sent_via: 'whatsapp', created_at: '2024-04-10T10:00:00Z', customers: { name: 'Ana Lopez', email: 'ana@email.com', phone: '+13055554444' } },
    { id: 'q-005', quote_number: 'Q-100005', customer_id: 'cust-005', employee_id: 'admin-001', status: 'rejected', service_type: 'electrical', description: 'Panel upgrade', line_items: [{ item_name: 'Breaker 30A', qty: 4, unit_price: 25.99, total: 103.96 }, { item_name: 'Electrical Wire 14AWG', qty: 100, unit_price: 1.00, total: 100.00 }], subtotal: 203.96, tax_amount: 14.28, discount_amount: 0, total: 218.24, valid_until: '2024-12-15T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: 'Precio muy alto', converted_to_job_id: null, before_photos: [], notes: '', sent_via: 'email', created_at: '2024-04-12T10:00:00Z', customers: { name: 'Luis Martinez', email: 'luis@email.com', phone: '+13055555555' } },
    { id: 'q-006', quote_number: 'Q-100006', customer_id: 'cust-006', employee_id: 'emp-001', status: 'draft', service_type: 'plumbing', description: 'Desague lento cocina', line_items: [{ item_name: 'Drain Snake 25ft', qty: 1, unit_price: 39.99, total: 39.99 }, { item_name: 'P-trap Kit', qty: 1, unit_price: 16.99, total: 16.99 }], subtotal: 56.98, tax_amount: 3.99, discount_amount: 0, total: 60.97, valid_until: '2025-01-15T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: '', sent_via: null, created_at: '2024-04-15T10:00:00Z', customers: { name: 'Laura Sanchez', email: 'laura@email.com', phone: '+13055556666' } },
    { id: 'q-007', quote_number: 'Q-100007', customer_id: 'cust-007', employee_id: 'emp-002', status: 'sent', service_type: 'electrical', description: 'Instalación ceiling fans', line_items: [{ item_name: 'Ceiling Fan', qty: 4, unit_price: 119.99, total: 479.96 }, { item_name: 'Labor', qty: 3, unit_price: 75.00, total: 225.00 }], subtotal: 704.96, tax_amount: 49.35, discount_amount: 0, total: 754.31, valid_until: '2025-01-08T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: '', sent_via: 'email', created_at: '2024-04-18T10:00:00Z', customers: { name: 'Pedro Gomez', email: 'pedro@email.com', phone: '+13055557777' } },
    { id: 'q-008', quote_number: 'Q-100008', customer_id: 'cust-008', employee_id: 'emp-004', status: 'pending_approval', service_type: 'plumbing', description: 'Reemplazo de tuberías', line_items: [{ item_name: 'Copper Pipe 1/2"', qty: 20, unit_price: 16.00, total: 320.00 }, { item_name: 'Shut-off Valve', qty: 5, unit_price: 12.99, total: 64.95 }], subtotal: 384.95, tax_amount: 26.95, discount_amount: 20.00, total: 391.90, valid_until: '2025-01-02T23:59:59Z', approved_at: null, approved_by: null, rejection_reason: null, converted_to_job_id: null, before_photos: [], notes: '', sent_via: 'both', created_at: '2024-04-20T10:00:00Z', customers: { name: 'Sofia Diaz', email: 'sofia@email.com', phone: '+13055558888' } },
  ],
  quote_approvals: [
    { id: 'qa-001', quote_id: 'q-002', token: 'demo-token-001', customer_email: 'maria@email.com', customer_whatsapp: '+13055552222', status: 'pending', viewed_at: null, responded_at: null, ip_address: null, signature_url: null, created_at: '2024-04-05T10:00:00Z' },
    { id: 'qa-002', quote_id: 'q-003', token: 'demo-token-002', customer_email: 'carlos@email.com', customer_whatsapp: '+13055553333', status: 'pending', viewed_at: '2024-04-09T10:00:00Z', responded_at: null, ip_address: null, signature_url: null, created_at: '2024-04-08T10:00:00Z' },
  ],
  jobs: [
    { id: 'job-001', title: 'Fuga baño - Juan Perez', description: 'Fuga en baño principal', customer_id: 'cust-001', employee_id: 'emp-001', quote_id: null, status: 'pending', priority: 'high', service_type: 'plumbing', address: '456 Oak Ave, Miami, FL', lat: 25.76, lng: -80.19, scheduled_date: null, scheduled_time: null, estimated_duration: 120, actual_start: null, actual_end: null, materials_used: [], total_cost: 101.64, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-01T10:00:00Z', customers: { name: 'Juan Perez' }, profiles: { full_name: 'Mike Johnson' } },
    { id: 'job-002', title: 'Instalación LED - Maria Garcia', description: 'Instalación de luces LED', customer_id: 'cust-002', employee_id: 'emp-002', quote_id: 'q-002', status: 'scheduled', priority: 'medium', service_type: 'electrical', address: '789 Pine St, Miami, FL', lat: 25.77, lng: -80.18, scheduled_date: '2026-05-05', scheduled_time: '09:00', estimated_duration: 240, actual_start: null, actual_end: null, materials_used: [], total_cost: 128.29, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-05T10:00:00Z', customers: { name: 'Maria Garcia' }, profiles: { full_name: 'Sarah Williams' } },
    { id: 'job-003', title: 'Renovación baño - Carlos Rodriguez', description: 'Renovación completa', customer_id: 'cust-003', employee_id: 'emp-003', quote_id: 'q-003', status: 'in_progress', priority: 'urgent', service_type: 'both', address: '321 Elm Dr, Miami, FL', lat: 25.75, lng: -80.20, scheduled_date: '2026-04-28', scheduled_time: '08:00', estimated_duration: 480, actual_start: '2026-04-28T08:15:00Z', actual_end: null, materials_used: [{ part_id: 'part-001', name: 'PVC Pipe 3/4"', qty: 5, unit_price: 7.00 }], total_cost: 740.70, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-08T10:00:00Z', customers: { name: 'Carlos Rodriguez' }, profiles: { full_name: 'Carlos Mendez' } },
    { id: 'job-004', title: 'Water Heater - Ana Lopez', description: 'Cambio de water heater', customer_id: 'cust-004', employee_id: 'emp-001', quote_id: 'q-004', status: 'completed', priority: 'high', service_type: 'plumbing', address: '654 Maple Rd, Miami, FL', lat: 25.78, lng: -80.17, scheduled_date: '2026-04-25', scheduled_time: '10:00', estimated_duration: 180, actual_start: '2026-04-25T10:00:00Z', actual_end: '2026-04-25T13:00:00Z', materials_used: [{ part_id: 'part-008', name: 'Water Heater Element', qty: 2, unit_price: 49.99 }], total_cost: 427.98, payment_status: 'paid', invoice_number: 'INV-0001', notes: '', before_photos: [], after_photos: [], created_at: '2024-04-10T10:00:00Z', customers: { name: 'Ana Lopez' }, profiles: { full_name: 'Mike Johnson' } },
    { id: 'job-005', title: 'Panel upgrade - Luis Martinez', description: 'Panel upgrade', customer_id: 'cust-005', employee_id: null, quote_id: null, status: 'cancelled', priority: 'medium', service_type: 'electrical', address: '987 Cedar Ln, Miami, FL', lat: null, lng: null, scheduled_date: null, scheduled_time: null, estimated_duration: 300, actual_start: null, actual_end: null, materials_used: [], total_cost: 218.24, payment_status: 'unpaid', invoice_number: null, notes: 'Cliente rechazó quote', before_photos: [], after_photos: [], created_at: '2024-04-12T10:00:00Z', customers: { name: 'Luis Martinez' }, profiles: null },
    { id: 'job-006', title: 'Desague cocina - Laura Sanchez', description: 'Desague lento cocina', customer_id: 'cust-006', employee_id: 'emp-004', quote_id: 'q-006', status: 'scheduled', priority: 'low', service_type: 'plumbing', address: '147 Birch St, Miami, FL', lat: 25.74, lng: -80.21, scheduled_date: '2026-05-10', scheduled_time: '14:00', estimated_duration: 90, actual_start: null, actual_end: null, materials_used: [], total_cost: 60.97, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-15T10:00:00Z', customers: { name: 'Laura Sanchez' }, profiles: { full_name: 'Lisa Chen' } },
    { id: 'job-007', title: 'Ceiling fans - Pedro Gomez', description: 'Instalación ceiling fans', customer_id: 'cust-007', employee_id: 'emp-002', quote_id: 'q-007', status: 'pending', priority: 'medium', service_type: 'electrical', address: '258 Spruce Ave, Miami, FL', lat: 25.79, lng: -80.16, scheduled_date: null, scheduled_time: null, estimated_duration: 180, actual_start: null, actual_end: null, materials_used: [], total_cost: 754.31, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-18T10:00:00Z', customers: { name: 'Pedro Gomez' }, profiles: { full_name: 'Sarah Williams' } },
    { id: 'job-008', title: 'Reemplazo tuberías - Sofia Diaz', description: 'Reemplazo de tuberías', customer_id: 'cust-008', employee_id: 'emp-003', quote_id: 'q-008', status: 'scheduled', priority: 'high', service_type: 'plumbing', address: '369 Willow Dr, Miami, FL', lat: 25.73, lng: -80.22, scheduled_date: '2026-05-15', scheduled_time: '08:30', estimated_duration: 360, actual_start: null, actual_end: null, materials_used: [], total_cost: 391.90, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-20T10:00:00Z', customers: { name: 'Sofia Diaz' }, profiles: { full_name: 'Carlos Mendez' } },
    { id: 'job-009', title: 'Reparación general - Juan Perez', description: 'Múltiples reparaciones', customer_id: 'cust-001', employee_id: 'emp-001', quote_id: null, status: 'in_progress', priority: 'medium', service_type: 'both', address: '456 Oak Ave, Miami, FL', lat: 25.76, lng: -80.19, scheduled_date: '2026-04-29', scheduled_time: '10:00', estimated_duration: 300, actual_start: '2026-04-29T10:00:00Z', actual_end: null, materials_used: [], total_cost: 350.00, payment_status: 'partial', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-22T10:00:00Z', customers: { name: 'Juan Perez' }, profiles: { full_name: 'Mike Johnson' } },
    { id: 'job-010', title: 'Mantenimiento - Ana Lopez', description: 'Mantenimiento preventivo', customer_id: 'cust-004', employee_id: 'emp-005', quote_id: null, status: 'scheduled', priority: 'low', service_type: 'plumbing', address: '654 Maple Rd, Miami, FL', lat: 25.78, lng: -80.17, scheduled_date: '2026-04-30', scheduled_time: '09:00', estimated_duration: 120, actual_start: null, actual_end: null, materials_used: [], total_cost: 150.00, payment_status: 'unpaid', invoice_number: null, notes: '', before_photos: [], after_photos: [], created_at: '2024-04-25T10:00:00Z', customers: { name: 'Ana Lopez' }, profiles: { full_name: 'Robert Taylor' } },
  ],
  appointments: [
    { id: 'appt-001', job_id: 'job-002', customer_id: 'cust-002', employee_id: 'emp-002', date: new Date().toISOString().split('T')[0], time: '09:00', duration: 240, status: 'booked', reminder_sent: false, confirmation_status: null, created_at: '2024-04-05T10:00:00Z', customers: { name: 'Maria Garcia' }, profiles: { full_name: 'Sarah Williams' } },
    { id: 'appt-002', job_id: 'job-004', customer_id: 'cust-004', employee_id: 'emp-001', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 180, status: 'completed', reminder_sent: true, confirmation_status: 'confirmed', created_at: '2024-04-10T10:00:00Z', customers: { name: 'Ana Lopez' }, profiles: { full_name: 'Mike Johnson' } },
    { id: 'appt-003', job_id: 'job-006', customer_id: 'cust-006', employee_id: 'emp-004', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '14:00', duration: 90, status: 'booked', reminder_sent: false, confirmation_status: null, created_at: '2024-04-15T10:00:00Z', customers: { name: 'Laura Sanchez' }, profiles: { full_name: 'Lisa Chen' } },
    { id: 'appt-004', job_id: null, customer_id: 'cust-001', employee_id: 'emp-001', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], time: '11:00', duration: 120, status: 'booked', reminder_sent: false, confirmation_status: null, created_at: '2024-04-25T10:00:00Z', customers: { name: 'Juan Perez' }, profiles: { full_name: 'Mike Johnson' } },
    { id: 'appt-005', job_id: 'job-010', customer_id: 'cust-004', employee_id: 'emp-005', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], time: '09:00', duration: 120, status: 'booked', reminder_sent: false, confirmation_status: null, created_at: '2024-04-25T10:00:00Z', customers: { name: 'Ana Lopez' }, profiles: { full_name: 'Robert Taylor' } },
  ],
  inventory_parts: [
    { id: 'part-001', name: 'PVC Pipe 1/2"', sku: 'PVC-050', category: 'plumbing_parts', quantity_stock: 50, quantity_minimum: 10, price_cost: 2.50, price_sale: 5.00, supplier_id: null, location_warehouse: 'A1', barcode: '1234567890123', description: 'Tubería PVC estándar', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-002', name: 'PVC Pipe 3/4"', sku: 'PVC-075', category: 'plumbing_parts', quantity_stock: 45, quantity_minimum: 10, price_cost: 3.50, price_sale: 7.00, supplier_id: null, location_warehouse: 'A2', barcode: '1234567890124', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-003', name: 'Copper Pipe 1/2"', sku: 'COP-050', category: 'plumbing_parts', quantity_stock: 30, quantity_minimum: 8, price_cost: 8.00, price_sale: 16.00, supplier_id: null, location_warehouse: 'B1', barcode: '1234567890125', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-004', name: 'Faucet Kitchen', sku: 'FCT-KIT', category: 'plumbing_parts', quantity_stock: 12, quantity_minimum: 5, price_cost: 45.00, price_sale: 89.99, supplier_id: null, location_warehouse: 'C1', barcode: '1234567890126', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-005', name: 'Faucet Bathroom', sku: 'FCT-BATH', category: 'plumbing_parts', quantity_stock: 15, quantity_minimum: 5, price_cost: 35.00, price_sale: 69.99, supplier_id: null, location_warehouse: 'C2', barcode: '1234567890127', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-006', name: 'Toilet Flapper', sku: 'TFL-001', category: 'plumbing_parts', quantity_stock: 25, quantity_minimum: 8, price_cost: 3.00, price_sale: 7.99, supplier_id: null, location_warehouse: 'D1', barcode: '1234567890128', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-007', name: 'Drain Snake 25ft', sku: 'DS-025', category: 'plumbing_parts', quantity_stock: 8, quantity_minimum: 3, price_cost: 18.00, price_sale: 39.99, supplier_id: null, location_warehouse: 'D2', barcode: '1234567890129', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-008', name: 'Water Heater Element', sku: 'WHE-001', category: 'plumbing_parts', quantity_stock: 6, quantity_minimum: 4, price_cost: 25.00, price_sale: 49.99, supplier_id: null, location_warehouse: 'E1', barcode: '1234567890130', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-009', name: 'Pipe Wrench 14"', sku: 'PW-14', category: 'tools', quantity_stock: 10, quantity_minimum: 3, price_cost: 12.00, price_sale: 24.99, supplier_id: null, location_warehouse: 'T1', barcode: '1234567890131', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-010', name: 'Plunger Heavy Duty', sku: 'PLG-HD', category: 'tools', quantity_stock: 20, quantity_minimum: 8, price_cost: 8.00, price_sale: 15.99, supplier_id: null, location_warehouse: 'T2', barcode: '1234567890132', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-011', name: 'Electrical Wire 12AWG', sku: 'EW-12', category: 'electrical_parts', quantity_stock: 100, quantity_minimum: 25, price_cost: 0.50, price_sale: 1.20, supplier_id: null, location_warehouse: 'E2', barcode: '1234567890133', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-012', name: 'Electrical Wire 14AWG', sku: 'EW-14', category: 'electrical_parts', quantity_stock: 120, quantity_minimum: 30, price_cost: 0.40, price_sale: 1.00, supplier_id: null, location_warehouse: 'E3', barcode: '1234567890134', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-013', name: 'Outlet Duplex', sku: 'OUT-DPL', category: 'electrical_parts', quantity_stock: 40, quantity_minimum: 10, price_cost: 2.00, price_sale: 4.99, supplier_id: null, location_warehouse: 'E4', barcode: '1234567890135', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-014', name: 'Light Switch', sku: 'SW-001', category: 'electrical_parts', quantity_stock: 35, quantity_minimum: 10, price_cost: 1.50, price_sale: 3.99, supplier_id: null, location_warehouse: 'E5', barcode: '1234567890136', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-015', name: 'Breaker 20A', sku: 'BRK-20', category: 'electrical_parts', quantity_stock: 15, quantity_minimum: 5, price_cost: 8.00, price_sale: 18.99, supplier_id: null, location_warehouse: 'E6', barcode: '1234567890137', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-016', name: 'Breaker 30A', sku: 'BRK-30', category: 'electrical_parts', quantity_stock: 10, quantity_minimum: 4, price_cost: 12.00, price_sale: 25.99, supplier_id: null, location_warehouse: 'E7', barcode: '1234567890138', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-017', name: 'Ceiling Fan', sku: 'CF-001', category: 'electrical_parts', quantity_stock: 8, quantity_minimum: 3, price_cost: 55.00, price_sale: 119.99, supplier_id: null, location_warehouse: 'E8', barcode: '1234567890139', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-018', name: 'LED Bulb 60W', sku: 'LED-060', category: 'electrical_parts', quantity_stock: 60, quantity_minimum: 15, price_cost: 2.50, price_sale: 5.99, supplier_id: null, location_warehouse: 'E9', barcode: '1234567890140', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-019', name: 'Electrical Tape', sku: 'ET-001', category: 'electrical_parts', quantity_stock: 50, quantity_minimum: 15, price_cost: 1.00, price_sale: 2.99, supplier_id: null, location_warehouse: 'E10', barcode: '1234567890141', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-020', name: 'Wire Nuts (pack)', sku: 'WN-001', category: 'electrical_parts', quantity_stock: 30, quantity_minimum: 10, price_cost: 2.00, price_sale: 4.99, supplier_id: null, location_warehouse: 'E11', barcode: '1234567890142', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-021', name: 'Screwdriver Set', sku: 'SD-SET', category: 'tools', quantity_stock: 15, quantity_minimum: 5, price_cost: 18.00, price_sale: 34.99, supplier_id: null, location_warehouse: 'T3', barcode: '1234567890143', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-022', name: 'Voltage Tester', sku: 'VT-001', category: 'tools', quantity_stock: 8, quantity_minimum: 3, price_cost: 12.00, price_sale: 24.99, supplier_id: null, location_warehouse: 'T4', barcode: '1234567890144', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-023', name: 'Fish Tape 50ft', sku: 'FT-050', category: 'tools', quantity_stock: 5, quantity_minimum: 2, price_cost: 15.00, price_sale: 32.99, supplier_id: null, location_warehouse: 'T5', barcode: '1234567890145', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-024', name: 'Conduit 1/2"', sku: 'CON-050', category: 'electrical_parts', quantity_stock: 40, quantity_minimum: 10, price_cost: 3.00, price_sale: 6.99, supplier_id: null, location_warehouse: 'E12', barcode: '1234567890146', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-025', name: 'Shut-off Valve', sku: 'SOV-001', category: 'plumbing_parts', quantity_stock: 20, quantity_minimum: 6, price_cost: 6.00, price_sale: 12.99, supplier_id: null, location_warehouse: 'A3', barcode: '1234567890147', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-026', name: 'P-trap Kit', sku: 'PT-001', category: 'plumbing_parts', quantity_stock: 12, quantity_minimum: 4, price_cost: 8.00, price_sale: 16.99, supplier_id: null, location_warehouse: 'A4', barcode: '1234567890148', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-027', name: 'Teflon Tape', sku: 'TT-001', category: 'plumbing_parts', quantity_stock: 40, quantity_minimum: 15, price_cost: 0.50, price_sale: 1.99, supplier_id: null, location_warehouse: 'A5', barcode: '1234567890149', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-028', name: 'Pipe Cutter', sku: 'PC-001', category: 'tools', quantity_stock: 6, quantity_minimum: 2, price_cost: 14.00, price_sale: 28.99, supplier_id: null, location_warehouse: 'T6', barcode: '1234567890150', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-029', name: 'GFCI Outlet', sku: 'GFCI-001', category: 'electrical_parts', quantity_stock: 18, quantity_minimum: 6, price_cost: 10.00, price_sale: 22.99, supplier_id: null, location_warehouse: 'E13', barcode: '1234567890151', description: '', created_at: '2024-01-01T10:00:00Z' },
    { id: 'part-030', name: 'Dimmer Switch', sku: 'DM-001', category: 'electrical_parts', quantity_stock: 12, quantity_minimum: 4, price_cost: 15.00, price_sale: 34.99, supplier_id: null, location_warehouse: 'E14', barcode: '1234567890152', description: '', created_at: '2024-01-01T10:00:00Z' },
  ],
  suppliers: [
    { id: 'sup-001', name: 'Plumbing Supply Co', contact_name: 'John Smith', email: 'john@plumbingsupply.com', phone: '+13055556001', address: '100 Industrial Blvd, Miami, FL', products_supplied: ['PVC Pipe', 'Faucets'], created_at: '2024-01-01T10:00:00Z' },
    { id: 'sup-002', name: 'ElectroParts Inc', contact_name: 'Jane Doe', email: 'jane@electroparts.com', phone: '+13055556002', address: '200 Warehouse Dr, Miami, FL', products_supplied: ['Wire', 'Breakers', 'Outlets'], created_at: '2024-01-01T10:00:00Z' },
    { id: 'sup-003', name: 'Tool Masters', contact_name: 'Bob Wilson', email: 'bob@toolmasters.com', phone: '+13055556003', address: '300 Commerce St, Miami, FL', products_supplied: ['Tools', 'Equipment'], created_at: '2024-01-01T10:00:00Z' },
  ],
  purchases: [
    { id: 'pur-001', supplier_id: 'sup-001', date: '2024-04-15', items: [{ part_id: 'part-001', qty: 20, unit_cost: 2.00, total: 40.00 }, { part_id: 'part-002', qty: 15, unit_cost: 3.00, total: 45.00 }], total_amount: 85.00, status: 'received', receipt_url: null, notes: 'Orden mensual', created_at: '2024-04-15T10:00:00Z' },
    { id: 'pur-002', supplier_id: 'sup-002', date: '2024-04-20', items: [{ part_id: 'part-011', qty: 50, unit_cost: 0.40, total: 20.00 }], total_amount: 20.00, status: 'ordered', receipt_url: null, notes: '', created_at: '2024-04-20T10:00:00Z' },
  ],
  payments: [
    { id: 'pay-001', job_id: 'job-004', amount: 427.98, method: 'card', date: '2024-04-25T14:00:00Z', reference_number: 'TXN-12345', status: 'completed', created_at: '2024-04-25T14:00:00Z', jobs: { title: 'Water Heater - Ana Lopez' } },
    { id: 'pay-002', job_id: 'job-009', amount: 175.00, method: 'cash', date: '2024-04-29T12:00:00Z', reference_number: 'CASH-001', status: 'completed', created_at: '2024-04-29T12:00:00Z', jobs: { title: 'Reparación general - Juan Perez' } },
  ],
  pipeline_stages: [
    { id: 'stage-001', name: 'Lead', order: 1, color: '#64748b', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-002', name: 'Quote Sent', order: 2, color: '#3b82f6', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-003', name: 'Quote Approved', order: 3, color: '#10b981', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-004', name: 'Job Scheduled', order: 4, color: '#8b5cf6', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-005', name: 'In Progress', order: 5, color: '#f59e0b', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-006', name: 'Completed', order: 6, color: '#22c55e', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-007', name: 'Invoiced', order: 7, color: '#6366f1', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
    { id: 'stage-008', name: 'Paid', order: 8, color: '#10b981', default_for_service_type: null, created_at: '2024-01-01T10:00:00Z' },
  ],
  job_pipeline: [],
  expenses: [
    { id: 'exp-001', category: 'materials', amount: 85.00, date: '2024-04-15T10:00:00Z', description: 'Compra PVC pipes', receipt_url: null, employee_id: null, created_at: '2024-04-15T10:00:00Z' },
    { id: 'exp-002', category: 'fuel', amount: 45.00, date: '2024-04-20T10:00:00Z', description: 'Gasolina semana', receipt_url: null, employee_id: 'emp-001', created_at: '2024-04-20T10:00:00Z' },
    { id: 'exp-003', category: 'tools', amount: 28.99, date: '2024-04-22T10:00:00Z', description: 'Pipe Cutter nuevo', receipt_url: null, employee_id: null, created_at: '2024-04-22T10:00:00Z' },
    { id: 'exp-004', category: 'office', amount: 120.00, date: '2024-04-25T10:00:00Z', description: 'Papelería y suministros', receipt_url: null, employee_id: null, created_at: '2024-04-25T10:00:00Z' },
    { id: 'exp-005', category: 'salary', amount: 2500.00, date: '2024-04-30T10:00:00Z', description: 'Nómina mensual', receipt_url: null, employee_id: null, created_at: '2024-04-30T10:00:00Z' },
  ],
  notifications: [
    { id: 'notif-001', user_id: 'admin-001', type: 'quote_sent', message: 'Presupuesto Q-100002 enviado a Maria Garcia', read_status: false, created_at: '2024-04-05T10:00:00Z' },
    { id: 'notif-002', user_id: 'admin-001', type: 'job_assigned', message: 'Job asignado a Sarah Williams', read_status: false, created_at: '2024-04-05T10:00:00Z' },
    { id: 'notif-003', user_id: 'admin-001', type: 'payment_received', message: 'Pago recibido $427.98 - Ana Lopez', read_status: true, created_at: '2024-04-25T14:00:00Z' },
  ],
  time_tracking: [],
  invoices: [
    { id: 'inv-001', job_id: 'job-004', invoice_number: 'INV-0001', issue_date: '2024-04-25', due_date: '2024-05-25', subtotal: 399.98, tax_amount: 28.00, total: 427.98, status: 'paid', pdf_url: null, created_at: '2024-04-25T10:00:00Z' },
  ],
  whatsapp_logs: [
    { id: 'wa-001', type: 'quote_sent', to_number: '+13055553333', message_preview: 'Hola Carlos...', status: 'sent', error_message: null, sent_at: '2024-04-08T10:00:00Z', related_id: 'q-003', created_at: '2024-04-08T10:00:00Z' },
  ],
  whatsapp_templates: [
    { id: 'wt-001', name: 'Quote Sent', template_body: 'Hola {{customer_name}}! Somos ProFix. Te enviamos el presupuesto #{{quote_number}} por ${{total}} para {{service_type}}. Valido hasta {{valid_until}}. Aprobar aqui: {{approval_link}}', type: 'quote', is_active: true, created_at: '2024-01-01T10:00:00Z' },
    { id: 'wt-002', name: 'Quote Reminder', template_body: 'Hola {{customer_name}}, recordatorio: tu presupuesto #{{quote_number}} de ${{total}} expira pronto ({{valid_until}}). Aprobar aqui: {{approval_link}}', type: 'quote', is_active: true, created_at: '2024-01-01T10:00:00Z' },
    { id: 'wt-003', name: 'Appointment Reminder', template_body: 'Hola {{customer_name}}, recordatorio de cita manana {{date}} a las {{time}} con {{employee_name}}. Direccion: {{address}}', type: 'appointment', is_active: true, created_at: '2024-01-01T10:00:00Z' },
    { id: 'wt-004', name: 'Job Completed', template_body: 'Hola {{customer_name}}, tu trabajo de {{service_type}} ha sido completado. Invoice #{{invoice_number}}: ${{total}}.', type: 'job', is_active: true, created_at: '2024-01-01T10:00:00Z' },
    { id: 'wt-005', name: 'Payment Received', template_body: 'Gracias {{customer_name}}! Confirmamos pago de ${{amount}}. Invoice #{{invoice_number}}. Gracias por preferirnos!', type: 'payment', is_active: true, created_at: '2024-01-01T10:00:00Z' },
  ],
  company_settings: {
    id: 'comp-001',
    logo_url: null,
    name: 'ProFix Plumbing & Electrical',
    address: '123 Main St, Miami, FL 33101',
    phone: '+1 (305) 555-0123',
    email: 'info@profix.com',
    tax_rate: 7.0,
    currency: 'USD',
    timezone: 'America/New_York',
    branding_colors: { primary: '#1e3a5f', secondary: '#10b981' },
    whatsapp_business_number: '+13055550123',
    auto_send_quote_whatsapp: true,
    auto_send_reminder_whatsapp: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
  },
};

export function isDemoMode(): boolean {
  return true; // Always demo mode for static deployment
}

export function getDemoData(): DemoData {
  const stored = localStorage.getItem(DEMO_DATA_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(defaultDemoData));
  return defaultDemoData;
}

export function saveDemoData(data: DemoData) {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
}

export function resetDemoData() {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(defaultDemoData));
}

export function getCurrentDemoUser(): DemoUser | null {
  const stored = localStorage.getItem('profix_demo_user');
  return stored ? JSON.parse(stored) : null;
}

export function setCurrentDemoUser(user: DemoUser | null) {
  if (user) {
    localStorage.setItem('profix_demo_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('profix_demo_user');
  }
}
