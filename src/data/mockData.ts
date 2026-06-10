import { 
  Company, 
  Product, 
  LogisticsRequest, 
  HotelRoom, 
  HotelBooking, 
  TourPackage, 
  TourBooking, 
  ProfessionalService, 
  ServiceContract, 
  Transaction, 
  ChatMessage, 
  ChatChannel, 
  AppNotification, 
  AuditLog,
  UserProfile
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  { 
    id: 'usr-1', 
    name: 'Jose Gregorio Admin', 
    email: 'josegregoriourdanetaguadama@gmail.com', 
    role: 'super_admin', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🟣 KYC Completo', '⭐ Premium', '🏆 Aliado Estratégico Sinergia'],
    isMfaEnabled: true,
    mfaType: 'totp',
    documentId: 'CC-109022',
    phone: '+57 322 900 1212',
    kycDetails: {
      status: 'verified',
      razonSocial: 'Sinergia Holding Ltd',
      nit: '900.223.112-9',
      specificSectors: ['inmobiliaria']
    }
  },
  { 
    id: 'usr-2', 
    name: 'Carlos Mendoza', 
    email: 'carlos@sinergialogistica.com', 
    role: 'company_admin', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 
    companyId: 'comp-1',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🔵 Empresa Verificada', '🟣 KYC Completo'],
    isMfaEnabled: true,
    mfaType: 'sms',
    documentId: 'CC-102030',
    phone: '+57 300 456 7890',
    kycDetails: {
      status: 'verified',
      razonSocial: 'Sinergia Cargo & Logística S.A.S',
      nit: '800.124.234-5',
      licenciaConducir: 'CC-102030-TR',
      soat: 'SOAT-2026-X1',
      tarjetaPropiedad: 'TP-9921',
      specificSectors: ['transporte']
    }
  },
  { 
    id: 'usr-3', 
    name: 'Valeria Restrepo', 
    email: 'v.restrepo@buyer.com', 
    role: 'client', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    verifLevel: 2,
    sellos: ['🟢 Usuario Verificado'],
    isMfaEnabled: false,
    mfaType: 'none',
    documentId: 'CC-445122',
    phone: '+57 312 909 8812',
    kycDetails: {
      status: 'verified'
    }
  },
  { 
    id: 'usr-4', 
    name: 'Manuel Beltrán', 
    email: 'manuel@driver.sinergia.com', 
    role: 'driver', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🟣 KYC Completo'],
    isMfaEnabled: true,
    mfaType: 'email',
    documentId: 'CC-880445',
    phone: '+57 322 111 2233',
    kycDetails: {
      status: 'verified',
      licenciaConducir: 'C2-880445',
      soat: 'S-7721832',
      tarjetaPropiedad: 'TP-83210',
      specificSectors: ['transporte']
    }
  },
  { 
    id: 'usr-5', 
    name: 'Diana Turbay', 
    email: 'diana@andesaventura.com', 
    role: 'tour_operator', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', 
    companyId: 'comp-4',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🔵 Empresa Verificada', '🟣 KYC Completo', '🟡 Negocio Destacado'],
    isMfaEnabled: true,
    mfaType: 'totp',
    documentId: 'CC-553123',
    phone: '+57 312 888 7777',
    kycDetails: {
      status: 'verified',
      razonSocial: 'Andes Aventuras S.A.S',
      nit: '900.881.233-1',
      rnt: 'RNT-45521',
      specificSectors: ['turismo']
    }
  },
  { 
    id: 'usr-6', 
    name: 'Santiago Bernal', 
    email: 'santiago@royalhotels.com', 
    role: 'hotel_admin', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 
    companyId: 'comp-3',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🔵 Empresa Verificada', '🟣 KYC Completo', '⭐ Premium'],
    isMfaEnabled: true,
    mfaType: 'totp',
    documentId: 'CC-760512',
    phone: '+57 315 222 3333',
    kycDetails: {
      status: 'verified',
      razonSocial: 'Consorcio Royal Hoteles de Colombia',
      nit: '809.112.551-0',
      rnt: 'RNT-88129',
      specificSectors: ['hotelero']
    }
  },
  { 
    id: 'usr-7', 
    name: 'Lina Marcela', 
    email: 'lina@megastore.com', 
    role: 'merchant', 
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80', 
    companyId: 'comp-2',
    verifLevel: 3,
    sellos: ['🟢 Usuario Verificado', '🔵 Empresa Verificada', '🟣 KYC Completo'],
    isMfaEnabled: false,
    mfaType: 'none',
    documentId: 'CC-552319',
    phone: '+57 311 987 6543',
    kycDetails: {
      status: 'verified',
      razonSocial: 'Mercado Sinergia Super Store S.A.',
      nit: '710.223.111-2'
    }
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Sinergia Cargo & Logística',
    type: 'logistics',
    status: 'active',
    logo: '🚚',
    createdAt: '2026-01-15',
    email: 'contacto@sinergialogistica.com',
    phone: '+57 300 456 7890',
    rating: 4.8
  },
  {
    id: 'comp-2',
    name: 'Mercado Sinergia Super Store',
    type: 'retail',
    status: 'active',
    logo: '🛍️',
    createdAt: '2026-02-10',
    email: 'ventas@megastore.com',
    phone: '+57 311 987 6543',
    rating: 4.6
  },
  {
    id: 'comp-3',
    name: 'Palacio Real Hoteles & Resorts',
    type: 'hospitality',
    status: 'active',
    logo: '🏨',
    createdAt: '2026-03-01',
    email: 'reservas@royalhotels.com',
    phone: '+57 315 222 3333',
    rating: 4.9
  },
  {
    id: 'comp-4',
    name: 'Andes Aventuras & EcoTurismo',
    type: 'tourism',
    status: 'active',
    logo: '🏔️',
    createdAt: '2026-03-12',
    email: 'viajes@andesaventura.com',
    phone: '+57 312 888 7777',
    rating: 4.7
  },
  {
    id: 'comp-5',
    name: 'Sinergia Expertos Asociados',
    type: 'professional',
    status: 'active',
    logo: '💼',
    createdAt: '2026-04-01',
    email: 'servicio@expertos.com',
    phone: '+57 310 555 4444',
    rating: 4.9
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop Executive Pro S14',
    price: 1249.99,
    category: 'Electrónica',
    description: 'Portátil de última generación con procesador de alta gama, 16GB RAM y 512GB SSD. Perfecta para productividad y teletrabajo.',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    stock: 25,
    companyId: 'comp-2',
    companyName: 'Mercado Sinergia Super Store'
  },
  {
    id: 'prod-2',
    name: 'Audífonos Bluetooth Over-Ear H9',
    price: 149.99,
    category: 'Audio',
    description: 'Cancelación activa de ruido híbrida, hasta 40 horas de batería recargable e increíble respuesta de graves dinámicos.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
    rating: 4.5,
    stock: 75,
    companyId: 'comp-2',
    companyName: 'Mercado Sinergia Super Store'
  },
  {
    id: 'prod-3',
    name: 'Cafetera Espresso Premium Italiana',
    price: 389.00,
    category: 'Hogar',
    description: 'Prepara el mejor café de especialidad a 19 bares de presión. Control de temperatura preciso y boquilla espumadora de leche.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0ec6?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    stock: 12,
    companyId: 'comp-2',
    companyName: 'Mercado Sinergia Super Store'
  },
  {
    id: 'prod-4',
    name: 'Reloj Inteligente FitPulse Active',
    price: 199.50,
    category: 'Accesorios',
    description: 'Monitor de ritmo cardíaco las 24 horas, rastreo de GPS integrado, resistencia al agua IP68 y pantalla AMOLED de alta gama.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
    rating: 4.4,
    stock: 110,
    companyId: 'comp-2',
    companyName: 'Mercado Sinergia Super Store'
  },
  {
    id: 'prod-5',
    name: 'Teclado Mecánico RGB Custom',
    price: 115.00,
    category: 'Electrónica',
    description: 'Formato 65% con interruptores mecánicos intercambiables (hot-swappable), retroiluminación RGB programable y conectividad dual inalámbrica/USB C.',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    rating: 4.7,
    stock: 40,
    companyId: 'comp-2',
    companyName: 'Mercado Sinergia Super Store'
  }
];

