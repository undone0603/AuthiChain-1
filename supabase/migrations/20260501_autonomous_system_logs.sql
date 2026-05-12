-- AgentZ Autonomous Logging Schema
CREATE TABLE autonomous_system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vertical VARCHAR(50) NOT NULL, -- e.g., 'CANNABIS_PROVENANCE', 'DOD_PROCUREMENT'
    payload_hash VARCHAR(255) NOT NULL,
    consensus_score DECIMAL(5,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Secure the table with Row Level Security (RLS)
ALTER TABLE autonomous_system_logs ENABLE ROW LEVEL SECURITY;
