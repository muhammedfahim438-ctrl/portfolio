"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { subscribeToMessages, deleteMessage } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import type { Message } from "@/types";

function formatDate(date: Date | undefined): string {
  if (!date) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function TabMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToMessages((data: Message[]) => {
      setMessages(
        data.sort((a, b) => {
          const ta = a.created_at?.getTime?.() ?? 0;
          const tb = b.created_at?.getTime?.() ?? 0;
          return tb - ta;
        })
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-themeText/50">
        Loading messages…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="glass flex flex-col items-center justify-center py-24 text-themeText/40">
        <svg xmlns="http://www.w3.org/2000/svg" className="mb-4 h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <p className="text-lg font-medium">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="glass grid h-[600px] grid-cols-[320px_1fr] overflow-hidden">
      <div className="divide-y divide-themeBorder/50 overflow-y-auto">
        {messages.map((msg) => {
          const isActive = selected?.id === msg.id;
          return (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full px-4 py-3 text-left transition-colors ${
                isActive ? "bg-themeAccent/10 border-l-2 border-themeAccent" : "hover:bg-themeBg/50 border-l-2 border-transparent"
              }`}
            >
              <p className="font-medium text-themeText text-sm">
                {msg.sender_name}
              </p>
              <p className="text-xs text-themeText/40 truncate">
                {msg.sender_email}
              </p>
              <p className="mt-1 text-xs text-themeText/30">
                {formatDate(msg.created_at)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-themeBorder px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-themeText">
                  {selected.sender_name}
                </h3>
                <a
                  href={`mailto:${selected.sender_email}`}
                  className="text-sm text-themeAccent hover:underline"
                >
                  {selected.sender_email}
                </a>
              </div>
              <Button
                variant="ghost"
                onClick={() => handleDelete(selected.id!)}
                className="text-red-400 hover:text-red-300"
              >
                Delete
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <p className="text-xs text-themeText/40">
                {formatDate(selected.created_at)}
              </p>
              <p className="whitespace-pre-wrap text-themeText leading-relaxed">
                {selected.message_body}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-themeText/30">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