export const INITIAL_LOGISTICS: LogisticsRequest[] = [
  {
    id: 'log-1',
    type: 'cargo',
    senderName: 'Almacenes Éxito S.A.',
    pickupAddress: 'Term. Carga El Dorado, Bogotá',
    deliveryAddress: 'Sede Industrial Américas, Bogotá',
    cargoDescription: '12 Pallets de electrodomésticos y tecnología',
    weightKg: 4500,
    price: 420.00,
    status: 'in_transit',
    driverId: 'usr-4',
    driverName: 'Manuel Beltrán',
    companyId: 'comp-1',
    createdAt: '2026-06-09T08:00:00Z',
    progress: 65
  },
  {
    id: 'log-2',
    type: 'refrigerated',
    senderName: 'Carnes Frías del Norte',
    pickupAddress: 'Frigorífico Central, Medellín',
    deliveryAddress: 'Centro Distribución, Cali',
    cargoDescription: 'Lote de carnes maduradas en empaque al vacío (Temperatura controlada a -4°C)',
    weightKg: 2800,
    price: 850.00,
    status: 'assigned',
    driverId: 'usr-4',
    driverName: 'Manuel Beltrán',
    companyId: 'comp-1',
    createdAt: '2026-06-09T14:30:00Z',
    progress: 10
  },
  {
    id: 'log-3',
    type: 'relocation',
    senderName: 'Elena Martínez',
    pickupAddress: 'Apto 402 Edificio San Lucas, Poblado, Medellín',
    deliveryAddress: 'Casa Campestre Llanogrande, Rionegro',
    cargoDescription: 'Mudanza completa residencial (muebles, electrodomésticos, 45 cajas marcadas)',
    weightKg: 1200,
    price: 350.00,
    status: 'pending',
    companyId: 'comp-1',
    createdAt: '2026-06-10T00:15:00Z',
    progress: 0
  }
];

