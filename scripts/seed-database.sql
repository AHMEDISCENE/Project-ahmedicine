-- Create the main cases table
CREATE TABLE IF NOT EXISTS oncology_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_name VARCHAR(255) NOT NULL,
    clinic_name VARCHAR(255) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(255),
    age INTEGER,
    sex VARCHAR(50),
    tumour_type VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    diagnostic_method VARCHAR(255),
    diagnosis_date DATE NOT NULL,
    treatment_protocol TEXT,
    follow_up_date DATE,
    outcome VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    digital_signature TEXT
);

-- Create audit trail table
CREATE TABLE IF NOT EXISTS case_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES oncology_cases(id),
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    field_changed VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create form fields configuration table
CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    field_name VARCHAR(255) NOT NULL,
    field_label VARCHAR(255) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    field_options JSONB,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS case_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES oncology_cases(id),
    reminder_type VARCHAR(100) NOT NULL,
    reminder_date DATE NOT NULL,
    reminder_message TEXT,
    is_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clinics table for reference
CREATE TABLE IF NOT EXISTS clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    license_number VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample clinics
INSERT INTO clinics (name, address, phone, email) VALUES
('University Teaching Hospital', '123 University Ave, Lagos', '+234-801-234-5678', 'contact@uth.edu.ng'),
('City Veterinary Clinic', '456 City Center, Abuja', '+234-802-345-6789', 'info@cityvet.ng'),
('Animal Care Center', '789 Care Street, Ibadan', '+234-803-456-7890', 'care@animalcenter.ng'),
('Pet Wellness Clinic', '321 Wellness Blvd, Port Harcourt', '+234-804-567-8901', 'hello@petwellness.ng');

-- Insert default form fields
INSERT INTO form_fields (field_name, field_label, field_type, is_required, display_order) VALUES
('owner_name', 'Owner Name', 'text', true, 1),
('clinic_name', 'Clinic/Hospital', 'select', true, 2),
('patient_name', 'Patient Name', 'text', true, 3),
('species', 'Species', 'select', true, 4),
('breed', 'Breed', 'text', true, 5),
('age', 'Age', 'number', true, 6),
('sex', 'Sex', 'select', true, 7),
('tumour_type', 'Tumour Type', 'text', true, 8),
('location', 'Location', 'text', true, 9),
('diagnostic_method', 'Diagnostic Method', 'text', true, 10),
('diagnosis_date', 'Date of Diagnosis', 'date', true, 11),
('treatment_protocol', 'Treatment Protocol', 'textarea', false, 12),
('follow_up_date', 'Follow-up Date', 'date', false, 13),
('outcome', 'Outcome', 'select', false, 14),
('notes', 'Additional Notes', 'textarea', false, 15);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cases_clinic_name ON oncology_cases(clinic_name);
CREATE INDEX IF NOT EXISTS idx_cases_species ON oncology_cases(species);
CREATE INDEX IF NOT EXISTS idx_cases_diagnosis_date ON oncology_cases(diagnosis_date);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON oncology_cases(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_case_id ON case_audit_log(case_id);
CREATE INDEX IF NOT EXISTS idx_audit_changed_at ON case_audit_log(changed_at);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_cases_updated_at 
    BEFORE UPDATE ON oncology_cases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_case_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO case_audit_log (case_id, action, new_value, changed_by)
        VALUES (NEW.id, 'INSERT', row_to_json(NEW)::text, NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO case_audit_log (case_id, action, old_value, new_value, changed_by)
        VALUES (NEW.id, 'UPDATE', row_to_json(OLD)::text, row_to_json(NEW)::text, NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO case_audit_log (case_id, action, old_value, changed_by)
        VALUES (OLD.id, 'DELETE', row_to_json(OLD)::text, 'system');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit trigger
CREATE TRIGGER audit_oncology_cases
    AFTER INSERT OR UPDATE OR DELETE ON oncology_cases
    FOR EACH ROW EXECUTE FUNCTION audit_case_changes();

COMMIT;
