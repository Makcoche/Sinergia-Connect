export type UserRole = 
  | 'super_admin' 
  | 'company_admin' 
  | 'client' 
  | 'driver' 
  | 'tour_operator' 
  | 'hotel_admin' 
  | 'merchant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  companyId?: string; // For business roles
  phone?: string;     // Optional contact phone number
}

export interface Company {
  id: string;
  name: string;
  type: 'logistics' | 'retail' | 'hospitality' | 'tourism' | 'professional';
  status: 'active' | 'suspended';
  logo: string;
  createdAt: string;
  email: string;
  phone: string;
  rating: number;
}

// 1. Marketplace Model
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  stock: number;
  companyId: string; // seller company
  companyName: string;
}

// 2. Logistics & Transport Model
export interface LogisticsRequest {
  id: string;
  type: 'cargo' | 'relocation' | 'refrigerated';
  senderName: string;
  pickupAddress: string;
  deliveryAddress: string;
  cargoDescription: string;
  weightKg: number;
  price: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  driverId?: string;
  driverName?: string;
  companyId: string;
  createdAt: string;
  progress: number; // 0 to 100 for SVG tracer map
}

// 3. Hotels & Lodging Model
export interface HotelRoom {
  id: string;
  hotelId: string;
  hotelName: string;
  name: string;
  type: 'double_refrigerated_themed' | 'suite' | 'deluxe' | 'standard';
  pricePerNight: number;
  capacityMax: number;
  available: boolean;
  image: string;
  amenities: string[];
  location: string;
  rating: number;
}

export interface HotelBooking {
  id: string;
  roomId: string;
  hotelName: string;
  roomName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

// 4. Tourism Packages Model
export interface TourPackage {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  destination: string;
  durationDays: number;
  pricePerPerson: number;
  description: string;
  image: string;
  rating: number;
  included: string[];
  spotsLeft: number;
}

export interface TourBooking {
  id: string;
  tourId: string;
  tourTitle: string;
  customerName: string;
  paxCount: number;
  date: string;
  totalPrice: number;
  status: 'booked' | 'completed' | 'cancelled';
  createdAt: string;
}

// 5. Professional Services Model
export interface ProfessionalService {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  profession: 'electrician' | 'plumber' | 'developer' | 'architect' | 'accountant' | 'graphic_designer' | 'consultant';
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  avatar: string;
  skills: string[];
  bio: string;
}

export interface ServiceContract {
  id: string;
  serviceId: string;
  professionalName: string;
  profession: string;
  clientName: string;
  hoursRequested: number;
  totalPrice: number;
  status: 'pending_approval' | 'active' | 'completed' | 'disputed';
  startDate: string;
  createdAt: string;
}

// 6 & 7. Internal Digital Wallet & Payments
export interface Wallet {
  balanceCodeToken: string; // "SNG" Sinergia Token
  balanceCopUSD: number; // Simulated local equivalent
  userId: string;
  accountNumber: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'recharge' | 'transfer_sent' | 'transfer_received' | 'payment_made' | 'refund';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  referenceId?: string;
}

// 8. Live Chat System
export interface ChatChannel {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

// 9. Push / In-App Notifications
export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'wallet' | 'logistics' | 'booking' | 'chat' | 'system';
  read: boolean;
  timestamp: string;
}

// 10. Admin Audit Logs
export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
