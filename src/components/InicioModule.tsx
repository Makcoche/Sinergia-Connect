import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  ShoppingCart, 
  Compass, 
  Truck, 
  Briefcase, 
  Star, 
  FileText, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Heart,
  Calendar,
  Utensils,
  Home,
  Music,
  Phone,
  CheckCircle2,
  Users,
  ChevronDown
} from 'lucide-react';
import { Company, Product, HotelRoom, TourPackage, ProfessionalService } from '../types';

interface SearchResult {
  id: string;
  category: 'empresas' | 'comercio' | 'hoteles' | 'turismo' | 'servicios' | 'gastronomia' | 'inmobiliaria' | 'eventos' | 'empleos';
  title: string;
  subtitle: string;
  imageOrEmoji: string;
  badge?: string;
  price?: number;
  rating?: number;
}

// Additional search-only items for comprehensive directories (to satisfy physical category requirements)
const EXTRA_SEARCH_ITEMS: SearchResult[] = [
  // Gastronomía
  { id: 'gast-1', category: 'gastronomia', title: 'Restaurante Sabor de Urabá', subtitle: 'Pescados, mariscos y cazuelas costeñas tradicionales', imageOrEmoji: '🐟', badge: 'Restaurante', rating: 4.8 },
  { id: 'gast-2', category: 'gastronomia', title: 'Carbonera Grill & Carnes', subtitle: 'Fina selección de carnes a la parrilla y comidas rápidas', imageOrEmoji: '🥩', badge: 'Comidas Rápidas', rating: 4.5 },
  { id: 'gast-3', category: 'gastronomia', title: 'Café Coffee BreakCarepa', subtitle: 'Cafetería de especialidad con granos de origen Antioquia', imageOrEmoji: '☕', badge: 'Cafetería', rating: 4.9 },
  { id: 'gast-4', category: 'gastronomia', title: 'Repostería Dulce Tentación', subtitle: 'Postres personalizados, repostería fina y panadería artesanal', imageOrEmoji: '🍰', badge: 'Repostería', rating: 4.7 },
  
  // Inmobiliaria
  { id: 'inmob-1', category: 'inmobiliaria', title: 'Apartamento Duplex Bocagrande', subtitle: 'Alquiler temporario con vista al mar y piscina', imageOrEmoji: '🏢', badge: 'Apartamentos', price: 180 },
  { id: 'inmob-2', category: 'inmobiliaria', title: 'Finca Bananera en Carepa', subtitle: 'Lote productivo de 12 hectáreas con infraestructura', imageOrEmoji: '🏡', badge: 'Fincas', price: 12500 },
  { id: 'inmob-3', category: 'inmobiliaria', title: 'Bodega Logística Industrial', subtitle: 'Excelente ubicación con muelles de carga refrigerados', imageOrEmoji: '🏬', badge: 'Bodegas', price: 3400 },
  
  // Eventos
  { id: 'event-1', category: 'eventos', title: 'Sonido Profesional Line Array', subtitle: 'Alquiler de equipos de sonido de alta fidelidad y tarimas', imageOrEmoji: '🔊', badge: 'Equipos/Tarimas', price: 450 },
  { id: 'event-2', category: 'eventos', title: 'Show Trío Vallenato en Vivo', subtitle: 'Contratación directa de artistas locales para recepciones', imageOrEmoji: '🪗', badge: 'Artistas', price: 300 },
  { id: 'event-3', category: 'eventos', title: 'Producción Audiovisual Multicam', subtitle: 'Grabación y streaming en vivo para eventos empresariales', imageOrEmoji: '📹', badge: 'Audiovisual', price: 250 },

  // Empleos
  { id: 'emp-1', category: 'empleos', title: 'Vacante: Chef de Cocina Especial', subtitle: 'Hotel Palacio Real está contratando chef ejecutivo', imageOrEmoji: '👨‍🍳', badge: 'Gastronomía', price: 1200 },
  { id: 'emp-2', category: 'empleos', title: 'Vacante: Conductor Carga Pesada', subtitle: 'Sinergia Cargo busca conductores licenciados C3', imageOrEmoji: '🚛', badge: 'Transporte', price: 850 }
];

