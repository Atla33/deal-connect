import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';


@Injectable()
export class SupabaseService {
  private supabaseUrl = 'https://wpeocejczalxaxthbzaa.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZW9jZWpjemFseGF4dGhiemFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzM4MjY3NSwiZXhwIjoyMDI4OTU4Njc1fQ.35ObpnSKYaVJK0pV1A7D7pLyWDC6xXO2ag8rkzHIJ7s';
  private supabase = createClient(this.supabaseUrl, this.supabaseKey);

  getSupabase() {
    return this.supabase;
  }
}
