import { createClient } from "@/lib/supabase/server";
import EventsListClient from "./EventsListClient";
import type { Metadata } from "next";
import ConnectAndFooter from "@/components/ConnectAndFooter";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events | CyberAakash",
  description: "Hackathons, talks, workshops, and community milestones I've been part of.",
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_visible", true)
    .eq("is_archived", false)
    .order("event_date", { ascending: false })
    .limit(12);

  return (
    <>
      <EventsListClient initialEvents={events || []} />
      <ConnectAndFooter />
    </>
  );
}
