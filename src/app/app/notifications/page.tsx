"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { toast } from "sonner";
import { TableNotificationsReaded } from "./_components/table-notifications-readed";
import { TableNotificationsUnread } from "./_components/table-notifications-unread";
import { OnlyRolesCanAccess } from "../_components/only-who-can-access";
import { useNotification } from "@/contexts/notification-context";

interface Message {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function Notifications() {
  const { loadingUser, user } = useUser();
  const {clearMessages} = useNotification()

  async function markAsRead(id: string) {
    const response = await fetchApi(`/notifications/read/${id}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }
  }

  async function markAllAsRead() {
    const response = await fetchApi(`/notifications/readAll/${user?.id}`);

    if (!response.ok) {
      const respError = await response.json();
      toast.error(respError.error, {
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    clearMessages()

    window.location.reload();
  }

  if (loadingUser) {
    return;
  }

  return (
    <OnlyRolesCanAccess rolesCanAccess={["ADMIN"]}>
      <main className="p-8 flex flex-col">
        <h1 className="text-4xl font-semibold">Notificações</h1>

        <Breadcrumb className="my-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/app">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>notificações</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-2">
          <Card>
            <CardContent className="flex items-center justify-end pt-4">
              <Button onClick={markAllAsRead}>Marcar todas como lida</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações não lidas</CardTitle>
            </CardHeader>
            <CardContent>
              <TableNotificationsUnread />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificações lidas</CardTitle>
            </CardHeader>
            <CardContent>
              <TableNotificationsReaded />
            </CardContent>
          </Card>
        </div>
      </main>
    </OnlyRolesCanAccess>
  );
}