export const INITIAL_HOTEL_ROOMS: HotelRoom[] = [
  {
    id: 'room-1',
    hotelId: 'comp-3',
    hotelName: 'Palacio Real Hoteles & Resorts',
    name: 'Master Suite Executiva',
    type: 'suite',
    pricePerNight: 280.00,
    capacityMax: 4,
    available: true,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop&q=80',
    amenities: ['Jacuzzi privado', 'Cama King Size', 'Mini Bar Premium', 'Vista al mar', 'Room Service 24/7', 'WiFi Ultra Rápido'],
    location: 'Bocagrande, Cartagena, Colombia',
    rating: 4.9
  },
  {
    id: 'room-2',
    hotelId: 'comp-3',
    hotelName: 'Palacio Real Hoteles & Resorts',
    name: 'Habitación Doble Climatizada Superior',
    type: 'deluxe',
    pricePerNight: 165.00,
    capacityMax: 2,
    available: true,
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&auto=format&fit=crop&q=80',
    amenities: ['Aire Acondicionado Central', 'Cama Queen', 'smartTV 55"', 'Escritorio corporativo', 'Desayuno Buffet incluido'],
    location: 'Bocagrande, Cartagena, Colombia',
    rating: 4.7
  },
  {
    id: 'room-3',
    hotelId: 'comp-3',
    hotelName: 'Palacio Real Hoteles & Resorts',
    name: 'Habitación Colonial Estándar',
    type: 'standard',
    pricePerNight: 95.00,
    capacityMax: 2,
    available: false,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&auto=format&fit=crop&q=80',
    amenities: ['Cama Matrimonial', 'Ventilador de Techo', 'Bebida de bienvenida', 'Baño privado'],
    location: 'Centro Histórico, Cartagena, Colombia',
    rating: 4.3
  }
];

