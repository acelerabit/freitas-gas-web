"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
}

interface FiltersProps {
  startDate: string;
  endDate: string;
  deliverymanId: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDeliverymanId: (id: string) => void;
  getSalesIndicators: () => void;
  loadingUsers: boolean;
  users: User[];
}

const Filters = ({
  startDate,
  endDate,
  deliverymanId,
  setStartDate,
  setEndDate,
  setDeliverymanId,
  getSalesIndicators,
  loadingUsers,
  users,
}: FiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex gap-4">
            <label htmlFor="startDate">
              Data de Início:
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  getSalesIndicators();
                }}
                onKeyDown={(e) => e.preventDefault()}
                className="ml-2 p-2 border border-gray-300 rounded cursor-pointer"
              />
            </label>
            <label htmlFor="endDate">
              Data de Fim:
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  getSalesIndicators();
                }}
                onKeyDown={(e) => e.preventDefault()}
                className="ml-2 p-2 border border-gray-300 rounded cursor-pointer"
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label htmlFor="deliveryman">
              Entregador:
              <select
                id="deliveryman"
                value={deliverymanId}
                onChange={(e) => {
                  setDeliverymanId(e.target.value);
                  getSalesIndicators();
                }}
                className="ml-2 p-2 border border-gray-300 rounded"
              >
                <option value="">Todos</option>
                {loadingUsers ? (
                  <option value="">Carregando...</option>
                ) : (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <button
              onClick={getSalesIndicators}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Filtrar
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Filters;
