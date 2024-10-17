"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importação do Select
import { useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { fetchApi } from "@/services/fetchApi";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

export function TableDeliverymanTransactions() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [loadingUsers, setSetLoadingUsers] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "" });

  async function getUsers() {
    setSetLoadingUsers(true);
    const fetchUsersUrl = new URL(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`
    );

    fetchUsersUrl.searchParams.set("page", String(page));
    fetchUsersUrl.searchParams.set("itemsPerPage", String(itemsPerPage));

    const response = await fetchApi(
      `${fetchUsersUrl.pathname}${fetchUsersUrl.search}`
    );

    if (!response.ok) {
      setSetLoadingUsers(false);
      return;
    }

    const data = await response.json();

    setUsers(data);
    setSetLoadingUsers(false);
  }

  async function handleCreateUser() {
    const response = await fetchApi("/users", {
      method: "POST",
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        status: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      await getUsers();
      setNewUser({ name: "", email: "", role: "", password: "" });
    }
  }

  function nextPage() {
    setPage((currentPage) => currentPage + 1);
  }

  function previousPage() {
    setPage((currentPage) => currentPage - 1);
  }

  useEffect(() => {
    getUsers();
  }, [page]);

  const rolesBadges = {
    DELIVERYMAN: "bg-violet-500 hover:bg-violet-700",
    ADMIN: "bg-yellow-500 hover:bg-yellow-700",
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Vendas e despesas</CardTitle>
        <Dialog>
          <DialogTrigger>
            <Button>Cadastrar Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Input
                placeholder="Senha"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <Select
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                value={newUser.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DELIVERYMAN">Entregador</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableCaption>Listagem de todos os usuários</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo de usuário</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.id.substring(0, 10)}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {user.name}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    {user.email}
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    <Badge
                      className={`${
                        user.role === "ADMIN"
                          ? rolesBadges.ADMIN
                          : rolesBadges.DELIVERYMAN
                      }`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium truncate">
                    <Checkbox
                      checked={user.status}
                      disabled
                      style={{ marginLeft: "15px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="h-5 w-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href={`/app/users/${user.id}`}>Ver usuário</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            disabled={users.length < itemsPerPage}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
