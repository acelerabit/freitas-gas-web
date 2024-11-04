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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/user-context";
import { fetchApi } from "@/services/fetchApi";
import { Send } from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "../_components/loading-page";
import { ProfileForm } from "./_components/profile-form";
import { UploadProfile } from "./_components/upload-profile";
import { NotificationForm } from "./_components/notification-form";

export default function Profile() {
  const { loadingUser, user } = useUser();

  async function sendRedefinePasswordEmail() {
    const response = await fetchApi(`/recovery-password`, {
      method: "POST",
      body: JSON.stringify({
        email: user?.email,
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

    toast.success("E-mail enviado com sucesso", {
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  if (loadingUser || !user) {
    return <LoadingAnimation />;
  }

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Configurações</h1>
      </div>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account" className="w-full">
            Conta
          </TabsTrigger>
          <TabsTrigger value="password" className="w-full ">
            Senha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Imagem</CardTitle>
                <CardDescription>
                  Obtenha uma imagem para sua foto de perfil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UploadProfile />
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Informações</CardTitle>
                <CardDescription>
                  Usada para identificá-lo no aplicativo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>
                  Mostrar se você está habilitado a receber notificações.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationForm user={user} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Esqueseu sua senha?</CardTitle>
              <CardDescription>
                Clique aqui para receber o código de recuperação de senha por
                e-mail.
              </CardDescription>
            </CardHeader>
            {/* <CardContent className="space-y-2"></CardContent> */}
            <CardFooter>
              <Button onClick={sendRedefinePasswordEmail}>
                Enviar código
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
