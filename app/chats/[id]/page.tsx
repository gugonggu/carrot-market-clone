import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

type ChatRoomProps = {
  params: Promise<{ id: string }>;
};

const getRoom = async (id: string) => {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    if (!canSee) {
      return null;
    }
  }

  return room;
};

const getMessages = async (chatRoomId: string) => {
  const messages = await db.message.findMany({
    where: {
      chatRoomId,
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });

  return messages;
};

const getUserProfile = async () => {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id!,
    },
    select: {
      username: true,
      avatar: true,
    },
  });

  return user;
};

export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

const ChatRoom = async ({ params }: ChatRoomProps) => {
  const { id } = await params;

  const room = await getRoom(id);
  if (!room) {
    return notFound();
  }

  const initialMessages = await getMessages(id);
  const session = await getSession();
  const user = await getUserProfile();
  if (!user) {
    return notFound();
  }

  return (
    <ChatMessagesList
      chatRoomId={id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar}
      initialMessages={initialMessages}
    />
  );
};
export default ChatRoom;
