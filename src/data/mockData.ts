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
  }
];

export const INITIAL_COMPANIES: Company[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_LOGISTICS: LogisticsRequest[] = [];

export const INITIAL_HOTEL_ROOMS: HotelRoom[] = [];

export const INITIAL_HOTEL_BOOKINGS: HotelBooking[] = [];

export const INITIAL_TOURS: TourPackage[] = [];

export const INITIAL_TOUR_BOOKINGS: TourBooking[] = [];

export const INITIAL_PROFESSIONALS: ProfessionalService[] = [];

export const INITIAL_CONTRACTS: ServiceContract[] = [];

export const INITIAL_CHANNELS: ChatChannel[] = [];

export const INITIAL_MESSAGES: ChatMessage[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not-init',
    title: 'Bienvenido a Sinergia Connect',
    description: 'Ecosistema comercial e innovador unificado. Has ingresado como Super Administrador.',
    type: 'system',
    read: false,
    timestamp: new Date().toISOString()
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-init',
    actorName: 'Jose Gregorio Admin',
    actorRole: 'super_admin',
    action: 'Inicialización de Producción',
    details: 'Limpieza total del sistema completada. Plataforma lista para producción.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1'
  }
];
