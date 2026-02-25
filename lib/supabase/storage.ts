import { createClient } from "./client";

export const deleteImageFromStorage = async (bucket: string, url: string) => {
    if (!url || !url.includes("supabase.co")) return;

    try {
        const fileNameMatch = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
        if (fileNameMatch && fileNameMatch[1]) {
            const fileName = decodeURIComponent(fileNameMatch[1]);
            const supabase = createClient();
            const { error } = await supabase.storage.from(bucket).remove([fileName]);
            if (error) {
                console.error("Storage deletion error:", error);
            }
        }
    } catch (e) {
        console.error("Error parsing/deleting from storage:", e);
    }
};
