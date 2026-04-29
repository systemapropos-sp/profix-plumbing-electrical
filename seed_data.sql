-- ProFix Seed Data
-- Run after schema is created

-- Company Settings
INSERT INTO company_settings (name, address, phone, email, tax_rate, currency, whatsapp_business_number, auto_send_quote_whatsapp, auto_send_reminder_whatsapp)
VALUES (
  'ProFix Plumbing & Electrical',
  '123 Main St, Miami, FL 33101',
  '+1 (305) 555-0123',
  'info@profix.com',
  7.0,
  'USD',
  '+13055550123',
  TRUE,
  TRUE
);

-- WhatsApp Templates
INSERT INTO whatsapp_templates (name, template_body, type, is_active) VALUES
('Quote Sent', 'Hola {{customer_name}}! Somos ProFix. Te enviamos el presupuesto #{{quote_number}} por ${{total}} para {{service_type}}. Valido hasta {{valid_until}}. Aprobar aqui: {{approval_link}}', 'quote', TRUE),
('Quote Reminder', 'Hola {{customer_name}}, recordatorio: tu presupuesto #{{quote_number}} de ${{total}} expira pronto ({{valid_until}}). Aprobar aqui: {{approval_link}}', 'quote', TRUE),
('Appointment Reminder', 'Hola {{customer_name}}, recordatorio de cita manana {{date}} a las {{time}} con {{employee_name}}. Direccion: {{address}}', 'appointment', TRUE),
('Job Completed', 'Hola {{customer_name}}, tu trabajo de {{service_type}} ha sido completado. Invoice #{{invoice_number}}: ${{total}}.', 'job', TRUE),
('Payment Received', 'Gracias {{customer_name}}! Confirmamos pago de ${{amount}}. Invoice #{{invoice_number}}. Gracias por preferirnos!', 'payment', TRUE);

-- Pipeline Stages
INSERT INTO pipeline_stages (name, "order", color, default_for_service_type) VALUES
('Lead', 1, '#64748b', NULL),
('Quote Sent', 2, '#3b82f6', NULL),
('Quote Approved', 3, '#10b981', NULL),
('Job Scheduled', 4, '#8b5cf6', NULL),
('In Progress', 5, '#f59e0b', NULL),
('Completed', 6, '#22c55e', NULL),
('Invoiced', 7, '#6366f1', NULL),
('Paid', 8, '#10b981', NULL);

-- Note: Create auth users first via Supabase Auth, then run profile inserts
-- For demo, insert profiles directly (requires matching auth.users)
-- In production, users are created via signup trigger

-- Customers (15)
INSERT INTO customers (name, email, phone, whatsapp_number, address, type, source) VALUES
('Juan Perez', 'juan@email.com', '+13055551111', '+13055551111', '456 Oak Ave, Miami, FL', 'residential', 'referral'),
('Maria Garcia', 'maria@email.com', '+13055552222', '+13055552222', '789 Pine St, Miami, FL', 'residential', 'google'),
('Carlos Rodriguez', 'carlos@email.com', '+13055553333', '+13055553333', '321 Elm Dr, Miami, FL', 'residential', 'walk-in'),
('Ana Lopez', 'ana@email.com', '+13055554444', '+13055554444', '654 Maple Rd, Miami, FL', 'residential', 'website'),
('Luis Martinez', 'luis@email.com', '+13055555555', '+13055555555', '987 Cedar Ln, Miami, FL', 'commercial', 'referral'),
('Laura Sanchez', 'laura@email.com', '+13055556666', '+13055556666', '147 Birch St, Miami, FL', 'residential', 'walk-in'),
('Pedro Gomez', 'pedro@email.com', '+13055557777', '+13055557777', '258 Spruce Ave, Miami, FL', 'commercial', 'google'),
('Sofia Diaz', 'sofia@email.com', '+13055558888', '+13055558888', '369 Willow Dr, Miami, FL', 'residential', 'website'),
('Diego Torres', 'diego@email.com', '+13055559999', '+13055559999', '159 Aspen Ln, Miami, FL', 'residential', 'referral'),
('Elena Ruiz', 'elena@email.com', '+13055550000', '+13055550000', '753 Redwood Rd, Miami, FL', 'commercial', 'walk-in'),
('Miguel Castro', 'miguel@email.com', '+13055551234', '+13055551234', '951 Sequoia St, Miami, FL', 'residential', 'google'),
('Carmen Vega', 'carmen@email.com', '+13055552345', '+13055552345', '357 Cypress Ave, Miami, FL', 'residential', 'website'),
('Jose Herrera', 'jose@email.com', '+13055553456', '+13055553456', '852 Palm Dr, Miami, FL', 'commercial', 'referral'),
('Patricia Nuñez', 'patricia@email.com', '+13055554567', '+13055554567', '456 Magnolia Ln, Miami, FL', 'residential', 'walk-in'),
('Fernando Reyes', 'fernando@email.com', '+13055555678', '+13055555678', '789 Gardenia Rd, Miami, FL', 'commercial', 'google');