interface InicioProps {
  companies: Company[];
  products: Product[];
  rooms: HotelRoom[];
  tours: TourPackage[];
  professionals: ProfessionalService[];
  onNavigateTab: (tab: any) => void;
  onAddToFavorites?: (item: any) => void;
  favorites?: string[];
}

export default function InicioModule({
  companies,
  products,
  rooms,
  tours,
  professionals,
  onNavigateTab,
  onAddToFavorites,
  favorites = []
}: InicioProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [selectedFeedSector, setSelectedFeedSector] = useState<string>('todos');
  const [isFeedDropdownOpen, setIsFeedDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFeedDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Unified global searching compilation
  const getUnifiedItems = (): SearchResult[] => {
    const items: SearchResult[] = [];

    // Companies
    companies.forEach(c => {
      items.push({
        id: c.id,
        category: 'empresas',
        title: c.name,
        subtitle: `Inquilino SaaS de tipo ${c.type}. Enlace: ${c.phone}`,
        imageOrEmoji: c.logo || '🏢',
        rating: c.rating,
        badge: c.type.toUpperCase()
      });
    });

    // Products
    products.forEach(p => {
      items.push({
        id: p.id,
        category: 'comercio',
        title: p.name,
        subtitle: p.description,
        imageOrEmoji: p.image || '🛒',
        price: p.price,
        rating: p.rating,
        badge: p.category
      });
    });

    // Hotel Rooms
    rooms.forEach(r => {
      items.push({
        id: r.id,
        category: 'hoteles',
        title: `${r.hotelName} - ${r.name}`,
        subtitle: `Hospedaje de lujo. Capacidad: ${r.capacityMax} personas. ${r.location}`,
        imageOrEmoji: r.image || '🏨',
        price: r.pricePerNight,
        rating: r.rating,
        badge: r.type.toUpperCase()
      });
    });

    // Tours
    tours.forEach(t => {
      items.push({
        id: t.id,
        category: 'turismo',
        title: t.title,
        subtitle: t.description,
        imageOrEmoji: t.image || '🏔️',
        price: t.pricePerPerson,
        rating: t.rating,
        badge: t.destination
      });
    });

    // Professionals
    professionals.forEach(prof => {
      items.push({
        id: prof.id,
        category: 'servicios',
        title: prof.name,
        subtitle: `Profesional en: ${prof.profession}. ${prof.bio}`,
        imageOrEmoji: prof.avatar || '💼',
        price: prof.hourlyRate,
        rating: prof.rating,
        badge: prof.profession.toUpperCase()
      });
    });

    // Add extra categories (Gastronomía, Inmobiliaria, Eventos, Empleos)
    items.push(...EXTRA_SEARCH_ITEMS);

    return items;
  };

  const allItems = getUnifiedItems();

  interface PublicationItem {
    id: string;
    title: string;
    description: string;
    price?: number;
    priceSuffix?: string;
    sector: string;
    sectorLabel: string;
    badgeColor: string;
    image: string;
    offerBadge: string;
    tabTarget: string;
    location?: string;
  }

  const getPublications = (): PublicationItem[] => {
    const pubList: PublicationItem[] = [];

    // 1. Inmobiliaria from hardcoded database
    pubList.push(
      {
        id: 'pub-inmob-1',
        title: 'Apartamento Duplex Bocagrande',
        description: 'Exclusivo duplex amoblado con balcón panorámico directo al mar, aire acondicionado central, cocina equipada y piscina infinita.',
        price: 180,
        priceSuffix: '/ noche',
        sector: 'inmobiliaria',
        sectorLabel: 'Inmobiliaria',
        badgeColor: 'bg-indigo-50 border-indigo-150 text-indigo-700',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
        offerBadge: '⚡ Tour Virtual 360°',
        tabTarget: 'inmobiliaria',
        location: 'Apartamentos'
      },
      {
        id: 'pub-inmob-2',
        title: 'Finca Bananera Carepa',
        description: 'Lote productivo de 12 hectáreas de suelo óptimo con sistema de riego tecnificado e infraestructura completa de empaque.',
        price: 12500,
        priceSuffix: '/ mes',
        sector: 'inmobiliaria',
        sectorLabel: 'Inmobiliaria',
        badgeColor: 'bg-indigo-50 border-indigo-150 text-indigo-700',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80',
        offerBadge: '🔥 10% Off 1er Año',
        tabTarget: 'inmobiliaria',
        location: 'Fincas'
      },
      {
        id: 'pub-inmob-3',
        title: 'Bodega Logística Industrial',
        description: 'Instalaciones industriales robustas con muelles para tractomulas y cuartos refrigerados de alta densidad.',
        price: 3400,
        priceSuffix: '/ mes',
        sector: 'inmobiliaria',
        sectorLabel: 'Inmobiliaria',
        badgeColor: 'bg-indigo-50 border-indigo-150 text-indigo-700',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
        offerBadge: '✨ Asesoría Logística',
        tabTarget: 'inmobiliaria',
        location: 'Bodegas'
      }
    );

    // 2. Gastronomía from hardcoded database
    pubList.push(
      {
        id: 'pub-gast-1',
        title: 'Cazuela de Mariscos Caribeña',
        description: 'Auténtica cazuela preparada con mariscos seleccionados del Golfo de Urabá, crema de coco y finas hierbas.',
        price: 22.50,
        priceSuffix: '',
        sector: 'gastronomia',
        sectorLabel: 'Gastronomía',
        badgeColor: 'bg-red-50 border-red-150 text-red-700',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
        offerBadge: '🍹 Trago de Bienvenida',
        tabTarget: 'gastronomia',
        location: 'Sabor de Urabá'
      },
      {
        id: 'pub-gast-2',
        title: 'Hamburguesa Sinergia Parrillera',
        description: 'Carne madurada seleccionada de res asada al carbón con tiras de tocineta crocante y vegetales de huertas locales.',
        price: 14.99,
        priceSuffix: '',
        sector: 'gastronomia',
        sectorLabel: 'Gastronomía',
        badgeColor: 'bg-red-50 border-red-150 text-red-700',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        offerBadge: '🍟 Papas Rústicas Gratis',
        tabTarget: 'gastronomia',
        location: 'Carbonera Grill'
      },
      {
        id: 'pub-gast-3',
        title: 'Pargo Rojo Frito con Patacón',
        description: 'Pargo rojo recién pescado y sazonado, acompañado por patacones crocantes fritos dos veces y arroz con coco.',
        price: 19.00,
        priceSuffix: '',
        sector: 'gastronomia',
        sectorLabel: 'Gastronomía',
        badgeColor: 'bg-red-50 border-red-150 text-red-700',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&auto=format&fit=crop&q=80',
        offerBadge: '🍋 Limonada de Cortesía',
        tabTarget: 'gastronomia',
        location: 'Restaurante Sabor'
      }
    );

    // 3. Comercio Products from database inputs
    products.forEach(p => {
      pubList.push({
        id: `pub-com-${p.id}`,
        title: p.name,
        description: p.description,
        price: p.price,
        priceSuffix: '',
        sector: 'comercio',
        sectorLabel: 'Comercio',
        badgeColor: 'bg-pink-50 border-pink-150 text-pink-700',
        image: p.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
        offerBadge: p.stock < 5 ? '🔥 Últimas Unidades' : '⚡ Descuento SNG Pay',
        tabTarget: 'marketplace',
        location: p.category
      });
    });

    // 4. Hoteles (rooms on offer)
    rooms.forEach(r => {
      pubList.push({
        id: `pub-hot-${r.id}`,
        title: `${r.hotelName} - ${r.name}`,
        description: `Disfruta de una confortable habitación de lujo. Capacidad máxima: ${r.capacityMax} personas en ${r.location}.`,
        price: r.pricePerNight,
        priceSuffix: '/ noche',
        sector: 'hoteles',
        sectorLabel: 'Hotelería',
        badgeColor: 'bg-sky-50 border-sky-150 text-sky-700',
        image: r.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=80',
        offerBadge: '🌅 Desayuno Campestre',
        tabTarget: 'hotels',
        location: r.location
      });
    });

    // 5. Turismo (Tours on offer)
    tours.forEach(t => {
      pubList.push({
        id: `pub-tour-${t.id}`,
        title: t.title,
        description: t.description,
        price: t.pricePerPerson,
        priceSuffix: '/ pers',
        sector: 'turismo',
        sectorLabel: 'Turismo',
        badgeColor: 'bg-amber-50 border-amber-150 text-amber-700',
        image: t.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&auto=format&fit=crop&q=80',
        offerBadge: '🏔️ Guía Regional Certificado',
        tabTarget: 'tours',
        location: t.destination
      });
    });

    // 6. Servicios profesionales (Expertos)
    professionals.forEach(prof => {
      pubList.push({
        id: `pub-prof-${prof.id}`,
        title: prof.name,
        description: `Servicio profesional certificado: ${prof.profession}. ${prof.bio}`,
        price: prof.hourlyRate,
        priceSuffix: '/ hora',
        sector: 'servicios',
        sectorLabel: 'Expertos',
        badgeColor: 'bg-purple-50 border-purple-150 text-purple-700',
        image: prof.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        offerBadge: '💼 1ra Consulta Sin Costo',
        tabTarget: 'professionals',
        location: prof.profession
      });
    });

    // 7. Eventos & Alquileres
    pubList.push(
      {
        id: 'pub-event-1',
        title: 'Sonido Profesional Line Array',
        description: 'Alquiler de sistemas de sonido de última generación, ideales para recitales al aire libre y foros corporativos.',
        price: 450,
        priceSuffix: '/ día',
        sector: 'eventos',
        sectorLabel: 'Eventos',
        badgeColor: 'bg-violet-50 border-violet-150 text-violet-750',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80',
        offerBadge: '🔊 Montaje y Ecualización',
        tabTarget: 'eventos',
        location: 'Equipos'
      },
      {
        id: 'pub-event-2',
        title: 'Show Trío Vallenato en Vivo',
        description: 'Contratación de talentosos acordeonista, cantante y cajero locales para ambientar tus fiestas familiares y eventos.',
        price: 300,
        priceSuffix: '/ show',
        sector: 'eventos',
        sectorLabel: 'Eventos',
        badgeColor: 'bg-violet-50 border-violet-150 text-violet-750',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
        offerBadge: '🪗 30 min Adicionales',
        tabTarget: 'eventos',
        location: 'Artistas'
      }
    );

    return pubList;
  };

  const publications = getPublications();

  const filteredPublications = publications.filter(pub => {
    if (selectedFeedSector === 'todos') return true;
    return pub.sector === selectedFeedSector;
  });

  const filteredResults = allItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (activeFilter === 'todos') return matchesSearch;
    return matchesSearch && item.category === activeFilter;
  });

  const handleResultClick = (item: SearchResult) => {
    // Navigate tab based on search category
    if (item.category === 'comercio') onNavigateTab('marketplace');
    else if (item.category === 'empresas') onNavigateTab('empresas');
    else if (item.category === 'hoteles') onNavigateTab('hotels');
    else if (item.category === 'turismo') onNavigateTab('tours');
    else if (item.category === 'servicios') onNavigateTab('professionals');
    else if (item.category === 'gastronomia') onNavigateTab('gastronomia'); // maps directly to gastronomia
    else if (item.category === 'inmobiliaria') onNavigateTab('inmobiliaria'); // maps directly to inmobiliaria
    else if (item.category === 'eventos') onNavigateTab('eventos');
    else if (item.category === 'empleos') onNavigateTab('professionals');
  };

  // Predefined service category metrics of Sinergia Connect
  const CATEGORIES = [
    { key: 'comercio', label: 'Comercio', icon: <ShoppingCart className="w-5 h-5" />, color: 'bg-pink-50 text-pink-600 border-pink-100', tab: 'marketplace', desc: 'Productos, Promociones y Ofertas' },
    { key: 'transporte', label: 'Transporte', icon: <Truck className="w-5 h-5" />, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', tab: 'logistics', desc: 'Carga, Mudanzas y Refrigerados' },
    { key: 'turismo', label: 'Turismo', icon: <Compass className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600 border-amber-100', tab: 'tours', desc: 'Tours, Experiencias y Guías' },
    { key: 'hoteles', label: 'Hotelería', icon: <Building2 className="w-5 h-5" />, color: 'bg-sky-50 text-sky-600 border-sky-100', tab: 'hotels', desc: 'Hoteles, Hostales y Fincas' },
    { key: 'gastronomia', label: 'Gastronomía', icon: <Utensils className="w-5 h-5" />, color: 'bg-red-50 text-red-650 border-red-100', tab: 'gastronomia', desc: 'Restaurantes, Cafeterías y Comidas' },
    { key: 'servicios', label: 'Servicios Profesionales', icon: <Briefcase className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600 border-purple-100', tab: 'professionals', desc: 'Abogados, Contadores e Ingenieros' },
    { key: 'inmobiliaria', label: 'Inmobiliaria', icon: <Home className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', tab: 'inmobiliaria', desc: 'Casas, Apartamentos y Lotes' },
    { key: 'eventos', label: 'Eventos', icon: <Music className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600 border-violet-100', tab: 'eventos', desc: 'Artistas, Sonido, Tarimas y Eventos' },
    { key: 'empresas', label: 'Directorio', icon: <Users className="w-5 h-5" />, color: 'bg-teal-50 text-teal-600 border-teal-100', tab: 'directorio', desc: 'Empresas Registradas Calificadas' }
  ];

  return (
    <div id="inicio-module" className="space-y-8 animate-fade-in">
      
      {/* 1. HERO INTEGRADO INTELIGENTE */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-indigo-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 text-emerald-300 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Portal Regional Inteligente Urabá
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Todo el Ecosistema Comercial <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">
              Integrado en un Solo Sitio
            </span>
          </h1>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-sans font-medium">
            Sinergia Connect fusiona marketplace, directorio empresarial, central de reservas hoteleras, operadores eco-turísticos y logística de carga pesada regional en una plataforma omnicanal de marca blanca unificada.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('onboarding')}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              Registro Único de Cuentas 🔑
            </button>
            <button
              onClick={() => onNavigateTab('directorio')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              Explorar Directorio 🏢
            </button>
          </div>
        </div>
      </div>

      {/* 2. BUSCADOR GLOBAL INTERACTIVO */}
      <div className="bg-white p-6 rounded-2xl border border-slate-250 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
            <Search className="w-4 h-4 text-indigo-600" />
            Buscador Global Inteligente
          </h2>
          <p className="text-xs text-slate-500 font-sans leading-relaxed mt-1">
            Realiza una consulta en tiempo real sobre cualquier empresa, producto, habitación de hotel, tour, auto de transporte, restaurantes, empleos o eventos en Urabá.
          </p>
        </div>

        {/* Search Input block */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="🔎 Escribe algo para buscar... (ej: laptop, hotel, tour, furgón, abogado, postre, tarima, bodegas)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-550/20 text-slate-800 font-semibold"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Global Filter Buttons */}
        <div className="flex flex-wrap gap-1.5 pt-1.5 select-none">
          <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">Filtrar:</span>
          {([
            { key: 'todos', label: 'Todos' },
            { key: 'empresas', label: '🏢 Empresas' },
            { key: 'comercio', label: '🛍️ Productos' },
            { key: 'hoteles', label: '🏨 Hoteles' },
            { key: 'turismo', label: '🏔️ Tours' },
            { key: 'servicios', label: '💼 Expertos/Abogados' },
            { key: 'gastronomia', label: '🍽️ Gastronomía' },
            { key: 'inmobiliaria', label: '🏡 Inmuebles' },
            { key: 'eventos', label: '🪗 Eventos' },
            { key: 'empleos', label: '💼 Empleos' }
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                activeFilter === f.key
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Result grid */}
        {searchQuery && (
          <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-xl space-y-3 max-h-[350px] overflow-y-auto animate-fade-in">
            <p className="text-[11px] text-slate-500 font-bold">
              🔎 Encontrados {filteredResults.length} resultados para "{searchQuery}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredResults.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex gap-3 items-start group"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {item.imageOrEmoji.startsWith('http') ? (
                      <img 
                        src={item.imageOrEmoji} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-2xl">{item.imageOrEmoji}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[8.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {item.category}
                      </span>
                      {item.price && (
                        <span className="text-[11px] font-bold text-rose-600 font-mono">
                          ${item.price.toFixed(2)} USD
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-800 text-xs mt-1.5 group-hover:text-indigo-600 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-440 mt-0.5 truncate leading-normal">
                      {item.subtitle}
                    </p>

                    <div className="mt-2 text-[10px] flex items-center gap-1.5 text-slate-450">
                      {item.rating && (
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <strong>{item.rating.toFixed(1)}</strong>
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-slate-500 font-semibold">{item.badge}</span>
                    </div>
                  </div>
                </div>
              ))}

              {filteredResults.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-slate-405">
                  Ningún elemento coincide con tus criterios en este momento.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. MURO REGIONAL DE PUBLICACIONES & OFERTAS */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              📢 Muro de Publicaciones & Ofertas de la Región
            </h2>
            <p className="text-xs text-slate-450 mt-1 leading-snug">
              Explora los anuncios vigentes, arriendos, fletes, platos, tours y promociones destacadas de todos los sectores activos en Urabá.
            </p>
          </div>

          {/* Sector Selector - Menú Desplegable */}
          <div className="relative min-w-[240px] text-xs select-none" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsFeedDropdownOpen(!isFeedDropdownOpen)}
              className="w-full flex items-center justify-between gap-2.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/15 font-black cursor-pointer shadow-xs uppercase tracking-wider text-[11px] transition-all text-left"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="text-sm">
                  {(() => {
                    const icons: Record<string, string> = {
                      todos: '🌟',
                      inmobiliaria: '🏠',
                      gastronomia: '🍔',
                      comercio: '🛍️',
                      hoteles: '🏨',
                      turismo: '🏔️',
                      servicios: '💼',
                      eventos: '🪗'
                    };
                    return icons[selectedFeedSector] || '🌟';
                  })()}
                </span>
                <span className="truncate">
                  {(() => {
                    const labels: Record<string, string> = {
                      todos: 'Todos los Sectores',
                      inmobiliaria: 'Inmuebles (Inmobiliaria)',
                      gastronomia: 'Gastronomía (Comidas)',
                      comercio: 'Comercio (Productos)',
                      hoteles: 'Hotelería (Alojamiento)',
                      turismo: 'Turismo (Experiencias)',
                      servicios: 'Expertos (Servicios)',
                      eventos: 'Eventos (Show/Equipos)'
                    };
                    return labels[selectedFeedSector] || 'Todos los Sectores';
                  })()}
                </span>
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-250 ${isFeedDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFeedDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1.5 focus:outline-none">
                <div className="max-h-64 overflow-y-auto">
                  {([
                    { key: 'todos', label: 'Todos los Sectores', icon: '🌟' },
                    { key: 'inmobiliaria', label: 'Inmuebles (Inmobiliaria)', icon: '🏠' },
                    { key: 'gastronomia', label: 'Gastronomía (Comidas)', icon: '🍔' },
                    { key: 'comercio', label: 'Comercio (Productos)', icon: '🛍️' },
                    { key: 'hoteles', label: 'Hotelería (Alojamiento)', icon: '🏨' },
                    { key: 'turismo', label: 'Turismo (Experiencias)', icon: '🏔️' },
                    { key: 'servicios', label: 'Expertos (Servicios)', icon: '💼' },
                    { key: 'eventos', label: 'Eventos (Show/Equipos)', icon: '🪗' }
                  ] as const).map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setSelectedFeedSector(opt.key);
                        setIsFeedDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-50 cursor-pointer ${
                        selectedFeedSector === opt.key 
                          ? 'bg-indigo-50/70 text-indigo-700' 
                          : 'text-slate-600'
                      }`}
                    >
                      <span className="text-sm select-none">{opt.icon}</span>
                      <span className="truncate">{opt.label}</span>
                      {selectedFeedSector === opt.key && (
                        <span className="ml-auto text-indigo-600 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map(pub => {
            // Label mapping
            const actionTexts: Record<string, string> = {
              inmobiliaria: 'Ver en Inmobiliaria 🏠',
              gastronomia: 'Pedir en Gastronomía 🍔',
              comercio: 'Comprar en Tienda 🛍️',
              hoteles: 'Reservar Estadía 🏨',
              turismo: 'Reservar Tour 🏔️',
              servicios: 'Contratar Experto 💼',
              eventos: 'Reservar Show/Equipo 🪗'
            };

            return (
              <div 
                key={pub.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-350 transition-all flex flex-col justify-between group"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img 
                    src={pub.image} 
                    alt={pub.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-extrabold uppercase border ${pub.badgeColor}`}>
                      {pub.sectorLabel}
                    </span>
                    {pub.location && (
                      <span className="bg-slate-900/75 text-white/90 text-[8.5px] px-1.5 py-0.5 rounded backdrop-blur-xs">
                        📍 {pub.location}
                      </span>
                    )}
                  </div>

                  {/* Promotion Overlay Banner */}
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-emerald-500 text-slate-950 font-black tracking-wide text-[9px] uppercase px-2 py-1 rounded-md shadow-sm">
                      {pub.offerBadge}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed line-clamp-2">
                      {pub.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    {pub.price && (
                      <div>
                        <span className="text-[11px] font-bold text-slate-700">Precio</span>
                        <div className="text-xs font-black text-rose-600 font-mono">
                          ${pub.price.toFixed(2)} USD<span className="text-[9px] text-slate-400 font-normal">{pub.priceSuffix}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => onNavigateTab(pub.tabTarget)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer select-none"
                    >
                      {actionTexts[pub.sector] || 'Explorar ➔'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredPublications.length === 0 && (
            <div className="col-span-full py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400 font-medium">
              No hay publicaciones activas para el sector seleccionado.
            </div>
          )}
        </div>
      </div>

      {/* 5. VISIÓN DIGITAL INTEGRADA BANNER & OFERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Banner de Sinergia Omnicanal */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">Gobernación Regional</span>
            <h3 className="text-lg font-black tracking-tight">Sinergia Connect • Marca Blanca Colombia</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              La visión de Sinergia Connect es facultar a cooperativas regionales, gremios comerciales de Urabá, centrales campesinas y hoteles independientes de marca blanca para ofrecer sus servicios de forma cooperativa con finanzas digitales unificadas.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <p className="text-lg font-black text-emerald-400">100%</p>
              <p className="text-[10px] text-slate-450 uppercase font-mono mt-0.5 leading-tight">Digital Sandbox</p>
            </div>
            <div>
              <p className="text-lg font-black text-indigo-400">${(companies.length * 12).toFixed(0)}k</p>
              <p className="text-[10px] text-slate-450 uppercase font-mono mt-0.5 leading-tight">Tokens Liquidez</p>
            </div>
            <div>
              <p className="text-lg font-black text-amber-500">Multiservicio</p>
              <p className="text-[10px] text-slate-450 uppercase font-mono mt-0.5 leading-tight">9 Sectores</p>
            </div>
          </div>
        </div>

        {/* Promociones Especiales column */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-205 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h4 className="text-xs font-black text-indigo-650 uppercase tracking-widest flex items-center gap-1">
              ⚡ Ofertas y Promociones Activas
            </h4>
            <p className="text-xs text-slate-500 font-sans">
              Descuentos automáticos canjeando tu cartera virtual SNG Token.
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-slate-800">20% Off Palacio Real Resorts</p>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">Aplica en Master Suite reservando más de 2 noches.</p>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold uppercase px-1.5 py-0.5 rounded">HOTELES</span>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-extrabold text-slate-800">Flete Especial Carga Refrigerada</p>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">Asignación prioritaria para fletes bananeros en Carepa.</p>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold uppercase px-1.5 py-0.5 rounded">TRANSPORTE</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('marketplace')}
            className="w-full py-2 bg-slate-900 border border-slate-800 hover:bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            Ver Catálogo de Comercio <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
