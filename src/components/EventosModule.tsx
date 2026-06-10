import React, { useState } from 'react';
import { Music, Calendar, Star, CheckCircle, Info, DollarSign, Sparkles, MapPin } from 'lucide-react';
import { Wallet } from '../types';

interface EventItem {
  id: string;
  name: string;
  category: 'artistas' | 'sonido' | 'tarimas' | 'audiovisual';
  priceDay: number;
  rating: number;
  image: string;
  description: string;
  specs: string[];
}

const EVENT_GALLERY: EventItem[] = [
  {
    id: 'evt-1',
    name: 'Trio Vallenato Sabor Sabanero',
    category: 'artistas',
    priceDay: 250.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80',
    description: 'Banda en vivo con acordeón, caja y guacharaca. Presentaciones premium para eventos privados, bodas y festividades en la región de Urabá.',
    specs: ['3 músicos certificados', '2 horas de show completo', 'Equipos de audio portátiles incluidos']
  },
  {
    id: 'evt-2',
    name: 'Sonido Line Array Turbosonic Pro',
    category: 'sonido',
    priceDay: 480.00,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    description: 'Sistema de audio profesional para medianas y grandes intemperies. Parlantes colgados, bajos de alta fidelidad, consola digital y DJ incluido.',
    specs: ['8 Parlantes aéreos', '4 Bajos dobles potentes', 'Ingeniero de mezcla en vivo', 'DJ mezclador 6 horas']
  },
  {
    id: 'evt-3',
    name: 'Tarima Estructura de Aluminio Modular',
    category: 'tarimas',
    priceDay: 320.00,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=80',
    description: 'Plataforma armada modular desmontable de alta resistencia. Incluye estructura rígida en truss de aluminio de hasta 6 metros de altura.',
    specs: ['6m x 4m dimensiones', 'Escalera de acceso segura', 'Fondo de lona negra cortina', 'Ingenieros de montaje']
  },
  {
    id: 'evt-4',
    name: 'Streaming & Video Multicam HD',
    category: 'audiovisual',
    priceDay: 350.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1460889687473-0495347e8c55?w=500&auto=format&fit=crop&q=80',
    description: 'Producción audiovisual para eventos corporativos y artísticos. Grabación de video con 3 tiros de cámara, operador de drone y transmisión a redes de streaming.',
    specs: ['3 Cámaras SONY HD', 'Grabación drone autorizada', 'Switching transmisión en vivo', 'Descarga copia master']
  }
];

