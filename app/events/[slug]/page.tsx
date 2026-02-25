import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EventDetailClient from "./EventDetailClient";
import { Metadata } from "next";
import ConnectAndFooter from "@/components/ConnectAndFooter";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!event) return { title: "Event Not Found" };

  return {
    title: `${event.title} | CyberAakash`,
    description: event.description,
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!event) {
    // Try by ID fallback
    const { data: eventById } = await supabase
      .from("events")
      .select("*")
      .eq("id", slug)
      .eq("is_visible", true)
      .single();
    
    if (!eventById) notFound();
    return (
      <>
        <EventDetailClient event={eventById} />
        <ConnectAndFooter />
      </>
    );
  }

  return (
    <>
      <EventDetailClient event={event} />
      <ConnectAndFooter />
    </>
  );
}
