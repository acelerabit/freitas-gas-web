"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { formatDate } from "@/utils/formatDate";
import * as Popover from "@radix-ui/react-popover";
import "dotenv/config";
import { BellIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "sonner";

interface Message {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function Notifications() {
  const { loadingUser, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);

  async function getNotifications() {
    const response = await fetchApi(`/notifications/${user?.id}`);


    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const data = await response.json();

    setMessages(data.notifications);
  }

  async function markAsRead(id: string) {
    const response = await fetchApi(`/notifications/read/${id}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    const messagesUpdated = messages.filter((message) => message.id !== id);
    setMessages(messagesUpdated);
  }

  async function markAllAsRead() {
    const response = await fetchApi(`/notifications/readAll/${user?.id}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error,{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    setMessages([]);
  }

  const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", {
    autoConnect: false,
  });

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    (socket.auth = {
      userId: user?.id,
    }),
      socket.connect();
    socket.on("notify", (message: Message) => {
      setMessages((state) => [...state, message]);
    });
  }, [user]);

  // useEffect(() => {
  //   if (!user?.id) {
  //     return;
  //   }

  //   getNotifications();
  // }, [user]);

  if (loadingUser) {
    return;
  }

  return (
    // <Popover.Root>
    //   <Popover.Trigger asChild>
        <Link
        href="/app/notifications"
          className="relative ml-auto hover:bg-slate-100 h-8 w-8 border rounded-md flex items-center justify-center"
          // size="icon"
          // variant="outline"
        >
          <BellIcon className="h-4 w-4" />
          {messages.length > 0 && (
            <div className="absolute h-2.5 w-2.5 rounded-full bg-red-600 top-[-0.25rem] right-[-0.25rem]" />
          )}
          <span className="sr-only">Toggle notifications</span>
        </Link>
    //   </Popover.Trigger>
    //   <Popover.Portal>
    //     <Popover.Content
    //       className="rounded mr-[1rem] w-[400px] bg-white border border-zinc-200 shadow-sm  data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
    //       sideOffset={5}
    //     >
    //       <div className="w-full flex flex-col gap-2">
    //         {messages.length > 0 ? (
    //           <div className="max-h-[320px] overflow-auto">
    //             <div className="border-b border-zinc-100 p-2">
    //               <div className="flex items-start justify-between">
    //                 <div>
    //                   <p>Notificações</p>
    //                   <span className="text-sm">
    //                     Você tem {messages.length} não lidas
    //                   </span>
    //                 </div>
    //                 <button
    //                   className="hover:bg-zinc-200 p-1 rounded-md text-xs"
    //                   onClick={markAllAsRead}
    //                 >
    //                   Marcar todas como lida
    //                 </button>
    //               </div>
    //             </div>
    //             {messages.map((message) => (
    //               <div
    //                 key={message.id}
    //                 className="w-full p-2 bg-white border-b border-zinc-100"
    //               >
    //                 <div className="w-full flex items-center justify-between gap-2">
    //                   <p className="text-xs text-zinc-600 truncate">
    //                     {message.message}
    //                   </p>

    //                   <Button
    //                     className="text-xs px-2 py-0.5 m-0"
    //                     onClick={() => markAsRead(message.id)}
    //                     title="marcar como lido"
    //                   >
    //                     Lido
    //                   </Button>
    //                 </div>
    //                 <p className="text-xs">{formatDate(message.createdAt)}</p>
    //               </div>
    //             ))}
    //           </div>
    //         ) : (
    //           <p className="text-xs text-zinc-600 p-2">Nenhuma nova mensagem</p>
    //         )}
    //       </div>

    //       <Popover.Arrow className="fill-white" />
    //     </Popover.Content>
    //   </Popover.Portal>
    // </Popover.Root>
  );
}