interface EventosProps {
  wallet: Wallet;
  onBookItem: (id: string, name: string, price: number, date: string) => void;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

export default function EventosModule({
  wallet,
  onBookItem,
  triggerNotification
}: EventosProps) {
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null);
  const [eventDate, setEventDate] = useState('2526-10-15');
  const [bookedMsg, setBookedMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'artistas' | 'sonido' | 'tarimas' | 'audiovisual'>('todos');

  const filteredGallery = EVENT_GALLERY.filter(item => {
    if (activeCategory === 'todos') return true;
    return item.category === activeCategory;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (selectedItem.priceDay > wallet.balanceCopUSD) {
      alert(`⚠️ Balance insuficiente. Requiere $${selectedItem.priceDay.toFixed(2)} USD pero solo tiene $${wallet.balanceCopUSD.toFixed(2)} USD en su Wallet Gold.`);
      return;
    }

    onBookItem(selectedItem.id, selectedItem.name, selectedItem.priceDay, eventDate);
    setBookedMsg(`¡Reserva Confirmada! Se ha agendado "${selectedItem.name}" para el ${eventDate}. Fondos debitados.`);
    
    triggerNotification(
      'Reserva de evento exitoso',
      `Agendado el servicio de ${selectedItem.name} para la fecha ${eventDate}.`,
      'booking'
    );

    setSelectedItem(null);
    setTimeout(() => setBookedMsg(''), 4000);
  };

  const getCategoryTheme = (cat: EventItem['category']) => {
    switch(cat) {
      case 'artistas': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'sonido': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'tarimas': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'audiovisual': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-705';
    }
  };

  return (
    <div id="eventos-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
      
      {/* Visual Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="p-2 bg-purple-100 text-purple-700 rounded-lg">🪗</span>
          Producción de Eventos & Alquiler de Estructuras
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Contratación de sonido profesional, tarimas de concierto, artistas vallenatos y producción multicámara para tus asambleas corporativas o celebraciones.
        </p>
      </div>

      {bookedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-slate-800">Reserva Protegida de Escrow Autorizada</p>
            <p className="text-emerald-700 leading-normal mt-0.5">{bookedMsg}</p>
          </div>
        </div>
      )}

      {/* Categories Switchers */}
      <div className="flex flex-wrap gap-2 select-none">
        {([
          { val: 'todos', label: 'Todos' },
          { val: 'artistas', label: '🎻 Artistas en Vivo' },
          { val: 'sonido', label: '🔊 Sonido / Line Array' },
          { val: 'tarimas', label: '🏟️ Tarimas & Truss' },
          { val: 'audiovisual', label: '📹 Producción Video' }
        ] as const).map(tab => (
          <button
            key={tab.val}
            onClick={() => setActiveCategory(tab.val)}
            className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCategory === tab.val
                ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gallery of services */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGallery.map(evt => (
            <div key={evt.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="relative h-40 bg-slate-900">
                  <img
                    src={evt.image}
                    alt={evt.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <span className={`absolute top-2 left-2 text-[9px] px-2 py-0.5 font-bold uppercase rounded-md border ${getCategoryTheme(evt.category)}`}>
                    {evt.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-slate-800 text-xs">{evt.name}</h3>
                    <div className="flex items-center gap-0.5 text-xs text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{evt.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Incluye en el flete:</p>
                    <ul className="space-y-1 text-[10px] text-slate-600 mt-1 pl-1">
                      {evt.specs.map((sp, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="text-emerald-500">✔</span> {sp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action and Pricing block */}
              <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold leading-none">VALOR / DÍA:</span>
                  <span className="font-mono text-xs font-black text-slate-800">${evt.priceDay.toFixed(2)} USD</span>
                </div>

                <button
                  onClick={() => setSelectedItem(evt)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Reservar Alquiler
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Dynamic Booking Scheduler Side form */}
        <div className="lg:col-span-1 space-y-4">
          {selectedItem ? (
            <div className="bg-white p-5 rounded-xl border border-purple-200 space-y-4 animate-fade-in">
              <div className="pb-3 border-b border-purple-100">
                <span className="text-[9px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold uppercase">Formulario Eventos</span>
                <h4 className="font-extrabold text-slate-800 text-xs mt-2">Agendar Alquiler</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{selectedItem.name}</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Fecha de la Presentación / Montaje</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 focus:bg-white focus:outline-none text-slate-800 font-semibold font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Precio del Flete (1 Día)</span>
                    <span className="font-mono font-bold">${selectedItem.priceDay.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1.5 mt-1">
                    <span>Costo SNG Tokens</span>
                    <span className="font-mono text-purple-600">${selectedItem.priceDay.toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-purple-650 hover:bg-purple-700 text-white rounded-lg text-xs font-black uppercase tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  Autorizar Depósito del Flete
                </button>

                <div className="text-[9.5px] text-slate-450 leading-relaxed text-center px-1">
                  💡 El saldo se transferirá a un garante "Escrow" local regulado. Solo se liquida una vez que el montaje o show haya finalizado.
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 text-purple-600">
                <Music className="w-4.5 h-4.5" />
                Sinergia Event Stage
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Selecciona cualquiera de nuestros artistas en vivo, sistemas Line arrays, tarimas o servicios de streaming para planificar tu evento regional en Urabá.
              </p>
              
              <div className="p-3 bg-purple-50 text-purple-900 rounded-lg text-[10px] leading-relaxed border border-purple-100 space-y-1">
                <p className="font-bold">Logística Certificada</p>
                <p>Todos nuestros proveedores disponen de pólizas de seguridad, transporte propio y certificado RETIE para montajes acústicos y de tarimas.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