-- Suppliers
INSERT INTO suppliers (name, contact_name, email, phone, address) VALUES
('Plumbing Supply Co', 'John Smith', 'john@plumbingsupply.com', '+13055556001', '100 Industrial Blvd, Miami, FL'),
('ElectroParts Inc', 'Jane Doe', 'jane@electroparts.com', '+13055556002', '200 Warehouse Dr, Miami, FL'),
('Tool Masters', 'Bob Wilson', 'bob@toolmasters.com', '+13055556003', '300 Commerce St, Miami, FL');

-- Inventory Parts (30)
INSERT INTO inventory_parts (name, sku, category, quantity_stock, quantity_minimum, price_cost, price_sale, supplier_id, barcode) VALUES
('PVC Pipe 1/2"', 'PVC-050', 'plumbing_parts', 50, 10, 2.50, 5.00, NULL, '1234567890123'),
('PVC Pipe 3/4"', 'PVC-075', 'plumbing_parts', 45, 10, 3.50, 7.00, NULL, '1234567890124'),
('Copper Pipe 1/2"', 'COP-050', 'plumbing_parts', 30, 8, 8.00, 16.00, NULL, '1234567890125'),
('Faucet Kitchen', 'FCT-KIT', 'plumbing_parts', 12, 5, 45.00, 89.99, NULL, '1234567890126'),
('Faucet Bathroom', 'FCT-BATH', 'plumbing_parts', 15, 5, 35.00, 69.99, NULL, '1234567890127'),
('Toilet Flapper', 'TFL-001', 'plumbing_parts', 25, 8, 3.00, 7.99, NULL, '1234567890128'),
('Drain Snake 25ft', 'DS-025', 'plumbing_parts', 8, 3, 18.00, 39.99, NULL, '1234567890129'),
('Water Heater Element', 'WHE-001', 'plumbing_parts', 6, 4, 25.00, 49.99, NULL, '1234567890130'),
('Pipe Wrench 14"', 'PW-14', 'tools', 10, 3, 12.00, 24.99, NULL, '1234567890131'),
('Plunger Heavy Duty', 'PLG-HD', 'tools', 20, 8, 8.00, 15.99, NULL, '1234567890132'),
('Electrical Wire 12AWG', 'EW-12', 'electrical_parts', 100, 25, 0.50, 1.20, NULL, '1234567890133'),
('Electrical Wire 14AWG', 'EW-14', 'electrical_parts', 120, 30, 0.40, 1.00, NULL, '1234567890134'),
('Outlet Duplex', 'OUT-DPL', 'electrical_parts', 40, 10, 2.00, 4.99, NULL, '1234567890135'),
('Light Switch', 'SW-001', 'electrical_parts', 35, 10, 1.50, 3.99, NULL, '1234567890136'),
('Breaker 20A', 'BRK-20', 'electrical_parts', 15, 5, 8.00, 18.99, NULL, '1234567890137'),
('Breaker 30A', 'BRK-30', 'electrical_parts', 10, 4, 12.00, 25.99, NULL, '1234567890138'),
('Ceiling Fan', 'CF-001', 'electrical_parts', 8, 3, 55.00, 119.99, NULL, '1234567890139'),
('LED Bulb 60W', 'LED-060', 'electrical_parts', 60, 15, 2.50, 5.99, NULL, '1234567890140'),
('Electrical Tape', 'ET-001', 'electrical_parts', 50, 15, 1.00, 2.99, NULL, '1234567890141'),
('Wire Nuts (pack)', 'WN-001', 'electrical_parts', 30, 10, 2.00, 4.99, NULL, '1234567890142'),
('Screwdriver Set', 'SD-SET', 'tools', 15, 5, 18.00, 34.99, NULL, '1234567890143'),
('Voltage Tester', 'VT-001', 'tools', 8, 3, 12.00, 24.99, NULL, '1234567890144'),
('Fish Tape 50ft', 'FT-050', 'tools', 5, 2, 15.00, 32.99, NULL, '1234567890145'),
('Conduit 1/2"', 'CON-050', 'electrical_parts', 40, 10, 3.00, 6.99, NULL, '1234567890146'),
('Shut-off Valve', 'SOV-001', 'plumbing_parts', 20, 6, 6.00, 12.99, NULL, '1234567890147'),
('P-trap Kit', 'PT-001', 'plumbing_parts', 12, 4, 8.00, 16.99, NULL, '1234567890148'),
('Teflon Tape', 'TT-001', 'plumbing_parts', 40, 15, 0.50, 1.99, NULL, '1234567890149'),
('Pipe Cutter', 'PC-001', 'tools', 6, 2, 14.00, 28.99, NULL, '1234567890150'),
('GFCI Outlet', 'GFCI-001', 'electrical_parts', 18, 6, 10.00, 22.99, NULL, '1234567890151'),
('Dimmer Switch', 'DM-001', 'electrical_parts', 12, 4, 15.00, 34.99, NULL, '1234567890152');
