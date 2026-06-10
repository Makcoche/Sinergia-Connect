import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  FileText, 
  Phone, 
  Compass, 
  Layers, 
  Plus, 
  Briefcase, 
  Check, 
  Eye, 
  Trash2, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  Camera 
} from 'lucide-react';
import { Wallet, Transaction } from '../types';

interface Property {
  id: string;
  title: string;
  type: 'casa' | 'apartamento' | 'lote' | 'finca' | 'bodega' | 'local';
  dealType: 'venta' | 'arriendo';
  price: number;
  location: string;
  sizeSqM: number;
  rooms?: number;
  bathrooms?: number;
  image: string;
  description: string;
  featured: boolean;
  coordinates: string;
}

interface Lead {
  id: string;
  propertyTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: 'nuevo' | 'contactado' | 'negociando' | 'cerrado';
  createdAt: string;
}

interface InmobiliariaProps {
  wallet: Wallet;
  onDecreaseWallet: (amount: number, detail: string) => void;
  triggerNotification: (title: string, description: string, type: 'wallet' | 'booking' | 'system') => void;
  isGuest?: boolean;
}

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Finca Bananera Carepa Real',
    type: 'finca',
    dealType: 'venta',
    price: 135000,
    location: 'Carepa - Vía Platanera',
    sizeSqM: 12000,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
    description: 'Excelente finca bananera en plena producción con sistema de riego automatizado, canales de drenaje óptimos y excelente acceso para tractomulas de carga.',
    featured: true,
    coordinates: '7.7554° N, 76.6541° W'
  },
  {
    id: 'prop-2',
    title: 'Apartamento Duplex Vista Hermosa',
    type: 'apartamento',
    dealType: 'arriendo',
    price: 450,
    location: 'Apartadó - Barrio Centro Ortiz',
    sizeSqM: 120,
    rooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    description: 'Estupendo apartamento duplex amoblado, cocina integral open-concept, balcón panorámico y aire acondicionado inverter en todas las alcobas.',
    featured: true,
    coordinates: '7.8821° N, 76.6291° W'
  },
  {
    id: 'prop-3',
    title: 'Bodega Logística Puerto Frío',
    type: 'bodega',
    dealType: 'arriendo',
    price: 1800,
    location: 'Chigorodó - Zona Industrial',
    sizeSqM: 850,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    description: 'Bodega de almacenamiento de alta resistencia con muelles de carga, andenes de despacho refrigerados y subestación eléctrica propia.',
    featured: false,
    coordinates: '7.6710° N, 76.6802° W'
  },
  {
    id: 'prop-4',
    title: 'Lote Urbanizable Turbaco Gold',
    type: 'lote',
    dealType: 'venta',
    price: 45000,
    location: 'Turbo - Frente al Boulevard Marítimo',
    sizeSqM: 1500,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&auto=format&fit=crop&q=80',
    description: 'Terreno plano de alta densidad comercial contiguo a las nuevas obras del puerto marítimo. Servicios de acueducto y luz ya instalados en pie de lote.',
    featured: false,
    coordinates: '8.0934° N, 76.7279° W'
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    propertyTitle: 'Finca Bananera Carepa Real',
    clientName: 'Alejandro Restrepo',
    clientEmail: 'alejandro@bananassur.com',
    clientPhone: '+57 321 889 0101',
    message: 'Estoy interesado en visitarla esta misma semana. Busco financiamiento directo.',
    status: 'contactado',
    createdAt: '2026-06-09T14:30:00Z'
  }
];