export const INITIAL_HOTEL_BOOKINGS: HotelBooking[] = [
  {
    id: 'hb-1',
    roomId: 'room-3',
    hotelName: 'Palacio Real Hoteles & Resorts',
    roomName: 'Habitación Colonial Estándar',
    guestName: 'Valeria Restrepo',
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    totalPrice: 285.00,
    status: 'confirmed',
    createdAt: '2026-06-08T17:21:00Z'
  }
];

export const INITIAL_TOURS: TourPackage[] = [
  {
    id: 'tour-1',
    companyId: 'comp-4',
    companyName: 'Andes Aventuras & EcoTurismo',
    title: 'Aventura Extrema en el Eje Cafetero',
    destination: 'Salento & Valle de Cocora, Quindío',
    durationDays: 3,
    pricePerPerson: 240.00,
    description: 'Recorrido único por el majestuoso Valle de Cocora para admirar las palmas de cera, tours guiados por cafetales ancestrales con catación profesional, cabalgata de montaña y rafting por el río Barragán.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80',
    rating: 4.9,
    included: ['Transporte terrestre privado', 'Hotel campestre de lujo 2 noches', 'Desayuno y Almuerzo típico', 'Guía bilingüe certificado', 'Seguro de asistencia médica'],
    spotsLeft: 8
  },
  {
    id: 'tour-2',
    companyId: 'comp-4',
    companyName: 'Andes Aventuras & EcoTurismo',
    title: 'Expedición Arqueológica Ciudad Perdida',
    destination: 'Sierra Nevada de Santa Marta',
    durationDays: 4,
    pricePerPerson: 490.00,
    description: 'Un trekking inolvidable a través de la densa selva tropical de la Sierra Nevada hasta descubrir las majestuosas terrazas de Teyuna, el santuario sagrado de los Tayrona.',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=500&auto=format&fit=crop&q=80',
    rating: 4.8,
    included: ['Alojamiento en campamentos indígenas', 'Alimentación completa (4 días)', 'Aporte a comunidades locales', 'Entrada oficial al Parque Arqueológico', 'Guía baquiano local'],
    spotsLeft: 12
  }
];

export const INITIAL_TOUR_BOOKINGS: TourBooking[] = [
  {
    id: 'tb-1',
    tourId: 'tour-1',
    tourTitle: 'Aventura Extrema en el Eje Cafetero',
    customerName: 'Valeria Restrepo',
    paxCount: 2,
    date: '2026-07-02',
    totalPrice: 480.00,
    status: 'booked',
    createdAt: '2026-06-09T11:45:00Z'
  }
];

export const INITIAL_PROFESSIONALS: ProfessionalService[] = [
  {
    id: 'prof-srv-1',
    companyId: 'comp-5',
    companyName: 'Sinergia Expertos Asociados',
    name: 'Ing. Alejandro Restrepo',
    profession: 'developer',
    hourlyRate: 35.00,
    rating: 4.9,
    completedJobs: 134,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    skills: ['React', 'Next.js', 'PostgreSQL', 'SaaS Architecture', 'E-Commerce Integrations'],
    bio: 'Desarrollador fullstack con 8 años de experiencia estructurando plataformas empresariales con integraciones de pago complejas y arquitectura multi-tenant.'
  },
  {
    id: 'prof-srv-2',
    companyId: 'comp-5',
    companyName: 'Sinergia Expertos Asociados',
    name: 'Dra. María Paula Gómez',
    profession: 'consultant',
    hourlyRate: 45.00,
    rating: 4.8,
    completedJobs: 89,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    skills: ['Planificación Fiscal', 'Auditoría Administrativa', 'Cumplimiento Regulatorio', 'SaaS Advisory'],
    bio: 'Especialista en estructuración contable e impuestos corporativos para startups y corporativos multiempresa en América Latina.'
  },
  {
    id: 'prof-srv-3',
    companyId: 'comp-5',
    companyName: 'Sinergia Expertos Asociados',
    name: 'Téc. Carlos Pérez',
    profession: 'electrician',
    hourlyRate: 18.00,
    rating: 4.7,
    completedJobs: 210,
    avatar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=150&auto=format&fit=crop&q=80',
    skills: ['Cableado Comercial', 'Tableros Trifásicos', 'Certificación RETIE', 'Sistemas de Respaldo'],
    bio: 'Electricista matriculado experto en montajes industriales, mantenimiento de plantas refrigeradas y reparaciones inmediatas.'
  }
];

