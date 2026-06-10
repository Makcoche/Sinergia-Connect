import React, { useState } from 'react';
import { HotelRoom, HotelBooking, Wallet } from '../types';
import { Calendar, Search, Star, DollarSign, Bed, Users, ShieldCheck, CheckCircle } from 'lucide-react';

interface HotelsModuleProps {
  rooms: HotelRoom[];
  bookings: HotelBooking[];
  wallet: Wallet;
  onBookHotel: (booking: Omit<HotelBooking, 'id' | 'createdAt'>) => boolean | string;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

export default function HotelsModule({ rooms, bookings, wallet, onBookHotel, triggerNotification }: HotelsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [checkIn, setCheckIn] = useState('2026-06-15');
  const [checkOut, setCheckOut] = useState('2026-06-18');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const calculateNights = (inDate: string, outDate: string) => {
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 1 : diffDays;
  };

  const handleBookingSubmit = (room: HotelRoom) => {
    if (!checkIn || !checkOut) {
      alert('Por favor selecciona las fechas de Check-In y Check-Out.');
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.pricePerNight * nights;

    if (totalPrice > wallet.balanceCopUSD) {
      alert(`⚠️ Saldo insuficiente en tu Wallet Sinergia. El costo total por ${nights} noches es de $${totalPrice.toFixed(2)} USD.`);
      return;
    }

    const res = onBookHotel({
      roomId: room.id,
      hotelName: room.hotelName,
      roomName: room.name,
      guestName: 'Valeria Restrepo',
      checkIn,
      checkOut,
      totalPrice,
      status: 'confirmed',
    });

    if (typeof res === 'string') {
      alert(`Error en la reserva: ${res}`);
    } else {
      setBookingSuccess(`¡Reserva Confirmada! Se han debitado $${totalPrice.toFixed(2)} USD por su estadía de ${nights} noches.`);
      triggerNotification(
        'Estadía programada',
        `Su reserva para ${room.name} en ${room.hotelName} está confirmada del ${checkIn} al ${checkOut}.`,
        'booking'
      );
      alert(`✔ ¡Estadía reservada! Vales de reservación generados para ${room.hotelName}.`);
    }
  };

  const roomTypes = ['all', 'suite', 'deluxe', 'standard'];

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || room.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div id="hotels-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">🏨</span>
            Hospedaje & Reservas Hoteleras Sinergia
          </h2>
          <p className="text-sm text-slate-500">Inquilinos hoteleros integrados con check-in automatizado y tarifas prepagadas con wallet con un solo clic</p>
        </div>

        {/* Global Travel Date Pickers */}
        <div className="flex gap-2 bg-white p-2 border border-slate-200 rounded-lg shadow-xs items-center text-xs">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase">Check-In</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent border-none p-0 text-slate-700 focus:outline-none focus:ring-0 font-medium font-mono"
            />
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase">Check-Out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent border-none p-0 text-slate-700 focus:outline-none focus:ring-0 font-medium font-mono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Side: Stay Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Búsqueda rápida</label>
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-slate-400"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Cartagena, suites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-2">Filtrar por Estructura</label>
              <div className="space-y-1">
                {roomTypes.map(type => (
                  <button
                    id={`hotel-type-${type}`}
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedType === type
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {type === 'all' ? 'Ver Todos los Tipos' : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Sinergia Garantía Estándar
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
              Todas las reservas realizadas vía SinergiaConnect cuentan con cancelación gratuita hasta 24 horas antes sin penalización en Sandbox Wallet.
            </p>
          </div>
        </div>

        {/* Right Side: Rooms list Grid */}
        <div className="lg:col-span-3 space-y-6">
          {bookingSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Reserva Procesada Correctamente</p>
                <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">{bookingSuccess}</p>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="text-xs text-indigo-600 underline font-bold mt-2"
                >
                  Entendido, volver a buscar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRooms.map(room => {
              const nights = calculateNights(checkIn, checkOut);
              const totalStayPrice = room.pricePerNight * nights;

              return (
                <div key={room.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-slate-100">
                      <img
                        src={room.image}
                        alt={room.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {room.rating.toFixed(1)}
                      </div>
                      <span className="absolute bottom-2 left-2 bg-teal-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        {room.type}
                      </span>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-slate-400 block">{room.hotelName}</span>
                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{room.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{room.location}</p>
                      </div>

                      {/* Amenities Row */}
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map(amenity => (
                          <span key={amenity} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs font-mono text-slate-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          <span>Habitación: {room.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          <span>Max: {room.capacityMax} pers.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">POR NOCHE:</span>
                      <p className="text-sm font-black text-rose-600 font-mono">${room.pricePerNight.toFixed(2)} <span className="text-[10px] text-slate-400 font-bold">USD</span></p>
                      <span className="text-[10px] text-indigo-600 font-bold">Total stay: ${totalStayPrice.toFixed(2)} USD</span>
                    </div>

                    <button
                      id={`book-room-${room.id}`}
                      onClick={() => handleBookingSubmit(room)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold tracking-wide uppercase transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Reservar Ahora
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredRooms.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400">
                No encontramos habitaciones que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
