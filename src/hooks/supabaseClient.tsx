import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iyqleanlhzcnndzuugkg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cWxlYW5saHpjbm5kenV1Z2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDQ1NzgsImV4cCI6MjA2Njg4MDU3OH0.WFDSucDvM5kPDjawAJ-PFky1u5wCJ2ifaoGAuqb-M1I";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL ou Anon Key não foram encontradas. Verifique seu arquivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
