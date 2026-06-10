import React from 'react';
import { AppNotification } from '../types';
import { Bell, CreditCard, Ship, MessageSquare, ShieldCheck, CheckCircle, Trash2 } from 'lucide-react';

interface NotificationsFeedProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationsFeed({ notifications, onMarkRead, onClearAll }: NotificationsFeedProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div id="notifications-feed" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
          <Bell className="w-4.5 h-4.5 text-indigo-600" />
          Alertas e Informes ({unreadCount})
        </h4>

        {notifications.length > 0 && (
          <button
            id="clear-all-notifs"
            onClick={onClearAll}
            className="text-[10px] text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" /> Limpiar todo
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
        {notifications.map(not => {
          const typeIcons = {
            wallet: <CreditCard className="w-4 h-4 text-emerald-600" />,
            logistics: <Ship className="w-4 h-4 text-cyan-600" />,
            booking: <CheckCircle className="w-4 h-4 text-indigo-600" />,
            chat: <MessageSquare className="w-4 h-4 text-pink-600" />,
            system: <ShieldCheck className="w-4 h-4 text-purple-600" />
          };

          return (
            <div
              key={not.id}
              onClick={() => onMarkRead(not.id)}
              className={`p-2.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-2.5 ${
                not.read 
                  ? 'bg-slate-50/50 border-slate-100 text-slate-500' 
                  : 'bg-indigo-50/40 border-indigo-100 text-slate-850 font-medium'
              }`}
            >
              <div className="mt-0.5">{typeIcons[not.type] || <Bell className="w-4 h-4" />}</div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-slate-800 text-[11px] leading-tight">{not.title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{not.description}</p>
                <span className="text-[8.5px] text-slate-400 font-mono mt-1 block">
                  {new Date(not.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {!not.read && (
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0 mt-1.5"></span>
              )}
            </div>
          );
        })}

        {notifications.length === 0 && (
          <p className="text-center py-6 text-xs text-slate-405 font-medium">Bandeja de alertas vacía.</p>
        )}
      </div>
    </div>
  );
}
