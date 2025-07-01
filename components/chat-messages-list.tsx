"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { saveMessage } from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkcmJxd3pocGtseHF6bHZvcWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNDMxMDgsImV4cCI6MjA2NjkxOTEwOH0.AINU2xWJRWpSbTeO3I8sZzSLzd50MA2rZj2frSfa8RE";
const SUPABASE_URL = "https://wdrbqwzhpklxqzlvoqfe.supabase.co";

interface ChatMessagesListProps {
  chatRoomId: string;
  userId: number;
  username: string;
  avatar: string;
  initialMessages: InitialChatMessages;
}

const ChatMessagesList = ({
  chatRoomId,
  userId,
  username,
  avatar,
  initialMessages,
}: ChatMessagesListProps) => {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setMessage(value);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avatar: "xxx",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col justify-end min-h-screen gap-5 p-5">
      More actions
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.userId === userId ? "justify-end" : ""
          }`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avatar!}
              alt={message.user.username}
              width={50}
              height={50}
              className="rounded-full size-8"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              } p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="relative flex" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="w-full h-10 px-5 transition bg-transparent border-none rounded-full focus:outline-none ring-2 focus:ring-4 ring-neutral-200 focus:ring-neutral-50 placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="text-orange-500 transition-colors size-10 hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
};
export default ChatMessagesList;
