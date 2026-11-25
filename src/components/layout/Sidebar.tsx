import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { ConfirmModal } from '../modal/ConfirmModal';

interface SidebarProps {
  drawerId: string;
}

export function Sidebar({ drawerId }: SidebarProps) {
  const expanded = true;

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  function handleLogout() {
    setConfirmLogoutOpen(false);
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className="drawer-side z-50">
      <label
        htmlFor={drawerId}
        aria-label="Fechar menu"
        className="drawer-overlay"
      />
      <div
        className={`bg-base-100 flex flex-col min-h-full border-r border-base-200 shadow-sm transition-all duration-300 ${
          expanded ? 'w-64 items-start' : 'w-20 items-center'
        }`}
      >
        <SidebarBrand expanded={expanded} />
        <ul className="menu w-full grow pt-4 gap-2">
          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              Icon={item.Icon}
              to={item.to}
              expanded={expanded}
            />
          ))}
        </ul>
        <div className="w-full p-4 border-t border-base-200 flex flex-col gap-3">
          {expanded && user && (
            <div className="flex items-center gap-3 px-1">
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-base-content/60 truncate">
                  @{user.githubLogin}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setConfirmLogoutOpen(true)}
            className="btn btn-ghost btn-sm justify-start gap-3 w-full text-error hover:bg-error/10"
          >
            <SignOut size={20} />
            {expanded && <span>Sair</span>}
          </button>
        </div>
      </div>
      <ConfirmModal
          open={confirmLogoutOpen}
          title="Sair da conta"
          message="Tem certeza que deseja encerrar sua sessão?"
          confirmLabel="Sair"
          confirmVariant="error"
          onConfirm={handleLogout}
          onCancel={() => setConfirmLogoutOpen(false)}
      />
    </aside>
  );
}