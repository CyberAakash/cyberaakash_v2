"use client";

import { useOptimistic, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface AdminItem {
    id: string;
    is_archived?: boolean;
    [key: string]: any;
}

export function useAdminActions<T extends AdminItem>(
    initialData: T[],
    tableName: string,
    onUpdate?: () => void
) {
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();

    const [optimisticItems, addOptimisticItem] = useOptimistic(
        initialData,
        (state, action: { type: string; payload: any }) => {
            switch (action.type) {
                case "UPDATE":
                    return state.map((item) =>
                        item.id === action.payload.id ? { ...item, ...action.payload } : item
                    );
                case "ARCHIVE":
                    return state.map((item) =>
                        item.id === action.payload.id ? { ...item, is_archived: true } : item
                    );
                case "RESTORE":
                    return state.map((item) =>
                        item.id === action.payload.id ? { ...item, is_archived: false } : item
                    );
                case "DELETE":
                    return state.filter((item) => item.id !== action.payload.id);
                case "BULK_ARCHIVE":
                    return state.map((item) =>
                        action.payload.ids.includes(item.id)
                            ? { ...item, is_archived: true }
                            : item
                    );
                case "BULK_RESTORE":
                    return state.map((item) =>
                        action.payload.ids.includes(item.id)
                            ? { ...item, is_archived: false }
                            : item
                    );
                case "BULK_DELETE":
                    return state.filter((item) => !action.payload.ids.includes(item.id));
                default:
                    return state;
            }
        }
    );

    const archiveItem = async (id: string) => {
        startTransition(async () => {
            addOptimisticItem({ type: "ARCHIVE", payload: { id } });
            const { error } = await supabase
                .from(tableName)
                .update({ is_archived: true })
                .eq("id", id);
            if (error) {
                toast.error("Failed to archive item");
                // In a real app, you'd trigger a revalidation here to sync state
            } else {
                toast.success("Item archived");
                onUpdate?.();
            }
        });
    };

    const restoreItem = async (id: string) => {
        startTransition(async () => {
            addOptimisticItem({ type: "RESTORE", payload: { id } });
            const { error } = await supabase
                .from(tableName)
                .update({ is_archived: false })
                .eq("id", id);
            if (error) {
                toast.error("Failed to restore item");
            } else {
                toast.success("Item restored");
                onUpdate?.();
            }
        });
    };

    const deleteItem = async (id: string) => {
        startTransition(async () => {
            addOptimisticItem({ type: "DELETE", payload: { id } });
            const { error } = await supabase.from(tableName).delete().eq("id", id);
            if (error) {
                toast.error("Failed to delete item");
            } else {
                toast.success("Item deleted permanently");
                onUpdate?.();
            }
        });
    };

    const bulkArchive = async (ids: string[]) => {
        startTransition(async () => {
            addOptimisticItem({ type: "BULK_ARCHIVE", payload: { ids } });
            const { error } = await supabase
                .from(tableName)
                .update({ is_archived: true })
                .in("id", ids);
            if (error) {
                toast.error("Failed to archive items");
            } else {
                toast.success(`${ids.length} items archived`);
                onUpdate?.();
            }
        });
    };

    const bulkRestore = async (ids: string[]) => {
        startTransition(async () => {
            addOptimisticItem({ type: "BULK_RESTORE", payload: { ids } });
            const { error } = await supabase
                .from(tableName)
                .update({ is_archived: false })
                .in("id", ids);
            if (error) {
                toast.error("Failed to restore items");
            } else {
                toast.success(`${ids.length} items restored`);
                onUpdate?.();
            }
        });
    };

    const bulkDelete = async (ids: string[]) => {
        startTransition(async () => {
            addOptimisticItem({ type: "BULK_DELETE", payload: { ids } });
            const { error } = await supabase.from(tableName).delete().in("id", ids);
            if (error) {
                toast.error("Failed to delete items");
            } else {
                toast.success(`${ids.length} items deleted permanently`);
                onUpdate?.();
            }
        });
    };

    return {
        optimisticItems,
        isPending,
        archiveItem,
        restoreItem,
        deleteItem,
        bulkArchive,
        bulkRestore,
        bulkDelete,
    };
}
