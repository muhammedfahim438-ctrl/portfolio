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

  useEffect(() => {
    const unsub = subscribeToMessages((data) => {
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
      <div className="flex items-center justify-center py-24 text-themeText/50">
        Loading messages…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-none flex flex-col items-center justify-center py-24 text-themeText/40 border border-themeBorder bg-themeSurface/20">
        <p className="text-lg font-medium text-themeText-secondary">No messages yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-none grid h-[600px] grid-cols-[320px_1fr] overflow-hidden border border-themeBorder bg-themeSurface/20">
      <div className="divide-y divide-themeBorder/50 overflow-y-auto">
        {messages.map((msg) => {
          const isActive = selected?.id === msg.id;
          return (
            <button
              key={msg.id}
              onClick={() => setSelected(msg)}
              className={`w-full px-5 py-4 text-left transition-all duration-200 ${
                isActive ? "bg-themeAccent/10 border-l-2 border-themeAccent" : "hover:bg-themeBg/40 border-l-2 border-transparent"
              }`}
            >
              <p className="font-medium text-themeText text-sm">{msg.sender_name}</p>
              <p className="text-xs text-themeText-secondary/50 truncate">{msg.sender_email}</p>
              <p className="mt-1 text-xs text-themeText-secondary/30">{formatDate(msg.created_at)}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="flex items-center justify-between border-b border-themeBorder px-6 py-4">
              <div>
                <h3 className="text-lg font-display font-bold text-themeText">
                  {selected.sender_name}
                </h3>
                <a
                  href={`mailto:${selected.sender_email}`}
                  className="text-sm text-themeAccent hover:underline font-mono"
                >
                  {selected.sender_email}
                </a>
              </div>
              <button
                onClick={() => handleDelete(selected.id)}
                className="text-xs text-red-400 hover:text-red-300 font-mono"
              >
                Delete
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <p className="text-xs text-themeText-secondary/50">{formatDate(selected.created_at)}</p>
              <p className="whitespace-pre-wrap text-themeText leading-relaxed">
                {selected.message_body}
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-themeText-secondary/30">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  );
}
