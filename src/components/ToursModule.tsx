import React, { useState } from 'react';
import { TourPackage, TourBooking, Wallet } from '../types';
import { Compass, Users, Clock, MapPin, CheckCircle, Star, Sparkles, Footprints } from 'lucide-react';

interface ToursModuleProps {
  tours: TourPackage[];
  bookings: TourBooking[];
  wallet: Wallet;
  onBookTour: (booking: Omit<TourBooking, 'id' | 'createdAt'>) => boolean | string;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

export default function ToursModule({ tours, bookings, wallet, onBookTour, triggerNotification }: ToursModuleProps) {
  const [paxMap, setPaxMap] = useState<Record<string, number>>({});
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const getPax = (tourId: string) => paxMap[tourId] || 2; // defaults to 2 hikers

  const setPax = (tourId: string, val: number) => {
    setPaxMap({ ...paxMap, [tourId]: val });
  };

  const handleBook = (tour: TourPackage) => {
    const pax = getPax(tour.id);
    const totalPrice = tour.pricePerPerson * pax;

    if (totalPrice > wallet.balanceCopUSD) {
      alert(`⚠️ Saldo insuficiente en su Billetera Digital. El costo total para ${pax} personas es de $${totalPrice.toFixed(2)} USD.`);
      return;
    }

    if (tour.spotsLeft < pax) {
      alert(`Lo sentimos, el operador solo cuenta con ${tour.spotsLeft} cupos disponibles.`);
      return;
    }

    const res = onBookTour({
      tourId: tour.id,
      tourTitle: tour.title,
      customerName: 'Valeria Restrepo',
      paxCount: pax,
      date: '2026-07-15', // simulated booking date
      totalPrice,
      status: 'booked',
    });

    if (typeof res === 'string') {
      alert(`Error en la reserva turística: ${res}`);
    } else {
      setBookingSuccess(`¡Reserva Procesada! Se han debitado $${totalPrice.toFixed(2)} USD para ${pax} excursionistas.`);
      triggerNotification(
        'Tour programado',
        `Su expedición a: ${tour.title} ha sido agendada con éxito para ${pax} turistas en Sandbox.`,
        'booking'
      );
      alert(`✔ ¡Paquete de Viaje Reservado exitosamente! Hemos enviado sus vouchers digitales.`);
    }
  };

  return (
    <div id="tours-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">🏔️</span>
          Turismo & Paquetes Eco-Aventura
        </h2>
        <p className="text-sm text-slate-500">Operadores locales brindando planes exóticos, guías certificados y seguros de viaje unificados en Sinergia</p>
      </div>

      {bookingSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Reserva Turística Confirmada</p>
            <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">{bookingSuccess}</p>
            <button
              onClick={() => setBookingSuccess(null)}
              className="text-xs text-indigo-600 underline font-bold mt-2"
            >
              Cerrar mensaje
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map(tour => {
          const pax = getPax(tour.id);
          const totalCost = tour.pricePerPerson * pax;

          return (
            <div key={tour.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col md:flex-row">
              {/* Image side content */}
              <div className="relative md:w-2/5 md:h-auto h-48 bg-slate-100">
                <img
                  src={tour.image}
                  alt={tour.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-indigo-600 text-white font-mono text-[9px] font-black px-2.5 py-1 rounded">
                  {tour.durationDays} Días / {tour.durationDays - 1} Noches
                </span>
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {tour.rating.toFixed(1)}
                </div>
              </div>

              {/* Text info layout side */}
              <div className="p-5 md:w-3/5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{tour.destination}</span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm">{tour.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">{tour.description}</p>
                  
                  {/* Included List */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">¿Qué incluye el paquete?</p>
                    <div className="grid grid-cols-1 gap-1 text-[10px] text-slate-600">
                      {tour.included.slice(0, 3).map((inc, i) => (
                        <p key={i} className="truncate select-none">✔ {inc}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <div className="flex items-center gap-1 text-slate-500 font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>{tour.durationDays}D / {tour.durationDays - 1}N</span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-bold">
                      Cupos restantes: <span className="text-emerald-600 font-black">{tour.spotsLeft}</span>
                    </div>
                  </div>

                  {/* Pax Counter Selector and checkout */}
                  <div className="flex justify-between items-center gap-2 pt-2">
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase mb-1">Pasajeros</label>
                      <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                        <button
                          onClick={() => setPax(tour.id, Math.max(1, pax - 1))}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono text-xs">{pax}</span>
                        <button
                          onClick={() => setPax(tour.id, Math.min(tour.spotsLeft, pax + 1))}
                          className="px-2 py-0.5 hover:bg-slate-100 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 font-bold block">TOTAL PLAN:</span>
                      <p className="text-xs font-black text-rose-600 font-mono">${totalCost.toFixed(2)} USD</p>
                      <p className="text-[9px] text-indigo-500">Tasa: ${(tour.pricePerPerson).toFixed(2)} / persona</p>
                    </div>
                  </div>

                  <button
                    id={`book-tour-${tour.id}`}
                    onClick={() => handleBook(tour)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-wide uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Compass className="w-4.5 h-4.5" />
                    Adquirir Plan Vacacional
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