export const INITIAL_CONTRACTS: ServiceContract[] = [
  {
    id: 'cont-1',
    serviceId: 'prof-srv-1',
    professionalName: 'Ing. Alejandro Restrepo',
    profession: 'Developer',
    clientName: 'Valeria Restrepo',
    hoursRequested: 10,
    totalPrice: 350.00,
    status: 'active',
    startDate: '2026-06-11',
    createdAt: '2026-06-09T09:12:00Z'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-1',
    participantName: 'Manuel Beltrán (Conductor)',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participantRole: 'driver',
    lastMessage: 'Hola, ya ingresé al terminal de carga. Voy para la zona de muelles.',
    updatedAt: '2026-06-10T01:03:00Z',
    unreadCount: 1
  },
  {
    id: 'chan-2',
    participantName: 'Soporte Sinergia Connect',
    participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participantRole: 'super_admin',
    lastMessage: 'Tu recarga de saldo por $500.00 USD ha sido aprobada correctamente.',
    updatedAt: '2026-06-09T20:15:00Z',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'chan-1',
    senderId: 'usr-4',
    senderName: 'Manuel Beltrán',
    senderRole: 'driver',
    text: 'Buen día, estoy validando los papeles del cargamento antes de iniciar ruta.',
    timestamp: '2026-06-09T15:00:00Z'
  },
  {
    id: 'msg-2',
    channelId: 'chan-1',
    senderId: 'usr-3',
    senderName: 'Valeria Restrepo',
    senderRole: 'client',
    text: 'Perfecto Manuel, por favor asegúrate de calibrar el termostato de la mercancía refrigerada a -4°C.',
    timestamp: '2026-06-09T15:15:00Z'
  },
  {
    id: 'msg-3',
    channelId: 'chan-1',
    senderId: 'usr-4',
    senderName: 'Manuel Beltrán',
    senderRole: 'driver',
    text: 'Hola, ya ingresé al terminal de carga. Voy para la zona de muelles.',
    timestamp: '2026-06-10T01:03:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not-1',
    title: 'Recarga Exitosa',
    description: 'Su recarga por valor de $500.00 USD ha sido acreditada en su wallet digital.',
    type: 'wallet',
    read: false,
    timestamp: '2026-06-09T20:15:00Z'
  },
  {
    id: 'not-2',
    title: 'Conductor Asignado',
    description: 'Manuel Beltrán ha aceptado su solicitud de transporte frigorífico #log-2.',
    type: 'logistics',
    read: false,
    timestamp: '2026-06-09T14:31:00Z'
  },
  {
    id: 'not-3',
    title: 'Reserva Confirmada',
    description: 'Su estadía en Palacio Real Hoteles & Resorts (Master Suite Executiva) ha sido confirmada.',
    type: 'booking',
    read: true,
    timestamp: '2026-06-08T17:21:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    actorName: 'Jose Gregorio Admin',
    actorRole: 'super_admin',
    action: 'Creación de Empresa',
    details: 'Se dio de alta el inquilino comp-5 "Sinergia Expertos Asociados" en el tenant pool.',
    timestamp: '2026-06-09T10:30:00Z',
    ipAddress: '185.22.45.109'
  },
  {
    id: 'aud-2',
    actorName: 'Jose Gregorio Admin',
    actorRole: 'super_admin',
    action: 'Autorización Wallet',
    details: 'Aprobación manual de recarga de fondos por $500.00 USD para el usuario usr-3.',
    timestamp: '2026-06-09T20:14:00Z',
    ipAddress: '185.22.45.109'
  },
  {
    id: 'aud-3',
    actorName: 'Carlos Mendoza',
    actorRole: 'company_admin',
    action: 'Asignación Logística',
    details: 'Asignación manual de orden log-1 al conductor Manuel Beltrán (usr-4).',
    timestamp: '2026-06-09T08:05:00Z',
    ipAddress: '190.12.33.45'
  }
];
