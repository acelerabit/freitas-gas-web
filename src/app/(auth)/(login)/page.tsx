"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner'

const formSchema = z.object({
  password: z.string().min(1, { message: "Senha é obrigatória" }),
  email: z.string().email("Insira um email válido").min(1, { message: "Email é obrigatório" }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("E-mail ou senha inválidas!",{
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    }

    

    toast.success("Login realizado com sucesso",{
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });

    // window.location.href =
    //   process.env.NEXT_PUBLIC_BASE_URL_AFTER_LOGIN ?? "/app";
  }

  function loginWithGoogle() {
    signIn("google", {
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/app`,
    });
  }

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-center h-full">
        <Card className="mx-auto grid gap-6 p-8">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Bem vindo(a) ao Freitas Gás</h1>
            <p className="text-balance text-muted-foreground">
              Digite seu e-mail e senha abaixo para fazer login em sua conta
            </p>
          </div>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                      <Link
                        href="/recovery-password"
                        className="ml-auto inline-block text-sm underline"
                      >
                        Esqueci minha senha
                      </Link>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 mt-4">
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                  {/* <Button
                    type="button"
                    onClick={loginWithGoogle}
                    variant="outline"
                    className="w-full"
                  >
                    Login with Google
                  </Button> */}
                </div>
              </form>
            </Form>
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div> */}
        </Card>
      </div>
    </div>
  );
}
