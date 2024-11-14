import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { BaggageClaim, BarChart, Barcode, BookText, Cylinder, FileCheck, FileClock, HandCoins, Handshake, Landmark, LandmarkIcon, Megaphone, SquareGanttChart, SquareUserRound, Users, Wallet } from 'lucide-react';
import { ReactNode } from 'react';

interface Route {
  title: string;
  icon: ReactNode;
  href: string;
  action?: () => void;
  children?: {
    title: string;
    action: () => void;
  }[];
}

interface User {
  id: string;
  role: 'ADMIN' | 'DELIVERYMAN',
}


export const routes = (user: User) => {
  let routesThatUserCanAccess: Route[] = [];

  switch (user.role) {
    case 'ADMIN':
      routesThatUserCanAccess = [
        {
          title: 'Perfil',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Dashboard',
          icon: <BarChart className="h-4 w-4" />,
          href: "/app/dashboard"
        },
        {
          title: 'Usuários',
          icon: <Users className="h-4 w-4" />,
          href: "/app/users"
        },
        {
          title: 'Clientes',
          icon: <Handshake className="h-4 w-4" />,
          href: "/app/customers"
        },
        {
          title: 'Financeiro',
          icon: <Wallet className="h-4 w-4" />,
          href: "/app/finance"
        },
        {
          title: 'Vendas',
          icon: <HandCoins className="h-4 w-4" />,
          href: "/app/sales"
        },
        {
          title: 'Despesas',
          icon: <Barcode className="h-4 w-4" />,
          href: "/app/expense"
        },
        {
          title: 'Estoque',
          icon: <SquareGanttChart className="h-4 w-4" />,
          href: "/app/products"
        },
        {
          title: 'Fornecedores',
          icon: <BaggageClaim className="h-4 w-4" />,
          href: "/app/supplier"
        },
        {
          title: 'Coletar vasilhame',
          icon: <Cylinder className="h-4 w-4" />,
          href: "/app/collect"
        },
        {
          title: 'Notificações',
          icon: <Megaphone className="h-4 w-4" />,
          href: "/app/notifications"
        },
        {
          title: 'Contas',
          icon: <LandmarkIcon className="h-4 w-4" />,
          href: "/app/bank-accounts"
        },
      ];
      break;
    case 'DELIVERYMAN':
      routesThatUserCanAccess = [
        {
          title: 'Perfil',
          icon: <SquareUserRound className="h-4 w-4" />,
          href: "/app/profile"
        },
        {
          title: 'Meu painel',
          icon: <HandCoins className="h-4 w-4" />,
          href: "/app/my-sales"
        },
        {
          title: 'Estoque',
          icon: <SquareGanttChart className="h-4 w-4" />,
          href: "/app/products"
        },
        {
          title: 'Coletar vasilhame',
          icon: <Cylinder className="h-4 w-4" />,
          href: "/app/collect"
        },
        {
          title: 'Imprimir contrato de comodato',
          icon: <DocumentTextIcon className="h-4 w-4" />,
          href: "/app/contract",
          action: () => {
            const url = "/app/";
            const printWindow = window.open(url, "_blank");
            if (printWindow) {
              printWindow.addEventListener('load', () => {
                printWindow.print();
              });
            }
          }
        },
      ];
      break;
  }

  return routesThatUserCanAccess;
}