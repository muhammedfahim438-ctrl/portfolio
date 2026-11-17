"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { subscribeToMessages, deleteMessage } from "@/lib/firestore";

function formatDate(date) {
  if (!date) return "Unknown date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TabMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const unsub = subscribeToMessages(
      (data) => {
        if (cancelled) return;
        setMessages(
          data.sort((a, b) => {
            const ta = a.created_at?.getTime?.() ?? 0;
            const tb = b.created_at?.getTime?.() ?? 0;
            return tb - ta;
          })
        );
        setError(false);
        setLoading(false);
      },
      () => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  async function handleDelete(id) {
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
      <div className="flex items-center justify-center py-24 text-themeText/80">
        Loading messages…
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-none flex flex-col items-center justify-center py-24 border border-themeWarn/60 bg-themeWarn/10">
        <p className="text-lg font-medium text-themeText">Messages could not be loaded</p>
        <p className="mt-2 text-sm text-themeTextSecondary/80">Check your connection and reload the admin page.</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-none flex flex-col items-center justify-center py-24 text-themeText/80 border border-themeBorder bg-themeSurface/20">
        <p className="text-lg font-medium text-themeText-secondary">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-none grid min-h-[28rem] grid-cols-1 overflow-hidden border border-themeBorder bg-themeSurface/20 min-[481px]:h-[37.5rem] min-[481px]:grid-cols-[20rem_1fr]">
      <div className={`divide-y divide-themeBorder/50 overflow-y-auto ${selected ? "hidden min-[481px]:block" : "block"}`}>
        {messages.map((msg) => {
          const isActive = selected?.id === msg.id;
          return (
            <button
              key={msg.id}
              type="button"
              onClick={() => setSelected(msg)}
              className={`w-full min-h-11 px-5 py-4 text-left transition-all duration-200 ${
                isActive ? "bg-themeAccent/10 border-l-2 border-themeAccent" : "hover:bg-themeBg/40 border-l-2 border-transparent"
              }`}
            >
              <p className="font-medium text-themeText text-sm">{msg.sender_name}</p>
              <p className="text-xs text-themeText-secondary/80 truncate">{msg.sender_email}</p>
              <p className="mt-1 text-xs text-themeText-secondary/80">{formatDate(msg.created_at)}</p>
            </button>
          );
        })}
      </div>

      <div className={`flex-col overflow-hidden ${selected ? "flex" : "hidden min-[481px]:flex"}`}>
        {selected ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-themeBorder px-6 py-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Back to messages"
                className="min-h-11 min-w-11 border border-themeBorder px-2 text-themeTextSecondary min-[481px]:hidden"
              >
                &larr;
              </button>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-display font-bold text-themeText">
                  {selected.sender_name}
                </h3>
                <a
                  href={`mailto:${selected.sender_email}`}
                  className="text-sm text-themeAccentText hover:underline font-mono"
                >
                  {selected.sender_email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(selected.id)}
                className="min-h-11 text-xs text-themeAccentText hover:text-themeText font-mono"
              >
                Delete
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <p className="text-xs text-themeText-secondary/80">{formatDate(selected.created_at)}</p>
              <p className="whitespace-pre-wrap text-themeText leading-relaxed">
                {selected.message_body}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-themeText-secondary/80">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