export default function InmobiliariaModule({ wallet, onDecreaseWallet, triggerNotification, isGuest }: InmobiliariaProps) {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState<'lista' | 'servicios' | 'crm' | 'virtual360'>('lista');

  // Filter keys
  const [dealFilter, setDealFilter] = useState<'todos' | 'venta' | 'arriendo'>('todos');
  const [typeFilter, setTypeFilter] = useState<string>('todos');

  // New property form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<Property['type']>('casa');
  const [newDeal, setNewDeal] = useState<Property['dealType']>('venta');
  const [newPrice, setNewPrice] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Client form
  const [contactingProperty, setContactingProperty] = useState<Property | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');

  // 360 Tour State
  const [tourDeg, setTourDeg] = useState(0);

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      alert('🚫 Operación Denegada: Como usuario invitado no tienes permisos para publicar/registrar propiedades en este sector. Por favor regístrate o inicia sesión con una cuenta para poder publicar o realizar transacciones.');
      return;
    }
    if (!newTitle || !newPrice || !newLocation) {
      alert('Por favor rellene los campos obligatorios');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const sizeNum = parseFloat(newSize) || 100;

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: newTitle,
      type: newType,
      dealType: newDeal,
      price: priceNum,
      location: newLocation,
      sizeSqM: sizeNum,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80',
      description: newDesc || 'Sin descripción adicional.',
      featured: false,
      coordinates: '7.8000° N, 76.6000° W'
    };

    setProperties(prev => [newProp, ...prev]);
    setShowAddForm(false);
    triggerNotification('Propiedad Publicada', `Se registró exitosamente: ${newTitle} (${newDeal.toUpperCase()})`, 'system');

    // Clear form
    setNewTitle('');
    setNewPrice('');
    setNewLocation('');
    setNewSize('');
    setNewDesc('');
  };

  const handleSendLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactingProperty) return;

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      propertyTitle: contactingProperty.title,
      clientName,
      clientEmail,
      clientPhone,
      message: clientMessage,
      status: 'nuevo',
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    setContactingProperty(null);
    triggerNotification('Contacto Recibido', 'Tu solicitud ha sido enviada al CRM del gestor inmobiliario.', 'booking');
    alert('✔ Mensaje enviado con éxito. El agente inmobiliario se comunicará contiguo en breve.');

    // Clear
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setClientMessage('');
  };

  const handleDeleteProperty = (id: string) => {
    if (confirm('¿Desea dar de baja esta publicación?')) {
      setProperties(prev => prev.filter(p => p.id !== id));
      triggerNotification('Propiedad Removida', 'Publicación eliminada correctamente.', 'system');
    }
  };

  const changeLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
  };

  const filteredProperties = properties.filter(p => {
    const dMatch = dealFilter === 'todos' || p.dealType === dealFilter;
    const tMatch = typeFilter === 'todos' || p.type === typeFilter;
    return dMatch && tMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm border border-indigo-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest font-mono">
            Ecosistema de Inmuebles
          </span>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">Sinergia Real Estate & Inmobiliaria</h2>
          <p className="text-xs text-slate-300 mt-1">Venta, arriendo y corretaje con CRM integrado y tours 360° en Urabá</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'lista' ? 'bg-white text-indigo-950' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🏢 Portafolio
          </button>
          <button
            onClick={() => setActiveTab('servicios')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'servicios' ? 'bg-white text-indigo-950' : 'bg-white/10 hover:bg-white/15'}`}
          >
            💼 Servicios
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'crm' ? 'bg-white text-indigo-950' : 'bg-white/10 hover:bg-white/15'}`}
          >
            👥 CRM Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('virtual360')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'virtual360' ? 'bg-white text-indigo-950' : 'bg-white/10 hover:bg-white/15'}`}
          >
            🧭 Tour 360°
          </button>
        </div>
      </div>

      {/* VIEW: SERVICES SECTION */}
      {activeTab === 'servicios' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Corretaje Profesional', desc: 'Acompañamiento integral en compra, venta y arrendamientos comerciales.', fee: '3% de comisión en venta', color: 'border-amber-200 bg-amber-50/50' },
              { title: 'Avalúos Certificados', desc: 'Estudio pericial comercial y técnico del valor real de tierras bananeras.', fee: '$120 USD por avalúo', color: 'border-pink-200 bg-pink-50/50' },
              { title: 'Administración', desc: 'Gestión total de propiedades en renta: cobros, mantenimiento preventivo.', fee: '8% mensual del canon', color: 'border-emerald-200 bg-emerald-50/50' },
              { title: 'Estudios de Mercado', desc: 'Análisis de plusvalía y proyecciones de desarrollo urbano de Urabá.', fee: 'Consultas personalizadas', color: 'border-indigo-200 bg-indigo-50/50' }
            ].map((srv, i) => (
              <div key={i} className={`p-5 rounded-2xl border ${srv.color} flex flex-col justify-between h-44`}>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{srv.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">{srv.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase">{srv.fee}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-indigo-900 text-white rounded-2xl">
            <h3 className="font-bold text-base">Beneficios Premium de Publicación</h3>
            <ul className="grid grid-cols-2 gap-3 mt-4 text-xs text-slate-200 font-sans leading-relaxed">
              <li className="flex items-center gap-2">✔ Publicación ilimitada en la vitrina regional</li>
              <li className="flex items-center gap-2">✔ Geolocalización automática de polígonos</li>
              <li className="flex items-center gap-2">✔ Galería interactiva con carga rápida</li>
              <li className="flex items-center gap-2">✔ Enlace directo a tu WhatsApp de agente</li>
            </ul>
          </div>
        </div>
      )}

      {/* VIEW: LIST OF PORTFOLIO */}
      {activeTab === 'lista' && (
        <div id="property-portfolio-view" className="space-y-6">
          {isGuest && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2.5 shadow-xs">
              <span className="text-base select-none">⚠️</span>
              <div className="space-y-1">
                <p className="font-extrabold uppercase tracking-wide text-[10px] text-amber-900">Modo de Navegación: Invitado</p>
                <p className="leading-relaxed">Actualmente estás explorando Sinergia Connect como <strong>Invitado (Sin Conexión)</strong>. <strong>No tienes permitido publicar ni registrar anuncios</strong> en ninguno de los sectores. Por favor inicia sesión o crea una cuenta desde la pestaña <strong>"Sesión & Registro"</strong> para activar estas funcionalidades.</p>
              </div>
            </div>
          )}

          {/* Controls bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-1.5 flex-wrap">
              <button 
                onClick={() => setDealFilter('todos')} 
                className={`px-3 py-1 text-xs rounded-lg font-bold border ${dealFilter === 'todos' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650'}`}
              >
                Todos
              </button>
              <button 
                onClick={() => setDealFilter('venta')} 
                className={`px-3 py-1 text-xs rounded-lg font-bold border ${dealFilter === 'venta' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650'}`}
              >
                Venta
              </button>
              <button 
                onClick={() => setDealFilter('arriendo')} 
                className={`px-3 py-1 text-xs rounded-lg font-bold border ${dealFilter === 'arriendo' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-650'}`}
              >
                Arriendo
              </button>
 
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold px-2 py-1 text-slate-600 outline-none"
              >
                <option value="todos">Todos los Tipos</option>
                <option value="casa">Casas</option>
                <option value="apartamento">Apartamentos</option>
                <option value="lote">Lotes</option>
                <option value="finca">Fincas</option>
                <option value="bodega">Bodegas</option>
                <option value="local">Locales Comerciales</option>
              </select>
            </div>
 
            <button
              onClick={() => {
                if (isGuest) {
                  alert('🚫 Operación No Permitida: Como usuario Invitado no puedes publicar activos en los sectores. Por favor ve a la pestaña "Sesión & Registro" para registrarte o iniciar sesión.');
                } else {
                  setShowAddForm(!showAddForm);
                }
              }}
              className={`px-3 py-1.5 text-xs font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer select-none border transition-all ${
                isGuest 
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70' 
                  : 'bg-indigo-600 border-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4" /> Registrar Propiedad
            </button>
          </div>

          {/* Form wrapper */}
          {showAddForm && (
            <form onSubmit={handleAddProperty} className="bg-white p-5 rounded-xl border border-slate-250 shadow-sm space-y-4 max-w-lg">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase">Publicación de Propiedad</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Título Recuadro</label>
                  <input
                    type="text"
                    required
                    placeholder="Casa Campestre Carepa Verde"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Dirección / Sector</label>
                  <input
                    type="text"
                    required
                    placeholder="Chigorodó - Calle 4"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Tipo de Trato</label>
                  <select
                    value={newDeal}
                    onChange={(e) => setNewDeal(e.target.value as Property['dealType'])}
                    className="w-full border border-slate-200 p-2 rounded text-xs bg-white text-slate-750"
                  >
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Tipo de Inmueble</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Property['type'])}
                    className="w-full border border-slate-200 p-2 rounded text-xs bg-white text-slate-750"
                  >
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="lote">Lote</option>
                    <option value="finca">Finca</option>
                    <option value="bodega">Bodega</option>
                    <option value="local">Local Comercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Precio (USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="45000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Área (Mts²)</label>
                  <input
                    type="number"
                    placeholder="250"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Descripción Breve</label>
                <textarea
                  placeholder="Escriba aquí los detalles..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded text-xs h-14 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded text-xs font-black uppercase tracking-wider"
              >
                ✔ Registrar Publicación
              </button>
            </form>
          )}

          {/* Grid properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProperties.map(prop => (
              <div 
                key={prop.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row shadow-xs hover:shadow-md hover:border-indigo-300 transition-all"
              >
                {/* Visual */}
                <div className="md:w-44 h-48 md:h-full relative bg-slate-100 flex-shrink-0">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5 shadow-sm">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase text-white ${prop.dealType === 'venta' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                      {prop.dealType.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-black uppercase font-mono">
                      {prop.type.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{prop.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-0.5 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      {prop.location}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-2 leading-snug line-clamp-2">
                      {prop.description}
                    </p>

                    <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px] font-mono font-medium text-slate-500 pb-3 border-b border-rose-50">
                      <div>📐 <strong>{prop.sizeSqM}</strong> Mts²</div>
                      {prop.rooms && <div>🛏 <strong>{prop.rooms}</strong> alcobas</div>}
                      {prop.bathrooms && <div>🚿 <strong>{prop.bathrooms}</strong> baños</div>}
                    </div>
                  </div>

                  <div className="pt-3 flex justify-between items-center mt-3">
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase leading-tight">Valor de Operación</span>
                      <strong className="text-sm font-black font-mono text-rose-600 leading-tight">
                        ${prop.price.toLocaleString()} USD
                      </strong>
                    </div>

                    <div className="flex gap-2.5">
                      {!isGuest && (
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:text-rose-800 rounded transition-colors"
                          title="Eliminar publicación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setContactingProperty(prop)}
                        className="px-3 py-1 bg-indigo-650 hover:bg-slate-900 border border-transparent text-white rounded text-[10.5px] font-bold transition-all uppercase tracking-wider"
                      >
                        Contactar Agente ✉
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: 360 TOUR SIMULATORS */}
      {activeTab === 'virtual360' && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-black uppercase text-amber-400">🧭 Simulador de Recorridos 360°</h3>
              <p className="text-xs text-slate-400 mt-1">Interacción virtual de alta fidelidad desde tu Sandbox Sinergia</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Renderizado 3D Completo</span>
          </div>

          <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex flex-col justify-between p-4 group">
            {/* The Panorama Mockup Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-all duration-300" 
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80")',
                transform: `scale(1.2) rotate(${tourDeg / 15}deg)`
              }}
            ></div>

            <div className="absolute inset-0 bg-slate-950/40 pointer-events-none"></div>

            {/* Header elements overlay */}
            <div className="relative flex justify-between text-xs z-10 w-full select-none">
              <span className="bg-slate-900/80 p-2 border border-slate-800 rounded-lg backdrop-blur-md">
                🏠 Apartamento Premium Duplex Ortiz
              </span>
              <span className="bg-indigo-600 p-2 rounded-lg font-black uppercase text-[10px]">
                Tour Activo (Giro: {tourDeg}°)
              </span>
            </div>

            {/* Compass tracer control */}
            <div className="relative z-10 mx-auto flex flex-col items-center gap-2 max-w-sm bg-slate-900/90 border border-slate-750 p-3 rounded-2xl backdrop-blur-xs text-center select-none">
              <p className="text-[11px] text-slate-300 font-bold">Manten presionado o arrastra para rotar la cámara 360°</p>
              <div className="flex gap-1">
                <button 
                  onClick={() => setTourDeg(prev => (prev - 30 + 360) % 360)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-extrabold rounded-lg uppercase"
                >
                  ◀ Izquierda
                </button>
                <button 
                  onClick={() => setTourDeg(0)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg uppercase"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setTourDeg(prev => (prev + 30) % 360)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-amber-400 font-extrabold rounded-lg uppercase"
                >
                  Derecha ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CRM LEADS LIST */}
      {activeTab === 'crm' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase flex items-center gap-1">
              <Users className="w-4.5 h-4.5 text-indigo-650" />
              CRM Inmobiliario de Captación de Clientes (Leads)
            </h3>
            <p className="text-xs text-slate-450 leading-relaxed mt-1">Saca provecho del embudo de ventas para contactar clientes potenciales interesados en tus listados.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map(lead => (
              <div key={lead.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase">
                      📋 Interesado en: {lead.propertyTitle}
                    </span>
                    <select
                      value={lead.status}
                      onChange={(e) => changeLeadStatus(lead.id, e.target.value as Lead['status'])}
                      className="bg-slate-50 border border-slate-200 rounded text-[9px] font-bold uppercase p-1"
                    >
                      <option value="nuevo">Nuevo</option>
                      <option value="contactado">Contactado</option>
                      <option value="negociando">Negociando</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  </div>
                  <div className="pt-2 text-xs text-slate-700 space-y-1">
                    <p>👦 Cliente: <strong>{lead.clientName}</strong></p>
                    <p>✉ Correo: <span className="font-mono text-slate-500 font-semibold">{lead.clientEmail}</span></p>
                    <p>📞 Teléfono: <span className="font-mono text-slate-500 font-semibold">{lead.clientPhone}</span></p>
                    <blockquote className="mt-3 p-2.5 bg-slate-50 rounded border-l-2 border-indigo-400 text-[11px] text-slate-500 leading-normal">
                      "{lead.message}"
                    </blockquote>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-450">
                  <span>Recibido: {new Date(lead.createdAt).toLocaleDateString()}</span>
                  <a 
                    href={`https://wa.me/${lead.clientPhone.replace(/\s+/g, '')}`} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="px-2.5 py-1 bg-emerald-500 text-slate-950 rounded font-black uppercase text-[9px]"
                  >
                    Contestar WhatsApp 📞
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEAD CONTACT MODAL OVERLAY */}
      {contactingProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleSendLead} 
            className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-slate-200 space-y-4 text-xs"
          >
            <button
              type="button"
              onClick={() => setContactingProperty(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              ✕
            </button>

            <div>
              <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">Formulario de Contacto</span>
              <h3 className="font-extrabold text-slate-900 text-sm mt-1">Campaña Captación: {contactingProperty.title}</h3>
              <p className="text-[11px] text-slate-450 mt-0.5">La solicitud se guardará dinámicamente en el módulo CRM del Inquilino.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Valeria Restrepo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Correo Enlace</label>
                  <input
                    type="email"
                    required
                    placeholder="valeria@correo.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Teléfono Whatsapp</label>
                  <input
                    type="text"
                    required
                    placeholder="+57 325 000 0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Escribe tu propuesta o duda</label>
                <textarea
                  required
                  placeholder="Hola! Me interesa agendar una cita para ver los linderos el Sábado..."
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded text-xs h-16 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded font-bold uppercase tracking-wider text-[10px] mt-4"
            >
              📨 Enviar Solicitud Comercial de Compra
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
