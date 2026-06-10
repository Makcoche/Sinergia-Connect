import React, { useState } from 'react';
import { 
  Utensils, 
  Clock, 
  MapPin, 
  ShoppingCart, 
  Check, 
  Calendar, 
  ArrowRight, 
  Compass, 
  Heart, 
  Coffee, 
  DollarSign, 
  Sparkles, 
  ChevronRight,
  PackageCheck,
  Bike
} from 'lucide-react';
import { Wallet, Transaction } from '../types';

interface MenuItem {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  category: 'plato_fuerte' | 'bebida' | 'postre' | 'panaderia';
  description: string;
  image: string;
  rating: number;
}

interface Restaurant {
  id: string;
  name: string;
  category: 'restaurante' | 'comidas_rapidas' | 'cafeteria' | 'panaderia';
  address: string;
  rating: number;
  image: string;
  logo: string;
  deliveryTimeMins: number;
}

interface OrderTracer {
  id: string;
  restaurantName: string;
  dishName: string;
  totalPaid: number;
  status: 'recibido' | 'cocina' | 'camino' | 'entregado';
  createdAt: string;
}

interface GastronomiaProps {
  wallet: Wallet;
  onRechargeWallet: (amount: number) => void;
  onDecreaseWallet: (amount: number, detail: string) => void;
  triggerNotification: (title: string, description: string, type: 'wallet' | 'booking' | 'system') => void;
}

const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Restaurante Sabor de Urabá',
    category: 'restaurante',
    address: 'Apartadó - Cra 100 Zona Rosa',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    logo: '🐟',
    deliveryTimeMins: 35
  },
  {
    id: 'rest-2',
    name: 'Carbonera Grill & Carnes',
    category: 'comidas_rapidas',
    address: 'Chigorodó - Boulevard Principal',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
    logo: '🥩',
    deliveryTimeMins: 25
  },
  {
    id: 'rest-3',
    name: 'Café Coffee Break Carepa',
    category: 'cafeteria',
    address: 'Carepa - Frente a Plaza Mayor',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
    logo: '☕',
    deliveryTimeMins: 15
  },
  {
    id: 'rest-4',
    name: 'Repostería Dulce Tentación',
    category: 'panaderia',
    address: 'Turbo - Sector Marítimo',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    logo: '🍰',
    deliveryTimeMins: 20
  }
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'dish-1',
    restaurantId: 'rest-1',
    restaurantName: 'Restaurante Sabor de Urabá',
    name: 'Cazuela de Mariscos Caribeña',
    price: 18.50,
    category: 'plato_fuerte',
    description: 'Fina selección de pulpo, calamares, camarones frescos y almejas en guiso de coco de Turbo.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 'dish-2',
    restaurantId: 'rest-1',
    restaurantName: 'Restaurante Sabor de Urabá',
    name: 'Pargo Rojo con Patacón Bananero',
    price: 14.00,
    category: 'plato_fuerte',
    description: 'Pargo fresco frito, acompañado de ensalada agridulce, patacones de Carepa crujientes y arroz de coco.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80',
    rating: 4.8
  },
  {
    id: 'dish-3',
    restaurantId: 'rest-2',
    restaurantName: 'Carbonera Grill & Carnes',
    name: 'Hamburguesa Sinergia Parrillera',
    price: 9.50,
    category: 'plato_fuerte',
    description: '180g de carne madurada, queso cheddar fundido, tocineta ahumada y cebolla crisps caramelizada.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    rating: 4.6
  },
  {
    id: 'dish-4',
    restaurantId: 'rest-3',
    restaurantName: 'Café Coffee Break Carepa',
    name: 'Café Latte Especial del Gremio',
    price: 3.20,
    category: 'bebida',
    description: 'Doble shot de espresso elaborado con granos de origen Antioquia y leche espumosa de granja local.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&auto=format&fit=crop&q=80',
    rating: 4.9
  },
  {
    id: 'dish-5',
    restaurantId: 'rest-4',
    restaurantName: 'Repostería Dulce Tentación',
    name: 'Torta Tres Leches de Guanábana',
    price: 4.50,
    category: 'postre',
    description: 'Bizcocho esponjoso bañado en tres leches enriquecido con jalea pura de guanábana regional de Chigorodó.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    rating: 4.7
  }
];

