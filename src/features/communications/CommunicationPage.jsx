import React, { useMemo, useState } from "react";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Inbox,
  MessageSquare,
} from "lucide-react";

import {
  PageBase,
  PageHeader,
  PageContentState,
} from "../../components/page";

export default function CommunicationPage({
  initialThreads = [],
  initialMessages = {},
  onSendMessage,
  isLoading,
  error,
}) {
  const [threads, setThreads] = useState(initialThreads);
  const [messages, setMessages] = useState(initialMessages);

  const [activeThreadId, setActiveThreadId] = useState(
    initialThreads[0]?.id ?? null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId),
    [threads, activeThreadId]
  );

  const activeMessages = useMemo(
    () => messages[activeThreadId] || [],
    [messages, activeThreadId]
  );

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const match =
        thread.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (thread.lastMessage || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      switch (statusFilter) {
        case "unread":
          return match && thread.unread > 0;

        case "archived":
          return match && thread.isArchived;

        default:
          return match && !thread.isArchived;
      }
    });
  }, [threads, searchQuery, statusFilter]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const payload = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(),
      sender: "me",
      text: newMessage.trim(),
      time,
    };

    setMessages((prev) => ({
      ...prev,
      [activeThreadId]: [...(prev[activeThreadId] || []), payload],
    }));

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              lastMessage: payload.text,
              time,
            }
          : thread
      )
    );

    onSendMessage?.(activeThreadId, payload);

    setNewMessage("");
  };

  const selectThread = (id) => {
    setActiveThreadId(id);

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              unread: 0,
            }
          : thread
      )
    );
  };

  const getRoleBadgeStyles = (role) => {
    switch (role?.toLowerCase()) {
      case "client":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "lead":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "prospect":
        return "bg-amber-50 text-amber-700 border-amber-200";

      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <PageBase>

      <PageContentState isLoading={isLoading} error={error}>

        <div className="flex h-[calc(100vh-185px)] min-h-130 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="flex w-[320px] shrink-0 flex-col border-r border-slate-200 bg-white">
            {/* Search Controls Header */}
            <div className="border-b border-slate-100 p-4 shrink-0">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-red-400 focus:bg-white"
                />
              </div>

              <div className="mt-4 grid grid-cols-3 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`rounded-md py-2 text-sm font-medium transition ${
                    statusFilter === "all"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  All
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("unread")}
                  className={`rounded-md py-2 text-sm font-medium transition ${
                    statusFilter === "unread"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  Unread
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter("archived")}
                  className={`rounded-md py-2 text-sm font-medium transition ${
                    statusFilter === "archived"
                      ? "bg-white shadow text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  Archived
                </button>
              </div>
            </div>

            {/* Conversation Feed Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredThreads.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center py-12">
                  <Inbox size={42} className="mb-4 text-slate-300" />
                  <h3 className="text-base font-semibold text-slate-700">
                    No conversations
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Client conversations will appear here.
                  </p>
                </div>
              ) : (
                filteredThreads.map((thread) => {
                  const isActive = activeThreadId === thread.id;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      onClick={() => selectThread(thread.id)}
                      className={`w-full border-b border-slate-100 px-4 py-4 text-left transition-all duration-200 block ${
                        isActive
                          ? "bg-red-50/50 border-l-4 border-l-[#E7000B]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700 border border-slate-200/50">
                            {thread.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          {thread.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                          )}
                        </div>

                        {/* Thread Row Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h3
                              className={`truncate text-sm ${
                                thread.unread
                                  ? "font-semibold text-slate-900"
                                  : "font-medium text-slate-700"
                              }`}
                            >
                              {thread.name}
                            </h3>
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              {thread.time}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getRoleBadgeStyles(
                                thread.role
                              )}`}
                            >
                              {thread.role}
                            </span>
                            {thread.unread > 0 && (
                              <span className="rounded-full bg-[#E7000B] px-2 py-0.5 text-[10px] font-semibold text-white">
                                {thread.unread}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 truncate text-xs text-slate-500">
                            {thread.lastMessage || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ================= RIGHT PANEL ================= */}
          {activeThread ? (
            <section className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                      {activeThread.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {activeThread.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-slate-900 leading-none">
                        {activeThread.name}
                      </h2>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getRoleBadgeStyles(
                          activeThread.role
                        )}`}
                      >
                        {activeThread.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {activeThread.online ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <button type="button" className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-700">
                    <Phone size={18} />
                  </button>
                  <button type="button" className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-700">
                    <Video size={18} />
                  </button>
                  <button type="button" className="rounded-lg p-2 transition hover:bg-slate-100 hover:text-slate-700">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Content Stream */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                  {activeMessages.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center py-24">
                      <MessageSquare size={48} className="mb-4 text-slate-300" />
                      <h3 className="text-lg font-semibold text-slate-700">
                        No messages yet
                      </h3>
                      <p className="mt-2 text-sm text-slate-400">
                        Start the conversation by sending a message.
                      </p>
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMine = msg.sender === "me";
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                              isMine
                                ? "rounded-br-none bg-[#E7000B] text-white"
                                : "rounded-bl-none border border-slate-200 bg-white text-slate-800"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {msg.text}
                            </p>
                            <p
                              className={`mt-2 text-[10px] ${
                                isMine ? "text-red-100 text-right" : "text-slate-400 text-left"
                              }`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Message Input Composer Block */}
              <div className="border-t border-slate-200 bg-white p-4 flex-shrink-0">
                <form
                  onSubmit={handleSendMessage}
                  className="mx-auto flex max-w-4xl items-end gap-2"
                >
                  <button
                    type="button"
                    className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 flex-shrink-0"
                  >
                    <Paperclip size={18} />
                  </button>
                  
                  <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 focus-within:border-slate-300 focus-within:bg-white transition">
                    <textarea
                      rows={2}
                      value={newMessage}
                      placeholder={`Message ${activeThread.name}...`}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      className="w-full resize-none rounded-t-xl bg-transparent px-4 py-3 text-sm outline-none"
                    />
                    <div className="flex justify-between border-t border-slate-100 px-3 py-2 bg-white rounded-b-xl">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        <Smile size={18} />
                      </button>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="flex items-center gap-2 rounded-lg bg-[#E7000B] px-5 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Send size={14} />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          ) : (
            /* Fallback Slate Container */
            <section className="flex flex-1 flex-col items-center justify-center bg-slate-50/50">
              <div className="rounded-xl bg-white p-4 border border-slate-100 shadow-sm text-slate-400">
                <MessageSquare size={36} />
              </div>
              <h2 className="mt-5 text-base font-semibold text-slate-800">
                Select a conversation
              </h2>
              <p className="mt-1.5 max-w-xs text-center text-xs text-slate-400 leading-normal">
                Choose a conversation from the left sidebar to view messages and continue chatting.
              </p>
            </section>
          )}
        </div>
      </PageContentState>
    </PageBase>
  );
}