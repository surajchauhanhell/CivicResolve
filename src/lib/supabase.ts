
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zidjwwgprrlluaujudkd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZGp3d2dwcnJsbHVhdWp1ZGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDg4MDksImV4cCI6MjA4NjgyNDgwOX0.UgkmFuKKMD-jSrKgYhyg2Jo-kWUahCmw1KHU90KWY-c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
