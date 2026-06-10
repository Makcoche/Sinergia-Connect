import React, { useState } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Company, 
  Product, 
  LogisticsRequest, 
  HotelRoom, 
  HotelBooking, 
  TourPackage, 
  TourBooking, 
  ProfessionalService, 
  ServiceContract, 
  ChatChannel, 
  ChatMessage, 
  AppNotification, 
  AuditLog, 
  Wallet,
  Transaction
} from './types';

import { 
  INITIAL_USERS, 
  INITIAL_COMPANIES, 
  INITIAL_PRODUCTS, 
  INITIAL_LOGISTICS, 
  INITIAL_HOTEL_ROOMS, 
  INITIAL_HOTEL_BOOKINGS, 
  INITIAL_TOURS, 
  INITIAL_TOUR_BOOKINGS, 
  INITIAL_PROFESSIONALS, 
  INITIAL_CONTRACTS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';

// Component imports
import WalletModule from './components/WalletModule';
import MarketplaceModule from './components/MarketplaceModule';
import LogisticsModule from './components/LogisticsModule';
import HotelsModule from './components/HotelsModule';
import ToursModule from './components/ToursModule';
import ProfessionalsModule from './components/ProfessionalsModule';
import ChatModule from './components/ChatModule';
import AdminDashboard from './components/AdminDashboard';
import NotificationsFeed from './components/NotificationsFeed';
import OnboardingModule from './components/OnboardingModule';
import InicioModule from './components/InicioModule';
import EventosModule from './components/EventosModule';
import DirectorioModule from './components/DirectorioModule';
import ContactoModule from './components/ContactoModule';
import SaaSCompanyPanel from './components/SaaSCompanyPanel';
import SaaSClientPanel from './components/SaaSClientPanel';
import InmobiliariaModule from './components/InmobiliariaModule';
import GastronomiaModule from './components/GastronomiaModule';

import { 
  WalletCards, 
  ShoppingCart, 
  Truck, 
  Building2, 
  Compass, 
  Briefcase, 
  MessageSquare, 
  ShieldAlert, 
  Bell, 
  Users, 
  Clock, 
  Globe, 
  Download, 
  Sparkles,
  Search,
  CheckCircle2,
  BookOpen,
  LogOut,
  Home,
  Music,
  FolderLock,
  Heart,
  Phone,
  Layers,
  Utensils
} from 'lucide-react';

export default function App() {
  // Navigation active tab (matching USER MENU INTEGRATION)
  const [activeTab, setActiveTab] = useState<
    | 'inicio'
    | 'empresas'
    | 'marketplace'
    | 'tours'
    | 'hotels'
    | 'logistics'
    | 'professionals'
    | 'eventos'
    | 'directorio'
    | 'contacto'
    | 'wallet'
    | 'chat'
    | 'admin'
    | 'saas_company'
    | 'saas_client'
    | 'onboarding'
    | 'inmobiliaria'
    | 'gastronomia'
  >('inicio');

  // Core App states for real-time Sandbox data retention
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr-1'); // Start as 'Jose Gregorio Admin' (Super Admin, josegregoriourdanetaguadama@gmail.com) by default!
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [logistics, setLogistics] = useState<LogisticsRequest[]>(INITIAL_LOGISTICS);
  const [rooms, setRooms] = useState<HotelRoom[]>(INITIAL_HOTEL_ROOMS);
  const [bookings, setBookings] = useState<HotelBooking[]>(INITIAL_HOTEL_BOOKINGS);
  const [tours, setTours] = useState<TourPackage[]>(INITIAL_TOURS);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>(INITIAL_TOUR_BOOKINGS);
  const [professionals, setProfessionals] = useState<ProfessionalService[]>(INITIAL_PROFESSIONALS);
  const [contracts, setContracts] = useState<ServiceContract[]>(INITIAL_CONTRACTS);
  
  const [channels, setChannels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Favorites list tracking for client-panel
  const [favorites, setFavorites] = useState<string[]>(['prod-2', 'room-1', 'tour-1']);

  // Simulated wallets state map (userId -> wallet)
  const [wallets, setWallets] = useState<Record<string, Wallet>>({
    'usr-1': { userId: 'usr-1', balanceCodeToken: 'SNG', balanceCopUSD: 12500.00, accountNumber: 'SNG-9981-ADMIN' },
    'usr-2': { userId: 'usr-2', balanceCodeToken: 'SNG', balanceCopUSD: 4500.00, accountNumber: 'SNG-4451-CARGO' },
    'usr-3': { userId: 'usr-3', balanceCodeToken: 'SNG', balanceCopUSD: 3120.00, accountNumber: 'SNG-1209-VALERIA' }, // starter Client
    'usr-4': { userId: 'usr-4', balanceCodeToken: 'SNG', balanceCopUSD: 180.00, accountNumber: 'SNG-8804-MANUEL' },
    'usr-5': { userId: 'usr-5', balanceCodeToken: 'SNG', balanceCopUSD: 1210.00, accountNumber: 'SNG-3312-DIANA' },
    'usr-6': { userId: 'usr-6', balanceCodeToken: 'SNG', balanceCopUSD: 8500.00, accountNumber: 'SNG-7605-HOTEL' },
    'usr-7': { userId: 'usr-7', balanceCodeToken: 'SNG', balanceCopUSD: 2400.00, accountNumber: 'SNG-5523-LINA' },
  });

  // Client transactions ledger mapped to Valeria Restrepo
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-0', userId: 'usr-3', type: 'recharge', amount: 500.00, description: 'Recargado vía Pasarela Sinergia', timestamp: '2026-06-09T20:15:00Z', status: 'completed' },
    { id: 'tx-1', userId: 'usr-3', type: 'payment_made', amount: 285.00, description: 'Estadía en Palacio Real Hoteles & Resorts', timestamp: '2026-06-08T17:21:00Z', status: 'completed' },
    { id: 'tx-2', userId: 'usr-3', type: 'payment_made', amount: 480.00, description: 'Reserva Tour Eje Cafetero', timestamp: '2026-06-09T11:45:00Z', status: 'completed' }
  ]);

  // Favorites handlers
  const handleAddToFavorites = (id: string) => {
    if (!favorites.includes(id)) {
      setFavorites(prev => [...prev, id]);
      triggerNotification('Añadido a Favoritos', 'Elemento guardado en tu portafolio de interés.', 'system');
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item !== id));
  };

  // Event booking handler
  const handleBookEvent = (id: string, name: string, price: number, date: string) => {
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= price;
    updatedWallets['usr-1'].balanceCopUSD += price; // super admin receives event logistics payouts
    setWallets(updatedWallets);

    const eventTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: price,
      description: `Reserva Evento Escrow #${id}: ${name} (${date})`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [eventTx, ...prev]);
    addAuditLog('Reserva Evento', `Alquiler de elemento/artista para eventos: ${name} por un valor de $${price.toFixed(2)} USD.`);
  };

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Active user details with a guest fallback
  const GUEST_USER: UserProfile = {
    id: 'guest',
    name: 'Invitado (Sin Conexión)',
    email: 'invitado@sinergiaconnect.com',
    role: 'client',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  const currentUser = users.find(u => u.id === currentUserId) || GUEST_USER;
  const userWallet = wallets[currentUserId] || { userId: currentUserId, balanceCodeToken: 'SNG', balanceCopUSD: 0.00, accountNumber: 'SNG-EMPTY' };

  // 1. Audit logger action helper
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Math.floor(Math.random() * 9000 + 1000)}`,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '190.124.55.19'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // 2. Notification trigger helper
  const triggerNotification = (title: string, description: string, type: AppNotification['type']) => {
    const newNot: AppNotification = {
      id: `not-${Math.floor(Math.random() * 9000 + 1000)}`,
      title,
      description,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  // 3. User switching triggers
  const handleUserRoleChange = (role: UserRole) => {
    const matchedUser = users.find(u => u.role === role);
    if (matchedUser) {
      setCurrentUserId(matchedUser.id);
      addAuditLog('Cambio de Rol Sandbox', `Usuario cambió su identidad en el preview al rol: ${role}`);
      
      // Auto-switch tabs to fit role workflow beautifully
      if (role === 'super_admin' || role === 'company_admin') {
        setActiveTab('admin');
      } else if (role === 'driver') {
        setActiveTab('logistics');
      } else {
        setActiveTab('marketplace');
      }
    }
  };

  const handleOnboardingRegister = (
    userPayload: Omit<UserProfile, 'id'>,
    companyPayload?: Omit<Company, 'id' | 'createdAt'>
  ) => {
    const newUserId = `usr-${users.length + 1}`;
    let newCompanyId: string | undefined = undefined;

    if (companyPayload) {
      newCompanyId = `comp-${companies.length + 1}`;
      const newCompany: Company = {
        ...companyPayload,
        id: newCompanyId,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCompanies(prev => [...prev, newCompany]);
    }

    const newUser: UserProfile = {
      ...userPayload,
      id: newUserId,
      companyId: newCompanyId
    };

    setUsers(prev => [...prev, newUser]);

    // Create custom Wallet
    const accountCode = `SNG-${Math.floor(Math.random() * 9000 + 1000)}-${userPayload.name.replace(/\s+/g, '').toUpperCase().substring(0, 8)}`;
    const newWallet: Wallet = {
      userId: newUserId,
      balanceCodeToken: 'SNG',
      balanceCopUSD: 2500.00,
      accountNumber: accountCode
    };

    setWallets(prev => ({
      ...prev,
      [newUserId]: newWallet
    }));

    // Switch current user session immediately to this newly created user
    setCurrentUserId(newUserId);

    addAuditLog(
      'Registro Onboarding Multi-user',
      `Creado perfil e inquilino para "${userPayload.name}" - Rol: ${userPayload.role}. Asignado Monedero: ${accountCode}`
    );

    triggerNotification(
      'Bienvenido a Sinergia Connect',
      `¡Hola ${userPayload.name}! Se te ha acreditado un saldo de bienvenida de $2,500.00 USD en tu Wallet virtual.`,
      'wallet'
    );
  };

  const handleSwitchSession = (userId: string) => {
    const matchedUser = users.find(u => u.id === userId);
    if (matchedUser) {
      setCurrentUserId(matchedUser.id);
      addAuditLog('Conexión Sesión Activa', `Cambiando de forma interactiva a la sesión de: ${matchedUser.name}`);
      triggerNotification('Sesión conectada exitosamente', `Operando ahora como ${matchedUser.name} (${matchedUser.role}).`, 'system');
    }
  };

  const handleLogout = () => {
    addAuditLog('Cierre de Sesión', `El usuario "${currentUser.name}" ha cerrado su sesión de forma manual.`);
    setCurrentUserId('guest');
    triggerNotification('Sesión finalizada', 'Sesión cerrada. Ahora estás navegando en modo Invitado.', 'system');
  };

  const handleUpdateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  // 4. Wallet recharge
  const handleRechargeWallet = (amount: number, description: string) => {
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD += amount;
    setWallets(updatedWallets);

    const newTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'recharge',
      amount,
      description,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [newTx, ...prev]);
    triggerNotification('Recarga de Balance', `Su cuenta ha recibido un depósito por valor de $${amount.toFixed(2)} USD.`, 'wallet');
    addAuditLog('Depósito Wallet', `Usuario recargó $${amount.toFixed(2)} USD en su cuenta.`);
  };

  // 5. Wallet transfer
  const handleTransferWallet = (toEmail: string, amount: number, description: string) => {
    const recipientUser = users.find(u => u.email.toLowerCase() === toEmail.toLowerCase());
    if (!recipientUser) {
      return 'El correo del destinatario no pertenece a ningún inquilino u operador registrado.';
    }

    if (recipientUser.id === currentUserId) {
      return 'No puede auto-transferirse fondos.';
    }

    // Deduct sender balance
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= amount;
    // Credit recipient balance
    updatedWallets[recipientUser.id].balanceCopUSD += amount;
    setWallets(updatedWallets);

    // Sender's Transaction record
    const senderTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'transfer_sent',
      amount,
      description,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [senderTx, ...prev]);

    // Emit custom notifications
    triggerNotification('Giro Enviado', `Has enviado $${amount.toFixed(2)} USD a ${recipientUser.name}.`, 'wallet');
    
    addAuditLog(
      'Giro Interbancario SNG',
      `Transfiriendo $${amount.toFixed(2)} USD desde ${currentUser.name} a ${recipientUser.name}`
    );

    return true;
  };

  // 6. E-Commerce checkout payment dispatcher
  const handleMarketplacePurchase = (
    totalAmount: number, 
    description: string, 
    orderedItems: { productId: string; qty: number }[]
  ) => {
    // Deduct user wallet
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= totalAmount;
    
    // Credit the Commerce company admin's wallet (usr-7 represent Merchant)
    updatedWallets['usr-7'].balanceCopUSD += totalAmount;
    setWallets(updatedWallets);

    const purchaseTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: totalAmount,
      description,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [purchaseTx, ...prev]);

    triggerNotification(
      'Pago Marketplace exitoso',
      `Débito total de la compra por $${totalAmount.toFixed(2)} USD ejecutado correctamente.`,
      'wallet'
    );

    addAuditLog('Pago Marketplace', `Cliente compró productos por un valor de $${totalAmount.toFixed(2)} USD.`);

    return true;
  };

  // 7. Product stock modify callback
  const handleProductStockChange = (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  const handleDecreaseWallet = (amount: number, detail: string) => {
    const updatedWallets = { ...wallets };
    if (updatedWallets[currentUserId]) {
      updatedWallets[currentUserId].balanceCopUSD -= amount;
      updatedWallets['usr-1'].balanceCopUSD += amount;
      setWallets(updatedWallets);

      const newTx: Transaction = {
        id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
        userId: currentUserId,
        type: 'payment_made',
        amount,
        description: detail,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      setTransactions(prev => [newTx, ...prev]);
      addAuditLog('Pago Sinergia Pay (Gastronomía)', `${detail} - Monto: $${amount.toFixed(2)} USD`);
    }
  };

  // 8. Logistics Request Dispatch
  const handleCreateLogisticsRequest = (req: Omit<LogisticsRequest, 'id' | 'createdAt' | 'progress' | 'companyId'>) => {
    const newId = `log-${logistics.length + 1}`;
    const newReq: LogisticsRequest = {
      ...req,
      id: newId,
      companyId: 'comp-1',
      createdAt: new Date().toISOString(),
      progress: 0
    };

    setLogistics(prev => [newReq, ...prev]);

    // If paid via wallet, deduct funds (e.g. logistics company is comp-1, represented by 'usr-2')
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= req.price;
    updatedWallets['usr-2'].balanceCopUSD += req.price;
    setWallets(updatedWallets);

    const transportTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: req.price,
      description: `Pago flete logístico #${newId} (${req.type})`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [transportTx, ...prev]);

    triggerNotification(
      'Transporte de Carga Solicitado',
      `Flete agendado. El costo de $${req.price.toFixed(2)} USD ha sido acreditado en custodia.`,
      'logistics'
    );

    addAuditLog('Creación Flete', `Usuario solicitó transporte para: ${req.cargoDescription}`);
  };

  // 9. Update cargo state
  const handleUpdateLogisticsStatus = (id: string, status: LogisticsRequest['status'], progress: number) => {
    setLogistics(prev => prev.map(item => {
      if (item.id === id) {
        // If status changes to assigned, let's attach Manuel Beltrán as carrier
        const upd = { ...item, status, progress };
        if (status === 'assigned') {
          upd.driverId = 'usr-4';
          upd.driverName = 'Manuel Beltrán';
        }
        return upd;
      }
      return item;
    }));

    if (status === 'delivered') {
      triggerNotification(
        '¡Mercancía Entregada!',
        `Su transporte frigorífico #${id} llegó a destino de forma segura. Descargando pallets...`,
        'logistics'
      );
    }
  };

  // 10. Book Hotel room
  const handleBookHotel = (booking: Omit<HotelBooking, 'id' | 'createdAt'>) => {
    const newId = `hb-${bookings.length + 1}`;
    const newB: HotelBooking = {
      ...booking,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newB, ...prev]);

    // Transaction execution: Hotel Admin (represented by usr-6) receives the payout
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= booking.totalPrice;
    updatedWallets['usr-6'].balanceCopUSD += booking.totalPrice;
    setWallets(updatedWallets);

    const checkTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: booking.totalPrice,
      description: `Reserva Hospedaje #${newId}: ${booking.hotelName}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [checkTx, ...prev]);

    addAuditLog('Reserva Hotelera SNG', `Reservado alojamiento en ${booking.hotelName} por un total de $${booking.totalPrice.toFixed(2)} USD.`);

    return true;
  };

  // 11. Book Tour Package
  const handleBookTour = (booking: Omit<TourBooking, 'id' | 'createdAt'>) => {
    const newId = `tb-${tourBookings.length + 1}`;
    const newB: TourBooking = {
      ...booking,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setTourBookings(prev => [newB, ...prev]);

    // Tour Operator (represented by usr-5) receives the money
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= booking.totalPrice;
    updatedWallets['usr-5'].balanceCopUSD += booking.totalPrice;
    setWallets(updatedWallets);

    const tourTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: booking.totalPrice,
      description: `Reserva Tour EcoAventura: ${booking.tourTitle}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [tourTx, ...prev]);

    // decrease spots left for the tour
    setTours(prev => prev.map(t => t.id === booking.tourId ? { ...t, spotsLeft: t.spotsLeft - booking.paxCount } : t));

    addAuditLog('Reserva Paquete Ecológico', `Plan turístico para ${booking.paxCount} personas en ${booking.tourTitle} adquirido.`);

    return true;
  };

  // 12. Hire Freelance Professional
  const handleHireProfessional = (contract: Omit<ServiceContract, 'id' | 'createdAt'>) => {
    const newId = `cont-${contracts.length + 1}`;
    const newC: ServiceContract = {
      ...contract,
      id: newId,
      createdAt: new Date().toISOString()
    };
    setContracts(prev => [newC, ...prev]);

    // Partner service firm (represented by comp-5 / usr-1) receives deposit
    const updatedWallets = { ...wallets };
    updatedWallets[currentUserId].balanceCopUSD -= contract.totalPrice;
    updatedWallets['usr-1'].balanceCopUSD += contract.totalPrice;
    setWallets(updatedWallets);

    const profTx: Transaction = {
      id: `tx-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: currentUserId,
      type: 'payment_made',
      amount: contract.totalPrice,
      description: `Contrato de servicios: ${contract.professionalName}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    setTransactions(prev => [profTx, ...prev]);

    addAuditLog('Asignación Contrato Profesional', `Aprobación de escrow de $${contract.totalPrice.toFixed(2)} USD para el consultor ${contract.professionalName}.`);

    return true;
  };

  // 13. Instant Chat messaging dispatcher
  const handleSendMessage = (channelId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${messages.length + 1}`,
      channelId,
      senderId: currentUserId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    // update channels lastMessage
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, lastMessage: text, updatedAt: new Date().toISOString(), unreadCount: 0 } : c));
  };

  const handleSimulateIncomingMessage = (
    channelId: string, 
    senderId: string, 
    senderName: string, 
    role: string, 
    text: string
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${messages.length + 1}`,
      channelId,
      senderId,
      senderName,
      senderRole: role,
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, lastMessage: text, updatedAt: new Date().toISOString(), unreadCount: 1 } : c));
    triggerNotification('Nuevo mensaje entrante', `${senderName}: "${text}"`, 'chat');
  };

  // Admin Dashboard CRUD hooks
  const handleAddCompany = (comp: Omit<Company, 'id' | 'createdAt'>) => {
    const newId = `comp-${companies.length + 1}`;
    const newC: Company = {
      ...comp,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCompanies(prev => [...prev, newC]);
  };

  const handleUpdateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const handleAddProduct = (prod: Omit<Product, 'id'>) => {
    const newId = `prod-${products.length + 1}`;
    const newP: Product = {
      ...prod,
      id: newId
    };
    setProducts(prev => [...prev, newP]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Notification utility
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 antialiased overflow-x-hidden">
      
      {/* Dynamic Super Header - Clean Utility / Minimal Light Theme */}
      <header className="bg-white text-slate-800 border-b border-slate-200 shadow-xs sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex justify-between items-center">
          
          {/* Logo Brand section */}
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-600 rounded-xl text-lg font-black tracking-widest text-white shadow-sm flex items-center justify-center">S⚡C</span>
            <div>
              <h1 className="text-sm font-bold font-display tracking-tight text-slate-900 flex items-center gap-1.5">
                Sinergia Connect
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-[9px] px-1.5 py-0.5 rounded-full font-bold">SaaS SuperApp</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium font-sans">Arquitectura Multiempresa & Sandbox Centralizado</p>
            </div>
          </div>


          {/* User state and Quick Alerts Feed triggers */}
          <div className="flex items-center gap-4 text-xs font-medium">
            
            {/* Wallet quick balance selector */}
            <button
              id="header-wallet-card"
              onClick={() => setActiveTab('wallet')}
              className="bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-left cursor-pointer transition-colors"
            >
              <p className="text-[8px] text-slate-500 uppercase font-bold">Wallet Activo</p>
              <p className="text-xs font-extrabold text-emerald-600 font-mono">${userWallet.balanceCopUSD.toFixed(2)} USD</p>
            </button>

            {/* Notification alert bells triggers */}
            <div className="relative">
              <button
                id="header-notification-bell"
                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 text-indigo-600 relative transition-colors cursor-pointer"
              >
                <Bell className="w-4.5 h-4.5 text-indigo-600" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-bounce"></span>
                )}
              </button>

              {/* Float Dropdown feed */}
              {showNotificationsDropdown && (
                <div className="absolute right-0 top-11 z-50 w-80 shadow-2xl animate-fade-in select-none">
                  <NotificationsFeed
                    notifications={notifications}
                    onMarkRead={handleMarkNotificationRead}
                    onClearAll={handleClearAllNotifications}
                  />
                </div>
              )}
            </div>

            {/* Simple User profile banner with Logout simulation */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4 select-none">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              <div className="hidden md:block">
                <p className="font-extrabold text-slate-800 text-xs lines-clamp-1">{currentUser.name}</p>
                <p className="text-[9px] font-mono capitalize tracking-wider text-slate-500">{currentUser.role.replace('_', ' ')}</p>
              </div>

              {currentUserId !== 'guest' ? (
                <button
                  id="header-logout-btn"
                  onClick={() => handleLogout()}
                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-rose-200 cursor-pointer flex items-center gap-1"
                  title="Cerrar Sesión Activa"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden lg:inline">Salir</span>
                </button>
              ) : (
                <button
                  id="header-login-btn"
                  onClick={() => {
                    setActiveTab('onboarding');
                    triggerNotification('Inicio de Sesión', 'Por favor selecciona un perfil o regístrate en el Portal de Identidad.', 'system');
                  }}
                  className="p-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-150 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border border-indigo-200 cursor-pointer flex items-center gap-1 animate-pulse"
                >
                  <span>Conectar</span>🔑
                </button>
              )}
            </div>

          </div>
        </div>
      </header>


      {/* Main Core Matrix container layout with Left Sidebar and Right active widget */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex-grow flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Left Sidebar */}
        <nav className="w-full lg:w-64 flex-shrink-0 space-y-4">
          
          {/* USER CUSTOM CONTROLS DYNAMIC SECTION */}
          {currentUserId !== 'guest' ? (
            <div className="bg-indigo-950 text-white rounded-xl p-4 space-y-2 border border-indigo-900 shadow-md">
              <span className="text-[9px] font-mono font-black uppercase text-emerald-400 tracking-wider">🔒 Consola Segura Sandbox</span>
              
              {/* If user is client, show Client Panel */}
              {currentUser.role === 'client' && (
                <button
                  id="sidebar-tab-saas-client"
                  onClick={() => setActiveTab('saas_client')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'saas_client'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-300" />
                  👤 Mi Cuenta Cliente
                </button>
              )}

              {/* If user has business role, show SaaS Corporate panel */}
              {(['company_admin', 'merchant', 'hotel_admin', 'tour_operator', 'driver'].includes(currentUser.role)) && (
                <button
                  id="sidebar-tab-saas-company"
                  onClick={() => setActiveTab('saas_company')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'saas_company'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-300" />
                  🏢 Mi Panel Empresa (SaaS)
                </button>
              )}
            </div>
          ) : null}

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 select-none">Menú Principal</h4>
            
            <button
              id="sidebar-tab-inicio"
              onClick={() => setActiveTab('inicio')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'inicio'
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
              }`}
            >
              <Home className="w-4 h-4 text-indigo-600" />
              Inicio (Portal)
            </button>

            <button
              id="sidebar-tab-onboarding"
              onClick={() => setActiveTab('onboarding')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'onboarding'
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4 text-indigo-600" />
              Sesión & Registro
            </button>

            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <span className="text-[9.5px] font-black text-slate-400 px-2 uppercase tracking-widest block mb-2 select-none">
                ⚙ 9 Sectores Oficiales
              </span>

              <button
                id="sidebar-tab-marketplace"
                onClick={() => setActiveTab('marketplace')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'marketplace'
                    ? 'bg-pink-50 border border-pink-100 text-pink-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <ShoppingCart className="w-4 h-4 text-pink-500" />
                1. Comercio (E-commerce)
              </button>

              <button
                id="sidebar-tab-inmobiliaria"
                onClick={() => setActiveTab('inmobiliaria')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'inmobiliaria'
                    ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Home className="w-4 h-4 text-indigo-500" />
                2. Inmobiliaria (Venta/Renta)
              </button>

              <button
                id="sidebar-tab-logistics"
                onClick={() => setActiveTab('logistics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'logistics'
                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-500" />
                3. Transporte y Logística
              </button>

              <button
                id="sidebar-tab-hotels"
                onClick={() => setActiveTab('hotels')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'hotels'
                    ? 'bg-sky-50 border border-sky-100 text-sky-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Building2 className="w-4 h-4 text-sky-500" />
                4. Hotelería (Hospedajes)
              </button>

              <button
                id="sidebar-tab-tours"
                onClick={() => setActiveTab('tours')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'tours'
                    ? 'bg-amber-50 border border-amber-100 text-amber-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Compass className="w-4 h-4 text-amber-500" />
                5. Turismo (Tours)
              </button>

              <button
                id="sidebar-tab-gastronomia"
                onClick={() => setActiveTab('gastronomia')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'gastronomia'
                    ? 'bg-red-50 border border-red-100 text-red-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Utensils className="w-4 h-4 text-red-550" />
                6. Gastronomía (Pedidos)
              </button>

              <button
                id="sidebar-tab-professionals"
                onClick={() => setActiveTab('professionals')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'professionals'
                    ? 'bg-violet-50 border border-violet-100 text-violet-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Briefcase className="w-4 h-4 text-violet-500" />
                7. Servicios Expertos
              </button>

              <button
                id="sidebar-tab-eventos"
                onClick={() => setActiveTab('eventos')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'eventos'
                    ? 'bg-purple-50 border border-purple-100 text-purple-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <Music className="w-4 h-4 text-purple-500" />
                8. Eventos y Tarimas
              </button>

              <button
                id="sidebar-tab-directorio"
                onClick={() => setActiveTab('directorio')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'directorio'
                    ? 'bg-teal-50 border border-teal-100 text-teal-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
                }`}
              >
                <Users className="w-4 h-4 text-teal-600" />
                9. Directorio Comercial
              </button>
            </div>

            <button
              id="sidebar-tab-contacto"
              onClick={() => setActiveTab('contacto')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'contacto'
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
              }`}
            >
              <Phone className="w-4 h-4 text-rose-500" />
              Contacto Soporte
            </button>

          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 select-none">Billetera & Canales</h4>

            <button
              id="sidebar-tab-wallet"
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
              }`}
            >
              <WalletCards className="w-4 h-4 text-teal-500" />
              6. Mi Wallet Gold
            </button>

            <button
              id="sidebar-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-pink-400" />
              7. Chat Interactiva
            </button>
          </div>

          {/* Restricted Admin section indicator */}
          {(currentUser.role === 'super_admin' || currentUser.role === 'company_admin') && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2 select-none">Administración SaaS</h4>

              <button
                id="sidebar-tab-admin"
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 border border-slate-800 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-55/80 border border-transparent'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                8. Panel Control
              </button>
            </div>
          )}



        </nav>

        {/* Dynamic Display Widget Stage based on active tab Selection */}
        <div className="flex-grow min-w-0">
          
          <div className="animate-fade-in">
            {currentUserId === 'guest' && activeTab !== 'onboarding' && (
              <div className="mb-4 p-3.5 bg-indigo-50 border border-indigo-250 rounded-2xl text-xs text-indigo-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-pulse shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="p-1 px-1.5 bg-white rounded-lg border border-indigo-100 shadow-3xs text-sm">🔓</span>
                  <div>
                    <h5 className="font-extrabold text-slate-800">Cuentas Sandbox Virtualizadas</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">Estás navegando en modo Invitado. Conéctate con una empresa regional para procesar órdenes, despachos, canjear tokens o programar reservas.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('onboarding');
                    triggerNotification('Inicio de Sesión', 'Selecciona o ingresa una cuenta de pruebas.', 'system');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg uppercase tracking-wider text-[10px] transition-all cursor-pointer flex-shrink-0"
                >
                  Conectar Sesión 🔑
                </button>
              </div>
            )}
            {activeTab === 'inicio' && (
              <InicioModule
                companies={companies}
                products={products}
                rooms={rooms}
                tours={tours}
                professionals={professionals}
                onNavigateTab={setActiveTab}
                onAddToFavorites={handleAddToFavorites}
                favorites={favorites}
              />
            )}

            {activeTab === 'empresas' && (
              <DirectorioModule
                companies={companies}
                onSwitchSession={handleSwitchSession}
              />
            )}

            {activeTab === 'onboarding' && (
              <OnboardingModule
                users={users}
                companies={companies}
                wallets={wallets}
                currentUser={currentUser}
                onRegisterUser={handleOnboardingRegister}
                onSwitchSession={handleSwitchSession}
                onLogout={handleLogout}
                onUpdateUserProfile={handleUpdateUserProfile}
                onAddAuditLog={addAuditLog}
              />
            )}

            {activeTab === 'marketplace' && (
              <MarketplaceModule
                products={products}
                wallet={userWallet}
                onPurchase={handleMarketplacePurchase}
                onProductStockChange={handleProductStockChange}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'logistics' && (
              <LogisticsModule
                logisticsRequests={logistics}
                wallet={userWallet}
                onCreateRequest={handleCreateLogisticsRequest}
                onUpdateStatus={handleUpdateLogisticsStatus}
                isGuest={currentUserId === 'guest'}
              />
            )}

            {activeTab === 'hotels' && (
              <HotelsModule
                rooms={rooms}
                bookings={bookings}
                wallet={userWallet}
                onBookHotel={handleBookHotel}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'tours' && (
              <ToursModule
                tours={tours}
                bookings={tourBookings}
                wallet={userWallet}
                onBookTour={handleBookTour}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'professionals' && (
              <ProfessionalsModule
                professionals={professionals}
                contracts={contracts}
                wallet={userWallet}
                onHireProfessional={handleHireProfessional}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'eventos' && (
              <EventosModule
                wallet={userWallet}
                onBookItem={handleBookEvent}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'inmobiliaria' && (
              <InmobiliariaModule
                wallet={userWallet}
                onDecreaseWallet={handleDecreaseWallet}
                triggerNotification={triggerNotification}
                isGuest={currentUserId === 'guest'}
              />
            )}

            {activeTab === 'gastronomia' && (
              <GastronomiaModule
                wallet={userWallet}
                onRechargeWallet={(amt) => handleRechargeWallet(amt, 'Recarga de Sinergia Gastronomía')}
                onDecreaseWallet={handleDecreaseWallet}
                triggerNotification={triggerNotification}
              />
            )}

            {activeTab === 'directorio' && (
              <DirectorioModule
                companies={companies}
                onSwitchSession={handleSwitchSession}
              />
            )}

            {activeTab === 'contacto' && (
              <ContactoModule
                onAddAuditLog={addAuditLog}
              />
            )}

            {activeTab === 'wallet' && (
              <WalletModule
                wallet={userWallet}
                transactions={transactions}
                onRecharge={handleRechargeWallet}
                onTransfer={handleTransferWallet}
              />
            )}

            {activeTab === 'chat' && (
              <ChatModule
                channels={channels}
                messages={messages}
                onSendMessage={handleSendMessage}
                onSimulateIncomingMessage={handleSimulateIncomingMessage}
              />
            )}

            {activeTab === 'saas_client' && (
              <SaaSClientPanel
                currentUser={currentUser}
                wallet={userWallet}
                transactions={transactions}
                products={products}
                rooms={rooms}
                tours={tours}
                onRechargeWallet={handleRechargeWallet}
                onTransferWallet={handleTransferWallet}
                onNavigateTab={setActiveTab}
                triggerNotification={triggerNotification}
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}

            {activeTab === 'saas_company' && (
              <SaaSCompanyPanel
                currentUser={currentUser}
                currentCompany={companies.find(c => c.id === currentUser.companyId) || companies[0]}
                products={products}
                users={users}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateCompany={handleUpdateCompany}
                onAddAuditLog={addAuditLog}
                triggerNotification={triggerNotification as any}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                currentRole={currentUser.role}
                companies={companies}
                products={products}
                logistics={logistics}
                auditLogs={auditLogs}
                transactions={transactions}
                wallets={Object.values(wallets)}
                users={users}
                onAddCompany={handleAddCompany}
                onUpdateCompany={handleUpdateCompany}
                onDeleteCompany={handleDeleteCompany}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onAddAuditLog={addAuditLog}
                onUpdateUserProfile={handleUpdateUserProfile}
              />
            )}
          </div>

        </div>

      </main>

      {/* Micro system footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto select-none py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div>
            <p className="font-bold text-slate-600 font-display">Sinergia Connect SaaS Cloud Core</p>
            <p className="text-[10px] text-slate-400 mt-0.5">La Súper App para el crecimiento y digitalización multiempresa.</p>
          </div>
          <div>
            <p className="font-medium font-mono text-[10px]">Términos de servicio y políticas Sandbox de pruebas.</p>
            <p className="text-[9px] text-slate-300 mt-0.5">© 2026 Sinergia Connect. Desarrollado en AI Studio Container.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
