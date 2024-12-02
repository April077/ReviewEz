import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ckhlukokqmspitwjkhjp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
