import {
  AppleLogo,
  Icon,
  User,
  ChartLineUp,
  House,
} from '@phosphor-icons/react';

export interface NavItem {
  id: string;
  label: string;
  Icon: Icon;
  to: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'Início', Icon: House, to: "/" },
  { id: 'diet', label: 'Dieta', Icon: AppleLogo, to: "/foods" },
  { id: 'metrics', label: 'Métricas', Icon: ChartLineUp, to: "/metrics" },
  { id: 'profile', label: 'Perfil', Icon: User, to:"/profile" },
] as const;