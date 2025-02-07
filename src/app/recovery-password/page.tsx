"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/services/fetchApi";
import { useState } from "react";
import { toast } from "sonner";

export default function RecoveryPassword() {
  const [email, setEmail]= useState("")


  const onSubmit = async () => {
    const response = await fetchApi(`/recovery-password`, {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    });

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

    toast.success("Código enviado como sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  };


  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Recuperação de senha</CardTitle>
          <CardDescription>
            Entre com seu email para receber o código.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={event => setEmail(event.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={onSubmit} className="w-full">Receber código</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