export default function GastronomiaModule({
  wallet,
  onRechargeWallet,
  onDecreaseWallet,
  triggerNotification
}: GastronomiaProps) {
  const [restaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedRestId, setSelectedRestId] = useState<string>('todos');
  const [activeTab, setActiveTab] = useState<'restaurantes' | 'pedidos' | 'reservas'>('restaurantes');

  const [orders, setOrders] = useState<OrderTracer[]>([]);

  // Tables Booking Form State
  const [bookingRest, setBookingRest] = useState<string>('Restaurante Sabor de Urabá');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('20:00');
  const [bookingPax, setBookingPax] = useState('2');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleMakeOrder = (dish: MenuItem) => {
    const orderCost = dish.price;

    if (wallet.balanceCopUSD < orderCost) {
      alert(`✘ Fondos insuficientes en Billetera Virtual Sinergia.\nCosto: $${orderCost.toFixed(2)} USD\nTu saldo: $${wallet.balanceCopUSD.toFixed(2)} USD.\n\nPor favor, recarga tu cuenta en la sección "Wallet Sinergia-Pasarela" para completar este pedido.`);
      return;
    }

    // Deduct and log transaction
    onDecreaseWallet(orderCost, `Pedido Gastronómico: *${dish.name}* en ${dish.restaurantName}`);
    
    // Add inside orders list
    const newOrder: OrderTracer = {
      id: `ord-${Date.now().toString().slice(-5)}`,
      restaurantName: dish.restaurantName,
      dishName: dish.name,
      totalPaid: orderCost,
      status: 'recibido',
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    triggerNotification('Orden Recibida 🍕', `Tu pedido de "${dish.name}" está en preparación con el restaurante.`, 'wallet');
    alert(`✔ ¡Pedido aprobado con éxito por la Pasarela Sinergia Pay!\nSe descontaron $${orderCost.toFixed(2)} USD de su saldo virtual.`);
    setActiveTab('pedidos');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRest || !bookingDate || !bookingTime) {
      alert('Por favor digita todos los campos.');
      return;
    }

    setBookingSuccess(true);
    triggerNotification('Mesa Reservada 🍽', `Reserva confirmada en ${bookingRest} para el día ${bookingDate}.`, 'booking');
  };

  const advTracer = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      let nextStat = o.status;
      if (o.status === 'recibido') nextStat = 'cocina';
      else if (o.status === 'cocina') nextStat = 'camino';
      else if (o.status === 'camino') nextStat = 'entregado';
      
      if (nextStat !== o.status) {
        triggerNotification('Actualización Estado Domicilio 🛵', `Pedido #${o.id} cambió su estado a ${nextStat.toUpperCase()}`, 'system');
      }
      return { ...o, status: nextStat };
    }));
  };

  const activeRest = restaurants.find(r => r.id === selectedRestId);
  const activeDishes = menuItems.filter(dish => selectedRestId === 'todos' || dish.restaurantId === selectedRestId);

  return (
    <div className="space-y-6">
      {/* Visual Header Grid banner and quick navigation tabs */}
      <div className="bg-gradient-to-r from-red-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 shadow-sm border border-red-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-red-500/30 text-rose-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            Módulo Gastronomía & Alimentos
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">Sinergia Gastronómica Express</h2>
          <p className="text-xs text-rose-200 mt-1">Menú digital unificado, pasarela de pago virtual integrada y domicilios en tiempo real</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('restaurantes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'restaurantes' ? 'bg-white text-slate-900' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🍔 Menú Digital
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'pedidos' ? 'bg-white text-slate-900' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🏍 Rastreador ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('reservas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'reservas' ? 'bg-white text-slate-900' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🍽 Reservar Mesa
          </button>
        </div>
      </div>

      {/* VIEW: TABLE BOOKINGS */}
      {activeTab === 'reservas' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-4">
          <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base uppercase">Reserva tu Mesa Online sin Costo</h3>
            <p className="text-xs text-slate-450 leading-relaxed">Olvídate de las filas. Reserva mesa en los mejores restaurantes y reposterías de Urabá de inmediato.</p>
          </div>

          {bookingSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-250 text-center rounded-xl space-y-3">
              <span className="text-3xl text-emerald-600">✔</span>
              <h4 className="font-bold text-emerald-800 text-sm">¡Reserva Confirmada Exitosamente!</h4>
              <p className="text-xs text-slate-650 leading-relaxed">Se ha agendado una mesa en <strong>{bookingRest}</strong> para el día <strong>{bookingDate}</strong> a las <strong>{bookingTime}</strong> para <strong>{bookingPax} personas</strong>.</p>
              <button
                onClick={() => setBookingSuccess(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-bold uppercase"
              >
                Hacer otra Reserva
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">1. Elija el Restaurante o Establecimiento</label>
                <select
                  value={bookingRest}
                  onChange={(e) => setBookingRest(e.target.value)}
                  className="w-full border border-slate-250 p-2.5 rounded-lg focus:outline-none bg-white text-slate-750 font-bold"
                >
                  {restaurants.map(r => (
                    <option key={r.id} value={r.name}>{r.logo} {r.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Fecha de Visita</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Hora de Citación</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded-lg font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Total Comensales</label>
                  <select
                    value={bookingPax}
                    onChange={(e) => setBookingPax(e.target.value)}
                    className="w-full border border-slate-250 p-2 rounded-lg focus:outline-none bg-white font-bold"
                  >
                    <option value="1">1 Persona</option>
                    <option value="2">2 Personas</option>
                    <option value="4">4 Personas</option>
                    <option value="6">6 Personas</option>
                    <option value="10">Grupo (10+)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-750 text-white rounded-lg font-black uppercase tracking-wider text-[10px]"
              >
                📑 Confirmar Reserva de Mesa
              </button>
            </form>
          )}
        </div>
      )}

      {/* VIEW: ORDER TRACER */}
      {activeTab === 'pedidos' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-205 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase">🏍 Rastreo y Domicilio de Pedidos</h3>
              <p className="text-xs text-slate-450 mt-1">Visualiza los despachos de comida integrada procesados en tiempo real.</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Sandbox Tracker Activo</span>
          </div>

          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-black text-rose-650 uppercase bg-rose-50 px-2 py-0.5 rounded leading-tight">
                      Orden #{o.id}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs mt-1.5">{o.dishName}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{o.restaurantName}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-800 font-mono">${o.totalPaid.toFixed(2)} USD</span>
                    {o.status !== 'entregado' && (
                      <button
                        onClick={() => advTracer(o.id)}
                        className="block mt-2 px-2.5 py-1 bg-slate-900 text-amber-400 rounded text-[9.5px] font-black uppercase tracking-wider transition-all"
                      >
                        Avanzar Despacho ▶
                      </button>
                    )}
                  </div>
                </div>

                {/* Progressive Tracing Bar */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-400 select-none relative">
                    <div className="absolute top-2.5 left-[12.5%] right-[12.5%] h-0.5 bg-slate-200 -z-10"></div>
                    <div 
                      className="absolute top-2.5 left-[12.5%] h-0.5 bg-rose-500 transition-all duration-300 -z-10"
                      style={{ 
                        width: o.status === 'recibido' ? '0%' : o.status === 'cocina' ? '33.3%' : o.status === 'camino' ? '66.6%' : '100%' 
                      }}
                    ></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[10px] ${o.status === 'recibido' ? 'bg-rose-600 text-white border-rose-600' : 'bg-emerald-500 text-white border-emerald-500'}`}>
                        1
                      </span>
                      <span className={o.status === 'recibido' ? 'text-rose-600 font-black' : 'text-slate-500'}>Recibido</span>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[10px] ${o.status === 'cocina' ? 'bg-rose-600 text-white border-rose-600' : ['camino', 'entregado'].includes(o.status) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                        2
                      </span>
                      <span className={o.status === 'cocina' ? 'text-rose-600 font-black' : 'text-slate-500'}>En Cocina</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[10px] ${o.status === 'camino' ? 'bg-rose-600 text-white border-rose-600' : o.status === 'entregado' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                        3
                      </span>
                      <span className={o.status === 'camino' ? 'text-rose-600 font-black' : 'text-slate-500'}>En Camino</span>
                    </div>

                    {/* Step 4 */}
                    <div className="flex flex-col items-center gap-1">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-bold text-[10px] ${o.status === 'entregado' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-200'}`}>
                        4
                      </span>
                      <span className={o.status === 'entregado' ? 'text-emerald-600 font-black' : 'text-slate-500'}>Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="p-12 text-center text-xs text-slate-400 bg-white border border-slate-200 rounded-xl leading-normal">
                No has realizado ningún pedido gastronómico en esta sesión activa.<br />
                Visita la pestaña "Menú Digital" y haz clic en comprar sobre cualquiera de los deliciosos platos típicos u ofertas de panaderías.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW: DIGITAL MENU AND SHOPPING */}
      {activeTab === 'restaurantes' && (
        <div className="space-y-6">
          {/* Select Restaurant Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-2 select-none items-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Filtrar por Local:</span>
            <button
              onClick={() => setSelectedRestId('todos')}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${selectedRestId === 'todos' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Todos los Establecimientos 🍽
            </button>
            {restaurants.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRestId(r.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${selectedRestId === r.id ? 'bg-red-650 border-red-650 text-white' : 'bg-white border-slate-200 text-slate-605 hover:bg-slate-50'}`}
              >
                <span>{r.logo}</span> {r.name}
              </button>
            ))}
          </div>

          {/* Restaurant Profiles section if a specific one is filtered */}
          {activeRest && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-sm transition-all">
              <div className="md:w-56 h-40 md:h-auto bg-slate-100 flex-shrink-0">
                <img 
                  src={activeRest.image} 
                  alt={activeRest.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-5 flex-grow space-y-3 flex flex-col justify-between text-xs">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-extrabold text-slate-800 text-base">{activeRest.name}</h3>
                    <span className="text-[9px] bg-red-50 text-red-700 font-extrabold px-2 py-0.5 rounded uppercase leading-normal">
                      {activeRest.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] flex items-center gap-0.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-505" /> {activeRest.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-4 text-slate-500 text-[11px] font-mono">
                  <div>⏱ Domicilio: <strong>{activeRest.deliveryTimeMins} mins</strong></div>
                  <div>⭐ Calificación: <strong>{activeRest.rating} / 5.0</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Dishes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeDishes.map(dish => (
              <div 
                key={dish.id} 
                className="bg-white rounded-2xl border border-slate-205 overflow-hidden flex flex-col sm:flex-row hover:shadow-md hover:border-red-200 transition-all"
              >
                {/* Image */}
                <div className="sm:w-36 h-36 relative flex-shrink-0 bg-slate-50">
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white rounded font-mono font-bold text-[8.5px] uppercase">
                    {dish.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Description */}
                <div className="p-4 flex-grow flex flex-col justify-between text-xs">
                  <div>
                    <span className="text-[9.5px] font-mono font-semibold text-slate-400 block truncate">
                      {dish.restaurantName}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-xs mt-1 leading-snug">{dish.name}</h4>
                    <p className="text-[11px] text-slate-550 mt-1 leading-relaxed linen-clamp-2">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-rose-50/60 mt-3 flex justify-between items-center">
                    <span className="text-sm font-black text-rose-600 font-mono">
                      ${dish.price.toFixed(2)} USD
                    </span>

                    <button
                      onClick={() => handleMakeOrder(dish)}
                      className="px-3.5 py-1.5 bg-red-650 hover:bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Comprar Plato 🍕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
