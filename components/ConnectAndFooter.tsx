import { createClient } from "@/lib/supabase/server";
import Footer from "@/components/Footer";

export default async function ConnectAndFooter() {
  const supabase = await createClient();
  const { data: about } = await supabase.from("about").select("*").single();

  return <Footer about={about} />;
}
