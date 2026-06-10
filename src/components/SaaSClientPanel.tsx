import React, { useState } from 'react';
import { UserProfile, Wallet, Transaction, Product, HotelRoom, TourPackage } from '../types';
import { 
  User, 
  Heart, 
  ShoppingCart, 
  Calendar, 
  History, 
  Wallet as WalletIcon, 
  HelpCircle,
  ThumbsUp,
  Star,
  Plus,
  Send,
  MessageSquare,
  CheckCircle,
  Clock
} from 'lucide-react';

interface SaaSClientPanelProps {
  currentUser: UserProfile;
  wallet: Wallet;
  transactions: Transaction[];
  products: Product[];
  rooms: HotelRoom[];
  tours: TourPackage[];
  onRechargeWallet: (amount: number, desc: string) => void;
  onTransferWallet: (email: string, amount: number, desc: string) => boolean | string;
  onNavigateTab: (tab: any) => void;
  triggerNotification: (title: string, desc: string, type: string) => void;
  favorites?: string[];
  onRemoveFavorite?: (id: string) => void;
}

export default function SaaSClientPanel({
  currentUser,
  wallet,
  transactions,
  products,
  rooms,
  tours,
  onRechargeWallet,
  onTransferWallet,
  onNavigateTab,
  triggerNotification,
  favorites = [],
  onRemoveFavorite
}: SaaSClientPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'favorites' | 'purchases' | 'wallet' | 'support'>('profile');

  // Local support message state
  const [helpSubject, setHelpSubject] = useState('support');
  const [helpMessage, setHelpMessage] = useState('');
  const [helpSuccess, setHelpSuccess] = useState(false);

  // Filter transaction ledger specifically for this client
  const clientTransactions = transactions.filter(t => t.userId === currentUser.id);

  // Client simulated purchases and hotel/tour bookings
  const clientPurchases = [
    { id: 'item-848', name: 'Zapatos de Trail Run SNG', price: 85.00, qty: 1, date: '2026-06-08', status: 'entregado' },
    { id: 'item-104', name: 'Auriculares Premium ANC', price: 120.00, qty: 2, date: '2026-06-10', status: 'en ruta' }
  ];

  const clientBookings = [
    { id: 'bok-901', name: 'Habitación Presidencial - Palacio Real', type: 'hospedaje', date: '2026-06-12', price: 180.00, status: 'confirmada' },
    { id: 'bok-442', name: 'Tour Avistamiento de Aves - Urabá', type: 'experiencia', date: '2026-06-15', price: 95.00, status: 'agendada' }
  ];

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpMessage) return;

    setHelpSuccess(true);
    setHelpMessage('');
    triggerNotification(
      'Ticket de Soporte Creado',
      'Nuestro equipo de ingeniería de Sinergia Connect responderá tu ticket a la brevedad.',
      'system'
    );
    setTimeout(() => setHelpSuccess(false), 3000);
  };

  return (
    <div id="saas-client-panel" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
      
      {/* Client Panel Top Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-slate-805 tracking-tight">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold uppercase text-[9px] border border-indigo-100">
                Cliente Star
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">ID Cuenta: {currentUser.id.toUpperCase()} • Correo: {currentUser.email}</p>
          </div>
        </div>

        {/* Dashboard Navigation Buttons */}
        <div className="flex flex-wrap bg-slate-100/80 p-1 border border-slate-200 rounded-xl text-[10.5px]">
          {([
            { id: 'profile', label: 'Mi Cuenta' },
            { id: 'favorites', label: `Mis Favoritos (${favorites.length})` },
            { id: 'purchases', label: 'Compras & Reservas' },
            { id: 'wallet', label: 'Monedero / Wallet' },
            { id: 'support', label: 'Soporte Técnico' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-white text-indigo-750 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main sections container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        
        {/* TAB 1: User Profile summary details */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <User className="w-4.5 h-4.5 text-indigo-600" /> Resumen de Cuenta de Cliente
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-805 px-2.5 py-0.5 rounded border border-emerald-150 font-bold">CONEXIÓN REFORZADA SSL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 leading-normal text-xs text-slate-650">
              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 space-y-3">
                <p className="flex justify-between border-b pb-1"><span>Nombre Completo:</span> <strong className="text-slate-800">{currentUser.name}</strong></p>
                <p className="flex justify-between border-b pb-1"><span>Correo Electrónico:</span> <strong className="text-slate-800 font-mono">{currentUser.email}</strong></p>
                <p className="flex justify-between pb-1"><span>Celular de Enlace:</span> <strong className="text-slate-850 font-mono">{currentUser.phone || '+57 322 000 0000'}</strong></p>
              </div>

              <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-150 space-y-3">
                <p className="flex justify-between border-b pb-1"><span>Sandbox Token Balance:</span> <strong className="text-emerald-600 font-mono">${wallet.balanceCopUSD.toFixed(2)} USD</strong></p>
                <p className="flex justify-between border-b pb-1"><span>Moneda de Liquidación:</span> <strong className="text-slate-800">SNG TOKEN</strong></p>
                <p className="flex justify-between pb-1"><span>Cuenta Monedero:</span> <strong className="text-slate-800 font-mono truncate">{wallet.accountNumber}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Favorites directories */}
        {activeSubTab === 'favorites' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" /> Mi Portafolio de Interés (Favoritos)
              </h3>
              <p className="text-[10px] text-slate-400">Los productos o servicios que has marcado para revisión posterior.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-650">
              {favorites.map(id => {
                // Try finding inside products, rooms, tours, etc.
                const matchedPr = products.find(p => p.id === id);
                const matchedRm = rooms.find(r => r.id === id);
                const matchedTr = tours.find(t => t.id === id);

                const itemData = matchedPr || matchedRm || matchedTr;
                if (!itemData) return null;

                const price = (itemData as any).price || (itemData as any).pricePerNight || (itemData as any).pricePerPerson || 0;
                const name = (itemData as any).name || (itemData as any).title || '';
                const image = (itemData as any).image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80';

                return (
                  <div key={id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-3">
                    <img
                      src={image}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{name}</h4>
                      <p className="font-mono text-[10.5px] text-rose-600 font-bold mt-1">${price.toFixed(2)} USD</p>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite && onRemoveFavorite(id)}
                      className="px-2 py-1 text-slate-400 hover:text-rose-600 font-bold uppercase text-[9px] border hover:border-rose-200 rounded transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                );
              })}

              {favorites.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                  Aún no has añadido elementos a tu lista de favoritos.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Purchases and Reservation Ledgers */}
        {activeSubTab === 'purchases' && (
          <div className="space-y-6">
            
            {/* Subsection A: Product purchases */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs tracking-wide uppercase flex items-center gap-1">
                <ShoppingCart className="w-4 h-4 text-emerald-600" /> Historial de Compras de Comercio
              </h4>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-xs text-slate-650">
                  <thead>
                    <tr className="border-b bg-slate-50 uppercase font-black text-slate-400">
                      <th className="py-2.5 px-4 font-mono">ID Compra</th>
                      <th className="py-2.5 px-4">Fecha</th>
                      <th className="py-2.5 px-4">Producto Adquirido</th>
                      <th className="py-2.5 px-4 text-center">Qty</th>
                      <th className="py-2.5 px-4 text-right">Monto</th>
                      <th className="py-2.5 px-4 text-center">Estado Envíos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientPurchases.map(pc => (
                      <tr key={pc.id}>
                        <td className="py-3 px-4 font-mono text-slate-700 font-semibold">{pc.id.toUpperCase()}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{pc.date}</td>
                        <td className="py-3 px-4 text-slate-850 font-bold">{pc.name}</td>
                        <td className="py-3 px-4 text-center">{pc.qty}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-550">${pc.price.toFixed(2)} USD</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            pc.status === 'entregado' ? 'bg-emerald-50 text-emerald-805' : 'bg-indigo-50 text-indigo-705'
                          }`}>
                            {pc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subsection B: Leisure bookings */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-850 text-xs tracking-wide uppercase flex items-center gap-1">
                <Calendar className="w-4 h-4 text-indigo-650" /> Mis Reservas de Hoteles & Turismo
              </h4>
              <div className="overflow-x-auto border rounded-xl">
                <table className="w-full text-left border-collapse text-xs text-slate-655">
                  <thead>
                    <tr className="border-b bg-slate-50 uppercase font-black text-slate-400">
                      <th className="py-2.5 px-4 font-mono">Cod Reserva</th>
                      <th className="py-2.5 px-4">Destino / Servicio</th>
                      <th className="py-2.5 px-4">Fecha Reservada</th>
                      <th className="py-2.5 px-4">Vertical</th>
                      <th className="py-2.5 px-4 text-right">Tarifa Canjeada</th>
                      <th className="py-2.5 px-4 text-center">Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientBookings.map(bk => (
                      <tr key={bk.id}>
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{bk.id.toUpperCase()}</td>
                        <td className="py-3 px-4 text-slate-850 font-bold">{bk.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{bk.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-1.5 py-0.5 rounded bg-slate-105 font-bold uppercase text-[9px] text-slate-600">
                            {bk.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-rose-500">${bk.price.toFixed(2)} USD</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-50 text-indigo-805">
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: Private Wallet sandbox transfers/deposit integrations */}
        {activeSubTab === 'wallet' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <WalletIcon className="w-4.5 h-4.5 text-emerald-600" /> Monedero de Ahorros Multi-SaaS
              </h3>
              <p className="text-[10px] text-slate-400">Canjea y recarga tus SNG tokens para procesar fletes, habitaciones de lujo y compras de comercio instantáneo en Urabá.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
              
              {/* Recharge Sandbox Controls */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-4">
                <h4 className="font-bold text-slate-800 uppercase text-[10px]">Cargar Depósito Sandbox</h4>
                <p className="text-[11px] text-slate-500 leading-normal">Carga fondos ficticios en tu balance de prueba inmediatamente para habilitar contratos de flete, compras o estadías.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRechargeWallet(500, 'Recarga Express Digital Client')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold uppercase text-[10px]"
                  >
                    +$500 USD
                  </button>
                  <button
                    onClick={() => onRechargeWallet(1000, 'Recarga Express Digital Client Premium')}
                    className="flex-1 py-2 bg-slate-900 text-white rounded hover:bg-black font-bold uppercase text-[10px]"
                  >
                    +$1000 USD
                  </button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-805 uppercase text-[10px] flex items-center gap-1">
                  <History className="w-4 h-4 text-indigo-650" /> Bitácora de Movimientos
                </h4>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {clientTransactions.map(tx => (
                    <div key={tx.id} className="p-2 bg-slate-50/50 border border-slate-150 rounded-lg flex justify-between items-center text-[11px]">
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[150px]">{tx.description}</p>
                        <span className="text-[9.5px] text-slate-400 font-mono">{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                      <span className={`font-mono font-bold ${
                        tx.type.includes('recharge') ? 'text-emerald-600' : 'text-slate-700'
                      }`}>
                        {tx.type.includes('recharge') ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {clientTransactions.length === 0 && (
                    <p className="text-center py-6 text-slate-400 text-[11px]">Aún no has registrado transacciones en esta sesión sandbox.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: Client Support Technical Ticket template */}
        {activeSubTab === 'support' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-indigo-600" /> Soporte e Interacción Directa
              </h3>
              <p className="text-[10px] text-slate-400">Abre tickets de consulta o conéctate con tus comercios.</p>
            </div>

            {helpSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-805 text-xs text-center font-bold">
                 ✔️ ¡Ticket aperturado con éxito! Te contactaremos al correo registrado {currentUser.email}.
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-3.5 text-xs select-none">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Motivo del Ticket</label>
                  <select
                    value={helpSubject}
                    onChange={(e) => setHelpSubject(e.target.value)}
                    className="w-full border p-2 bg-white rounded-lg focus:outline-none"
                  >
                    <option value="support">Reembolso ó Conciliación de SNG Tokens</option>
                    <option value="delivery">Demoras en Flete de Transporte Carga</option>
                    <option value="booking">Problemas con Check-In de Hotel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Descripción del Incidente o Pregunta</label>
                  <textarea
                    required
                    placeholder="Describe detalladamente el siniestro o duda..."
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    className="w-full border p-2.5 bg-slate-50 focus:bg-white rounded-lg h-20 focus:outline-none text-slate-800"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 border border-slate-800 hover:bg-black text-white rounded-xl font-bold uppercase tracking-wide text-[10px]"
                  >
                    Aperturar Ticket Soporte
                  </button>
                </div>
              </form>
            )}

            {/* Instant links support shortcuts */}
            <div className="pt-4 border-t border-slate-100 flex gap-4 text-xs font-medium text-slate-550 justify-center select-none">
              <button onClick={() => onNavigateTab('chat')} className="flex items-center gap-1 text-indigo-650 hover:underline">
                <MessageSquare className="w-4 h-4" /> Chatear en Vivo con Soporte Sinergia
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
