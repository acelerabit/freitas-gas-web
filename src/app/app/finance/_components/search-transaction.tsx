"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  filter: string;
};

interface SearchTransactionsProps {
  handleFilterTransactions: (filter: string) => void;
}

export function SearchTransactions({ handleFilterTransactions }: SearchTransactionsProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    handleFilterTransactions(data.filter);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="w-[480px] flex items-center gap-2 ">
        <Input
          type="search"
          placeholder="Buscar transação..."
          className="w-full"
          {...register("filter")}
        />

        <Button type="submit">Pesquisar</Button>
      </div>
    </form>
  );
}
