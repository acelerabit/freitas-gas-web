"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { formatDateWithHours } from "@/utils/formatDate";
import { useEffect, useState } from "react";
import LoadingAnimation from "../../_components/loading-page";


interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

export function TableNotificationsReaded() {
  const [notifications, setNotifcations] = useState<Notification[]>(
    []
  );

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { user, loadingUser } = useUser();

  async function fetchNotificationsReaded() {
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/${user?.id}/readed`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    setNotifcations(data.notifications);
  }

  

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    fetchNotificationsReaded()
  }, [page]);

  if (loadingUser) {
    return <LoadingAnimation />;
  }

  return (
    <Card className="col-span-2">
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>Listagem de todas as notificações</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Mensagem</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium max-w-[420px]">
                    {notification.message}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {formatDateWithHours(notification.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="w-full flex gap-2 items-center justify-end">
          <Button
            className="disabled:cursor-not-allowed"
            disabled={page === 1}
            onClick={previousPage}
          >
            Previous
          </Button>
          <Button
            className="disabled:cursor-not-allowed"
            disabled={notifications.length < itemsPerPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
