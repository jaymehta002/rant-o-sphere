// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://idrvvpcasxbrqhhehdtj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcnZ2cGNhc3hicnFoaGVoZHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY4NjYyNjksImV4cCI6MjA1MjQ0MjI2OX0.dW6Qdgnc0UTZxGlt1xTtuDU5T2luIK4AjnSqG8byGBI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);