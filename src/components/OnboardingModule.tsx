import React, { useState } from 'react';
import { UserProfile, Company, UserRole, Wallet } from '../types';
import { 
  UserPlus, 
  Building2, 
  Coins, 
  CheckCircle, 
  Fingerprint, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Briefcase,
  HelpCircle,
  TrendingDown,
  Key,
  LogOut,
  Mail,
  ShieldAlert,
  Search,
  Lock,
  PlusCircle,
  Smartphone,
  QrCode,
  Award,
  AlertTriangle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface OnboardingProps {
  users: UserProfile[];
  companies: Company[];
  wallets: Record<string, Wallet>;
  currentUser: UserProfile;
  onRegisterUser: (
    user: Omit<UserProfile, 'id'>, 
    company?: Omit<Company, 'id' | 'createdAt'>
  ) => void;
  onSwitchSession: (userId: string) => void;
  onLogout: () => void;
  onUpdateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export default function OnboardingModule({
  users,
  companies,
  wallets,
  currentUser,
  onRegisterUser,
  onSwitchSession,
  onLogout,
  onUpdateUserProfile,
  onAddAuditLog
}: OnboardingProps) {
  // Tabs within Onboarding
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'accounts' | 'security_kyc'>('login');

  // Security Local State Models
  const [mfaTypeSelect, setMfaTypeSelect] = useState<'sms' | 'email' | 'totp' | 'none'>(currentUser.mfaType || 'none');
  const [totpSimCodeInput, setTotpSimCodeInput] = useState('');
  const [mfaSuccessMsg, setMfaSuccessMsg] = useState('');
  
  // KYC Level 2 Simulation States
  const [idNumberInput, setIdNumberInput] = useState(currentUser.documentId || '');
  const [selfieMockFile, setSelfieMockFile] = useState<string | null>(currentUser.kycDetails?.selfieUrl || null);
  const [docFrontMockFile, setDocFrontMockFile] = useState<string | null>(currentUser.kycDetails?.docFrontUrl || null);
  const [docBackMockFile, setDocBackMockFile] = useState<string | null>(currentUser.kycDetails?.docBackUrl || null);
  const [kycUpgradeStatus, setKycUpgradeStatus] = useState<'idle' | 'analyzing' | 'success'>('idle');

  // KYC Level 3 (Sector vertical) States
  const [sectorKycSelect, setSectorKycSelect] = useState<'general' | 'inmobiliaria' | 'transporte' | 'hotelero' | 'turismo'>('general');
  const [razonSocialInput, setRazonSocialInput] = useState('');
  const [nitInput, setNitInput] = useState('');
  const [camaraComercioFile, setCamaraComercioFile] = useState<boolean>(false);
  const [propertyCardInput, setPropertyCardInput] = useState('');
  const [driverLicenseInput, setDriverLicenseInput] = useState('');
  const [soatInput, setSoatInput] = useState('');
  const [rntLicenseInput, setRntLicenseInput] = useState('');
  const [escrituraInput, setEscrituraInput] = useState('');
  const [certificadoTradicionInput, setCertificadoTradicionInput] = useState('');
  const [level3Status, setLevel3Status] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Anti-fraud dynamic scanning signals
  const [antiFraudWarning, setAntiFraudWarning] = useState<string | null>(null);
  const [phoneInputAlert, setPhoneInputAlert] = useState<string | null>(null);

  // Helper to trace dynamic anti-fraud rules
  const handleEmailAntiFraudScan = (val: string) => {
    const temporalEmails = ['tempmail.com', 'yopmail.com', 'guerrillamail.com', 'temp-mail.org', 'dispostable.com', 'mailinator.com', 'sharklasers.com'];
    const domain = val.split('@')[1];
    if (domain && temporalEmails.includes(domain.toLowerCase())) {
      setAntiFraudWarning('ALERTA ANTIFRAUDE: Correo electrónico temporal o desechable detectado. Esta cuenta podría ser suspendida por riesgo de fraude.');
    } else {
      setAntiFraudWarning(null);
    }
  };

  const handlePhoneAntiFraudScan = (val: string) => {
    const virtualPrefixes = ['+1252', '+1201', '+4470']; // mockup simulator VoIP prefixes
    const cleanPhone = val.trim();
    if (virtualPrefixes.some(pref => cleanPhone.startsWith(pref))) {
      setPhoneInputAlert('ALERTA ANTIFRAUDE: Prefijo número de teléfono virtual VoIP detectado. Se requiere validación biométrica facial mandatoria.');
    } else {
      setPhoneInputAlert(null);
    }
  };

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginFeedback, setLoginFeedback] = useState('');
  const [loginSearchQuery, setLoginSearchQuery] = useState('');

  // Form States - User Registration
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('client');

  // Form States - Tenant Company
  const [registerCompany, setRegisterCompany] = useState(false);
  const [compName, setCompName] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compLogo, setCompLogo] = useState('🏢');

  // Notification success state
  const [successMsg, setSuccessMsg] = useState('');

  // Filtered users for Quick Search login
  const filteredUsersForLogin = users.filter(u => {
    const term = loginSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.role.toLowerCase().includes(term);
  });

  // Handle role change - auto toggle register company for company roles
  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'client') {
      setRegisterCompany(false);
    } else {
      setRegisterCompany(true);
      // Auto-assign logical initial emojis
      if (role === 'merchant') setCompLogo('🛍️');
      else if (role === 'driver') setCompLogo('🚛');
      else if (role === 'hotel_admin') setCompLogo('🏨');
      else if (role === 'tour_operator') setCompLogo('🏔️');
      else setCompLogo('🏢');
    }
  };

  // Login via custom email lookup
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    const matched = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
    if (matched) {
      onSwitchSession(matched.id);
      setSuccessMsg(`¡Sesión iniciada con éxito! Bienvenido de vuelta, ${matched.name}.`);
      setLoginEmail('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setLoginFeedback(`No se encontró ningún usuario registrado con el correo: "${loginEmail}". Revisa el listado o regístrate en la siguiente pestaña.`);
      setTimeout(() => setLoginFeedback(''), 5000);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      alert('Por favor complete los campos obligatorios del perfil.');
      return;
    }

    // Check if email already exists
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (exists) {
      alert('Este correo electrónico ya está registrado. Por favor utiliza otro o inicia sesión.');
      return;
    }

    // Prepare Company structure if requested
    let companyPayload = undefined;
    if (registerCompany && compName) {
      companyPayload = {
        name: compName,
        type: getCompanyTypeFromRole(selectedRole),
        status: 'active' as const,
        logo: compLogo,
        email: email,
        phone: compPhone || '+57 300 123 4567',
        rating: 5.0
      };
    }

    // Determine starter avatar
    const avatars = {
      client: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      merchant: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      driver: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      hotel_admin: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      tour_operator: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      company_admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      super_admin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    };

    const avatarUrl = avatars[selectedRole] || avatars.client;

    onRegisterUser(
      {
        name: fullName,
        email: email.trim(),
        role: selectedRole,
        avatar: avatarUrl
      },
      companyPayload
    );

    setSuccessMsg(`¡Registro de cuenta e inquilino exitoso! Se ha iniciado sesión automáticamente y asignado un Wallet Sandbox con balance de bienvenida.`);
    setFullName('');
    setEmail('');
    setCompName('');
    setCompPhone('');
    
    // Auto transition to accounts
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('accounts');
    }, 3500);
  };

  const getCompanyTypeFromRole = (role: UserRole): Company['type'] => {
    switch (role) {
      case 'merchant': return 'retail';
      case 'driver': return 'logistics';
      case 'hotel_admin': return 'hospitality';
      case 'tour_operator': return 'tourism';
      default: return 'professional';
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const classes = {
      super_admin: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      company_admin: 'bg-blue-100 text-blue-700 border border-blue-200',
      client: 'bg-emerald-100 text-emerald-800 border border-emerald-250',
      driver: 'bg-amber-100 text-amber-800 border border-amber-200',
      tour_operator: 'bg-purple-100 text-purple-700 border border-purple-200',
      hotel_admin: 'bg-sky-100 text-sky-700 border border-sky-200',
      merchant: 'bg-pink-100 text-pink-700 border border-pink-200'
    };
    return classes[role] || 'bg-slate-100 text-slate-700';
  };

  const getRoleLabelEs = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Administrador';
      case 'company_admin': return 'Administrador de Sede';
      case 'client': return 'Cliente Final / Turista';
      case 'driver': return 'Transportador Logístico';
      case 'tour_operator': return 'Operador Turístico';
      case 'hotel_admin': return 'Administrador de Hotel';
      case 'merchant': return 'Comercio Afiliado';
      default: return role;
    }
  };

  const isGuestMode = currentUser.id === 'guest';

  return (
    <div id="onboarding-module" className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      
      {/* Visual Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm">🔑</span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              Portal de Identidad & Sesiones
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1 leading-relaxed">
            Administra tus accesos de pruebas. Elige un perfil regional, simula el cierre de sesión, registra nuevos negocios u opera como invitado en Sinergia Connect.
          </p>
        </div>

        {/* Local Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs w-full lg:w-auto">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 lg:flex-none px-4 py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'login' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Iniciar Sesión
          </button>
          
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 lg:flex-none px-4 py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'register' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Registrar Negocio
          </button>
          
          <button
            onClick={() => setActiveTab('accounts')}
            className={`flex-1 lg:flex-none px-4 py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'accounts' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Directorio ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('security_kyc')}
            className={`flex-1 lg:flex-none px-4 py-2 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'security_kyc' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
            Control de Seguridad & KYC
          </button>
        </div>
      </div>

      {/* Dynamic Status bar of active session */}
      <div className="p-3.5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-slate-50 border-slate-200">
        <div className="flex items-center gap-3 text-xs">
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            {!isGuestMode && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">{currentUser.name}</span>
              <span className={`text-[9px] px-2 py-0.5 font-mono font-bold uppercase rounded ${getRoleBadge(currentUser.role)}`}>
                {getRoleLabelEs(currentUser.role)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isGuestMode 
                ? 'Operando en modo de lectura. Conéctate con una empresa para realizar transacciones.' 
                : `Sesión local activa • Correo: ${currentUser.email}`}
            </p>
          </div>
        </div>

        {/* Action Button for Login/Logout */}
        {!isGuestMode ? (
          <button
            onClick={() => {
              onLogout();
              addLogToAuditSimulated?.('Cierre de Sesión', `El usuario "${currentUser.name}" ha cerrado su sesión actual de forma intencional.`);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión Activa
          </button>
        ) : (
          <span className="text-[10px] uppercase font-mono font-bold bg-slate-200 text-slate-650 px-2.5 py-1 rounded-md">
            Modo Invitado / Desconectado
          </span>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-slate-800">¡Onboarding Exitoso en Sandbox!</p>
            <p className="text-emerald-700 font-medium leading-relaxed mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {/* TAB 1: LOGIN (INICIAR SESIÓN) */}
      {activeTab === 'login' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Email-based direct entry portal */}
          <div className="lg:col-span-5 bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4.5 h-4.5 text-indigo-600" />
              Ingreso por Correo Electrónico
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              Accede a cualquier perfil creado simplemente ingresando su correo afiliado. No necesitas contraseñas en nuestro sandbox de pruebas regional de Urabá.
            </p>

            <form onSubmit={handleEmailLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Correo Registrado</label>
                <input
                  type="email"
                  required
                  placeholder="ej. valeria@gmail.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-slate-800"
                />
              </div>

              {loginFeedback && (
                <p className="p-2.5 bg-rose-50 border border-rose-150 text-rose-800 text-[10.5px] rounded-lg leading-relaxed font-sans">
                  ⚠️ {loginFeedback}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold tracking-wide uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                Ingresar al Ecosistema <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-200/70 space-y-2">
              <h4 className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Reglas del Ecosistema</h4>
              <ul className="space-y-1.5 text-[10.5px] text-slate-600 list-disc pl-3 leading-relaxed">
                <li>Los Comercios ven y administran únicamente su catálogo y facturación.</li>
                <li>Los Hoteles controlan sus habitaciones y reservas de turistas.</li>
                <li>Los Transportadores reciben despachos fletes en tiempo real.</li>
                <li>Los Clientes pueden canjear saldo e interactuar en todos los canales.</li>
              </ul>
            </div>
          </div>

          {/* Quick profile switch grid (Direct portal character grid) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4.5 h-4.5 text-indigo-600" />
                Acceso Rápido • Directorio de Miembros
              </h3>
              
              {/* Profile Filter search */}
              <div className="relative max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar perfil o rol..."
                  value={loginSearchQuery}
                  onChange={(e) => setLoginSearchQuery(e.target.value)}
                  className="pl-8 pr-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredUsersForLogin.map(u => {
                const isSelected = u.id === currentUser.id;
                const company = companies.find(c => c.id === u.companyId);
                const userWallet = wallets[u.id] || { balanceCopUSD: 0 };

                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchSession(u.id);
                      setSuccessMsg(`Conectado como: ${u.name} (${getRoleLabelEs(u.role)})`);
                      setTimeout(() => setSuccessMsg(''), 2500);
                    }}
                    className={`block w-full text-left p-3 rounded-xl border transition-all hover:bg-slate-50/50 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-550/10' 
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-100 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/70 flex justify-between items-center text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-extrabold uppercase ${getRoleBadge(u.role)}`}>
                        {getRoleLabelEs(u.role).substring(0, 18)}
                      </span>
                      <span className="font-mono text-emerald-600 font-bold">
                        ${userWallet.balanceCopUSD.toFixed(1)} USD
                      </span>
                    </div>


                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: REGISTER (REGISTRARSE) */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Info column */}
          <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Socio en Urabá Antioqueño
            </h4>
            
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Sinergia Connect es una plataforma multiempresa para Colombia y Latinoamérica. Al dar de alta un comercio, hotel, o conductor, puedes asociarle un inquilino de marca blanca con reglas de cálculo e inventario propio.
            </p>

            <div className="space-y-3 pt-2 text-[11px] font-sans">
              <div className="flex items-start gap-2.5">
                <span className="p-1.5 bg-white rounded-lg border border-slate-200">💰</span>
                <div>
                  <p className="font-bold text-slate-800 text-xs">Acreditación Inmediata</p>
                  <p className="text-slate-400 mt-0.5">Se asignan $2,500.00 USD de bienvenida ficticia al wallet.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="p-1.5 bg-white rounded-lg border border-slate-200">📊</span>
                <div>
                  <p className="font-bold text-slate-800 text-xs text-indigo-600">Unified Tenancy Model</p>
                  <p className="text-slate-400 mt-0.5">Crea de manera sincronizada la entidad jurídica (Firma/Organización).</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-800 font-medium leading-normal">
              💡 <strong>Acceso Inmediato:</strong> Posterior al envío, tu sesión se conectará automáticamente con esta nueva cuenta para que pruebes el dashboard personalizado.
            </div>
          </div>

          {/* Registration Form container */}
          <div className="lg:col-span-7">
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. José Urdaneta"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="ej. joseu@sinergia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              {/* Ecosystem Role Selection */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Asignar Cargo en el Ecosistema</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {([
                    { val: 'client', label: '👤 Cliente / Turista', desc: 'Comprar, reservar planes, viajar.' },
                    { val: 'merchant', label: '🛍️ Comercio Afiliado', desc: 'Controlar ventas de tienda.' },
                    { val: 'hotel_admin', label: '🏨 Administrador Hotelero', desc: 'Gestionar reservas y cuartos.' },
                    { val: 'tour_operator', label: '🏔️ Operador Turístico', desc: 'Publicar servicios de paquetes.' },
                    { val: 'driver', label: '🚛 Transportador Carga', desc: 'Realizar despachos de flete.' },
                    { val: 'company_admin', label: '💼 Admin de Tenant', desc: 'Acceso a control corporativo.' }
                  ] as const).map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => handleRoleSelection(item.val)}
                      className={`p-2.5 border rounded-xl text-left transition-all ${
                        selectedRole === item.val
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-550/10 font-bold'
                          : 'border-slate-200 hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-800">{item.label}</p>
                      <p className="text-[9.5px] text-slate-400 font-medium leading-snug mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary block: Create Corporation / Tenant */}
              {registerCompany && (
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h5 className="font-bold text-slate-800">Crear Inquilino Multiempresa</h5>
                      <p className="text-[10px] text-slate-400">Daremos de alta tu marca en la base de datos de Sinergia Connect.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Comercial de la Empresa</label>
                      <input
                        type="text"
                        required={registerCompany}
                        placeholder="ej. Bananas del Urabá S.A.S"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Logotipo (Emoji)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={compLogo}
                          onChange={(e) => setCompLogo(e.target.value)}
                          className="w-12 border border-slate-200 rounded-lg p-1.5 text-center text-lg bg-white"
                        />
                        <span className="text-[9.5px] text-slate-400">Mini Logotipo</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">WhatsApp / Contacto de Enlace</label>
                    <input
                      type="text"
                      placeholder="+57 322 998 1209"
                      value={compPhone}
                      onChange={(e) => setCompPhone(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit trigger block */}
              <button
                type="submit"
                id="btn-register-user-onboarding"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Fingerprint className="w-4 h-4" />
                Dar de Alta Cuenta de Pruebas & Iniciar Sesión
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 3: ACTIVE SESSIONS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-xl text-xs text-indigo-900 flex justify-between items-center font-sans font-medium">
            <span>
              🔑 Hay <strong>{users.length} usuarios registrados</strong> en la gobernación comercial de Sinergia Connect.
            </span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-mono font-bold uppercase">Multi-Tenant Activos</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => {
              const uWallet = wallets[u.id] || { balanceCopUSD: 0 };
              const connectedCompany = companies.find(c => c.id === u.companyId);
              const isActiveUser = u.id === currentUser.id;

              return (
                <div 
                  key={u.id} 
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isActiveUser 
                      ? 'border-indigo-600 bg-indigo-50/10 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-slate-150"
                        />
                        {isActiveUser && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-405 font-mono truncate">{u.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1 text-[11px] font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Nivel Acceso:</span>
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase ${getRoleBadge(u.role)}`}>
                          {getRoleLabelEs(u.role)}
                        </span>
                      </div>



                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
                        <span className="text-slate-405 flex items-center gap-0.5">📟 Wallet Virtual:</span>
                        <span className="font-mono text-emerald-600 font-bold">${uWallet.balanceCopUSD.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isActiveUser ? (
                      <span className="w-full py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase text-center block tracking-widest border border-emerald-100 flex items-center justify-center gap-1 select-none">
                        <ShieldCheck className="w-3.5 h-3.5" /> Sesión Conectada
                      </span>
                    ) : (
                      <button
                        onClick={() => onSwitchSession(u.id)}
                        className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-wide flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        Conectar Sesión <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CONTROL DE SEGURIDAD, MFA, ANTIFRAUDE Y KYC INTEGRADO */}
      {activeTab === 'security_kyc' && (
        <div className="space-y-6 text-slate-800 animate-fadeIn select-none">
          
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 p-8 transform translate-x-12 -translate-y-12 bg-indigo-500/10 rounded-full w-48 h-48 blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <span className="p-2.5 bg-indigo-600/30 border border-indigo-500/35 rounded-xl text-indigo-400">
                <Fingerprint className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-400 font-mono">Consola Zero Trust</h3>
                <h2 className="text-lg font-bold">Autenticación Segura & Cumplimiento KYC</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Valida tu identidad, protege tu monedero con MFA y activa tus sellos oficiales de confianza.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: CURRENT STATUS & TRUST BADGES & MFA TUNE */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Card 1: Reputation and trust badges */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Award className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Estado de Confianza</h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nivel Actual Sinergia:</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        currentUser.verifLevel === 3
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : currentUser.verifLevel === 2
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        Nivel {currentUser.verifLevel || 1}: {
                          currentUser.verifLevel === 3 ? 'KYC Completo' : currentUser.verifLevel === 2 ? 'Usuario Verificado' : 'Invitado'
                        }
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sellos de Confianza Activos:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {currentUser.sellos && currentUser.sellos.length > 0 ? (
                        currentUser.sellos.map((sello, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-700 flex items-center gap-1">
                            {sello}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] italic text-slate-400">Ninguno. Por favor completa la verificación biométrica para activar tus primeros sellos.</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onUpdateUserProfile(currentUser.id, { verifLevel: 1, sellos: [], documentId: undefined, isMfaEnabled: false, mfaType: 'none', kycDetails: undefined });
                        setMfaTypeSelect('none');
                        setKycUpgradeStatus('idle');
                        setLevel3Status('idle');
                        onAddAuditLog('Restablecimiento de Credenciales', `El usuario ${currentUser.name} ha restablecido su perfil de KYC a nivel Invitado para simulación.`);
                      }}
                      className="w-full text-center py-1 text-[9.5px] font-black text-rose-600 uppercase border border-rose-100 bg-rose-50/30 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      🔄 Resetear Nivel para Simulación
                    </button>
                    <p className="text-[8.5px] text-slate-400 text-center mt-1">Te permite probar el flujo completo desde el Nivel 1.</p>
                  </div>
                </div>
              </div>

              {/* Card 2: MFA Switchboard */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Autenticación Multifactor</h4>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Elegir Canal de Segundo Factor:</label>
                    <select
                      value={mfaTypeSelect}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setMfaTypeSelect(val);
                        setMfaSuccessMsg('');
                      }}
                      className="w-full border border-slate-200 p-2 rounded-lg bg-slate-50 focus:bg-white text-xs focus:outline-none"
                    >
                      <option value="none">Ninguno (No recomendado - Zero Trust Desactivado)</option>
                      <option value="email">OTP por Correo Electrónico Registrado</option>
                      <option value="sms">OTP por Mensajería de Texto (SMS)</option>
                      <option value="totp">Código Rotativo Autenticador (TOTP App)</option>
                    </select>
                  </div>

                  {mfaTypeSelect === 'totp' && (
                    <div className="space-y-3.5 p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <div className="flex gap-2 items-start">
                        <span className="p-1 px-1.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-black">TOTP</span>
                        <div className="text-[10px] text-indigo-950 font-medium leading-relaxed">
                          Escanea el código QR con Google Authenticator o Microsoft Authenticator:
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center py-2 bg-white rounded-lg border border-indigo-100 max-w-[120px] mx-auto">
                        <QrCode className="w-20 h-20 text-slate-800" />
                        <span className="text-[8.5px] font-mono text-slate-400 mt-1 uppercase">Clave Secret</span>
                      </div>

                      <div className="text-center font-mono text-[9px] select-all bg-emerald-50 text-emerald-800 p-1 border border-emerald-100 rounded">
                        SINERGIA-SECURE-KEY-MFA
                      </div>

                      <div>
                        <label className="block text-[9px] uppercase font-extrabold text-slate-505 mb-1">Ingresa el código temporal de 6 dígitos:</label>
                        <input
                          type="text"
                          placeholder="123456"
                          value={totpSimCodeInput}
                          maxLength={6}
                          onChange={(e) => setTotpSimCodeInput(e.target.value)}
                          className="w-full border border-slate-200 p-1.5 rounded text-center tracking-[0.25em] font-mono font-bold text-xs bg-white text-slate-800 outline-none"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (totpSimCodeInput.length === 6) {
                            onUpdateUserProfile(currentUser.id, { isMfaEnabled: true, mfaType: 'totp', mfaSecret: 'SINERGIACONNECT-AUTH-KEY-XYZ' });
                            setMfaSuccessMsg('✅ Autenticación multifactor TOTP configurada con éxito.');
                            onAddAuditLog('Vinculación MFA exitosa', `El usuario del sistema activó el token de autenticación TOTP de forma segura.`);
                          } else {
                            alert('Introduce un código de 6 números.');
                          }
                        }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold uppercase transition-colors"
                      >
                        Verificar e Iniciar TOTP
                      </button>
                    </div>
                  )}

                  {(mfaTypeSelect === 'email' || mfaTypeSelect === 'sms') && (
                    <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-[10px] text-slate-500 font-medium">
                        {mfaTypeSelect === 'email' 
                          ? `Enviaremos un token OTP de un solo uso a tu correo electrónico: **${currentUser.email}**.`
                          : `Enviaremos un token OTP vía SMS a tu número de contacto registrado.`
                        }
                      </p>

                      {mfaTypeSelect === 'sms' && (
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Número telefónico celular:</label>
                          <input
                            type="text"
                            placeholder="+57 321 000 0000"
                            defaultValue={currentUser.phone || ''}
                            onChange={(e) => handlePhoneAntiFraudScan(e.target.value)}
                            className="w-full border p-1 rounded font-mono text-xs focus:outline-none"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => {
                          onUpdateUserProfile(currentUser.id, { isMfaEnabled: true, mfaType: mfaTypeSelect });
                          setMfaSuccessMsg(`✅ Segundo factor de autenticación por ${mfaTypeSelect === 'email' ? 'Correo' : 'SMS'} activado.`);
                          onAddAuditLog('Activación MFA', `El usuario ${currentUser.name} activó MFA mediante canal ${mfaTypeSelect}.`);
                        }}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold uppercase transition-colors"
                      >
                        Activar MFA por {mfaTypeSelect.toUpperCase()}
                      </button>
                    </div>
                  )}

                  {mfaSuccessMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-850 rounded-lg text-[10px] border border-emerald-100 font-bold">
                      {mfaSuccessMsg}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* COLUMN 2 & 3: MAIN DYNAMIC KYC VERIFIER PANEL */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Anti-Fraud Sandbox Monitor Block */}
              {(antiFraudWarning || phoneInputAlert) && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-xs text-rose-900 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold uppercase text-[10px] text-rose-800">Alerta Antifraude Sinergia Shield</h4>
                    <p className="mt-1 leading-relaxed font-medium">
                      {antiFraudWarning} {phoneInputAlert}
                    </p>
                  </div>
                </div>
              )}

              {/* LEVEL 2: BIOMETRIC PASSPORT / IDENTITY SCAN */}
              {(!currentUser.verifLevel || currentUser.verifLevel === 1) && (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="p-1 px-2 text-[10px] font-mono font-black uppercase text-indigo-700 bg-indigo-50 rounded">Fase 1</span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Nivel 2: Verificación de Identidad Biométrica (Persona Natural)</h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Sinergia Connect opera bajo un esquema **Zero Trust**. Para poder comprar en el Mercado, solicitar fletes de logística o contratar profesionales calificados, debes elevar tu identidad digital al Nivel 2 mediante validación de documento legal y biometría facial anti-suplantación.
                  </p>

                  <div className="space-y-4 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-550 mb-1">Número de Cédula de Ciudadanía Colombiana (o ID legal):</label>
                      <input
                        type="text"
                        placeholder="Ej. CC 10203045"
                        value={idNumberInput}
                        onChange={(e) => setIdNumberInput(e.target.value)}
                        className="w-full border border-slate-200 p-2.5 rounded-lg bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Document photo capture simulator */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <span className="text-[9.5px] uppercase font-bold text-indigo-805 block">1. Documento de Identidad (Anverso + Reverso)</span>
                        
                        <div className="border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 bg-white text-center cursor-pointer min-h-[110px]"
                          onClick={() => {
                            setDocFrontMockFile('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300');
                            onAddAuditLog('Captura documento identidad', 'Captura simulada de anverso del documento.');
                          }}
                        >
                          {docFrontMockFile ? (
                            <div className="text-center font-bold text-emerald-800">
                              <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                              <span className="text-[9.5px]">¡Anverso Cargado Correctamente!</span>
                            </div>
                          ) : (
                            <div>
                              <Smartphone className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                              <span className="text-[9.5px] font-bold text-slate-500 block">Simular Carga de Cédula</span>
                              <span className="text-[8.5px] text-slate-400 mt-0.5 block">Haz clic para capturar foto</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selfie capture simulator */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                        <span className="text-[9.5px] uppercase font-bold text-indigo-805 block">2. Validación Biométrica Facial (Selfie)</span>
                        
                        <div className="border border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-4 bg-white text-center cursor-pointer min-h-[110px]"
                          onClick={() => {
                            setSelfieMockFile('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300');
                            onAddAuditLog('Captura Facial Biométrica', 'Captura simulada de selfie anti-suplantación.');
                          }}
                        >
                          {selfieMockFile ? (
                            <div className="text-center font-bold text-emerald-800">
                              <CheckCircle className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                              <span className="text-[9.5px]">¡Facial Facial Biométrico OK!</span>
                            </div>
                          ) : (
                            <div>
                              <Fingerprint className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                              <span className="text-[9.5px] font-bold text-slate-500 block">Simular Captura Facial Frontal</span>
                              <span className="text-[8.5px] text-slate-400 mt-0.5 block">Haz clic para simular cámara</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {kycUpgradeStatus === 'analyzing' && (
                      <div className="space-y-2 p-4 bg-slate-950 text-emerald-450 rounded-xl font-mono text-[9.5px] border border-slate-800">
                        <div className="flex justify-between font-bold">
                          <span>🔬 ANALIZADOR ANTIFRAUDE SINERGIA:</span>
                          <span className="animate-pulse">PROCESANDO...</span>
                        </div>
                        <p className="text-slate-400">• Extrayendo metadatos de documento legal OCR...</p>
                        <p className="text-slate-400">• Cruzando registros de identidad colombiana...</p>
                        <p className="text-slate-400">• Validando selfie de usuario contra plantilla de documento...</p>
                        <p className="text-slate-200">• Matriz de liveness facial completa: PASSED (99.8%)</p>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                          <div className="bg-emerald-500 h-1.5 rounded-full animate-barProgress"></div>
                        </div>
                      </div>
                    )}

                    {kycUpgradeStatus === 'success' && (
                      <div className="p-4 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200 space-y-1">
                        <p className="font-extrabold text-[11px] uppercase tracking-wide text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> ¡Identidad Elevada a Nivel 2!
                        </p>
                        <p className="text-[10px] leading-relaxed">
                          La validación biométrica se ha completado con éxito. Se te ha asignado el sello de **🟢 Usuario Verificado** y tu billetera ha recibido su respectiva actualización de políticas.
                        </p>
                      </div>
                    )}

                    {kycUpgradeStatus === 'idle' && (
                      <button
                        onClick={() => {
                          if (!idNumberInput.trim()) {
                            alert('Introduce tu número de identificación legal.');
                            return;
                          }
                          if (!docFrontMockFile || !selfieMockFile) {
                            alert('Debes simular la carga/captura de la cédula y la selfie haciendo clic en cada recuadro.');
                            return;
                          }

                          setKycUpgradeStatus('analyzing');
                          setTimeout(() => {
                            setKycUpgradeStatus('success');
                            onUpdateUserProfile(currentUser.id, {
                              verifLevel: 2,
                              documentId: idNumberInput,
                              sellos: ['🟢 Usuario Verificado'],
                              kycDetails: {
                                status: 'verified',
                                selfieUrl: selfieMockFile,
                                docFrontUrl: docFrontMockFile,
                                submittedAt: new Date().toISOString()
                              }
                            });
                            onAddAuditLog('Promoción a Nivel 2', `Usuario ${currentUser.name} completó biometría facial e ID: ${idNumberInput}. Sello otorgado.`);
                          }, 2500);
                        }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase transition-colors tracking-widest text-[10.5px]"
                      >
                        Iniciar Verificación de Identidad Biométrica
                      </button>
                    )}

                  </div>
                </div>
              )}

              {/* LEVEL 3: SECTOR VERIFICATION LOGIC */}
              {currentUser.verifLevel === 2 && (
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
                  
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="p-1 px-2 text-[10px] font-mono font-black uppercase text-purple-700 bg-purple-50 rounded">Fase 2</span>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-850">Nivel 3: Verificación Corporativa & Especialidades Sectoriales</h4>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    **¡Felicidades, eres un Usuario Verificado!** Para poder vender productos en el Marketplace, publicar inmuebles, registrar vehículos de carga en Transporte, o rentar residencias en Hotelería, debes habilitar tu habilitación sectorial de Nivel 3.
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <label className="block text-[10.5px] uppercase font-extrabold text-slate-600">Seleccione tu Sector Vertical Destino:</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[10px] font-bold">
                      {(['general', 'inmobiliaria', 'transporte', 'hotelero', 'turismo'] as const).map(sect => (
                        <button
                          key={sect}
                          onClick={() => setSectorKycSelect(sect)}
                          type="button"
                          className={`p-2 border rounded-lg uppercase tracking-wider text-center cursor-pointer transition-colors ${
                            sectorKycSelect === sect
                              ? 'bg-purple-600 text-white border-purple-750 font-black'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {sect === 'general' ? 'General' : sect}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!nitInput.trim() || !razonSocialInput.trim()) {
                      alert('Digita el NIT y la Razón Social de tu negocio.');
                      return;
                    }

                    // Enforce rule inputs
                    if (sectorKycSelect === 'hotelero' && !rntLicenseInput.trim()) {
                      alert('El Registro Nacional de Turismo (RNT) es obligatorio para Hotelería.');
                      return;
                    }
                    if (sectorKycSelect === 'turismo' && !rntLicenseInput.trim()) {
                      alert('El RNT es obligatorio para Operadores Turísticos.');
                      return;
                    }
                    if (sectorKycSelect === 'transporte' && (!driverLicenseInput.trim() || !soatInput.trim())) {
                      alert('La licencia y el SOAT son obligatorios para Transporte de Carga.');
                      return;
                    }
                    if (sectorKycSelect === 'inmobiliaria' && (!escrituraInput.trim() || !certificadoTradicionInput.trim())) {
                      alert('La escritura y el certificado son obligatorios para publicar Inmuebles.');
                      return;
                    }

                    setLevel3Status('submitting');
                    
                    setTimeout(() => {
                      setLevel3Status('success');
                      
                      // Promote User to Level 3 and add sector tags
                      const initialSellos = ['🟢 Usuario Verificado', '🔵 Empresa Verificada', '🟣 KYC Completo'];
                      if (sectorKycSelect === 'inmobiliaria') initialSellos.push('🏢 Aliado Inmobiliario');
                      if (sectorKycSelect === 'transporte') initialSellos.push('🚚 Flota Autorizada');
                      if (sectorKycSelect === 'hotelero') initialSellos.push('🏨 Hotel de Confianza');
                      if (sectorKycSelect === 'turismo') initialSellos.push('🎒 Guía Certificado');

                      onUpdateUserProfile(currentUser.id, {
                        verifLevel: 3,
                        sellos: initialSellos,
                        kycDetails: {
                          ...currentUser.kycDetails,
                          status: 'verified',
                          razonSocial: razonSocialInput,
                          nit: nitInput,
                          soat: soatInput || undefined,
                          licenciaConducir: driverLicenseInput || undefined,
                          tarjetaPropiedad: propertyCardInput || undefined,
                          rnt: rntLicenseInput || undefined,
                          escrituraUrl: escrituraInput || undefined,
                          certificadoTradicionUrl: certificadoTradicionInput || undefined,
                          specificSectors: [sectorKycSelect === 'general' ? 'inmobiliaria' : sectorKycSelect as any]
                        }
                      });

                      onAddAuditLog('Promoción Corporativa Nivel 3', `Empresa promovida a Nivel 3. NIT: ${nitInput}, Razón Social: ${razonSocialInput}. Sector habilitado: ${sectorKycSelect}.`);
                    }, 2000);

                  }} className="space-y-4 text-xs font-sans">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Razón Social Jurídica:</label>
                        <input
                          type="text"
                          placeholder="Sinergia Commercial S.A.S"
                          value={razonSocialInput}
                          onChange={(e) => setRazonSocialInput(e.target.value)}
                          className="w-full border border-slate-200 p-2 rounded focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">NIT Comercial / RUT Empresa:</label>
                        <input
                          type="text"
                          placeholder="Ej. 901.222.111-9"
                          value={nitInput}
                          onChange={(e) => setNitInput(e.target.value)}
                          className="w-full border border-slate-200 p-2 rounded focus:outline-none font-mono"
                          required
                        />
                      </div>
                    </div>

                    {/* Sector dependent uploads details */}
                    {sectorKycSelect === 'general' && (
                      <div className="p-4 bg-purple-50/40 border border-purple-100 rounded-xl space-y-2">
                        <span className="text-[10px] uppercase font-black text-purple-800">Requerimiento General:</span>
                        <p className="text-[11px] text-slate-500">Cargar tu RUT y Cámara de Comercio (formato PDF certificado, vigencia menor a 30 días).</p>
                        <button
                          type="button"
                          onClick={() => setCamaraComercioFile(true)}
                          className="px-3 py-1 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] rounded hover:bg-slate-50"
                        >
                          {camaraComercioFile ? '✅ camara_comercio.pdf Adjuntado' : '📎 Subir Certificado PDF'}
                        </button>
                      </div>
                    )}

                    {sectorKycSelect === 'inmobiliaria' && (
                      <div className="p-4 bg-purple-50/45 border border-purple-150 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase font-black text-purple-800">Prerrequisito Inmobiliaria:</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          La publicación de inmuebles (venta/arriendo) exige la escritura de propiedad y el certificado de libertad actual.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Número de Escritura Pública:</label>
                            <input
                              type="text"
                              value={escrituraInput}
                              onChange={(e) => setEscrituraInput(e.target.value)}
                              placeholder="Escritura No. 2212 de Notaría Urabá"
                              className="w-full border p-1 rounded font-mono text-[11px] bg-white focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Código Tradición y Libertad:</label>
                            <input
                              type="text"
                              value={certificadoTradicionInput}
                              onChange={(e) => setCertificadoTradicionInput(e.target.value)}
                              placeholder="Matrícula Inmobiliaria 040-XXXXX"
                              className="w-full border p-1 rounded font-mono text-[11px] bg-white focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {sectorKycSelect === 'transporte' && (
                      <div className="p-4 bg-purple-50/45 border border-purple-150 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase font-black text-purple-800">Prerrequisito Transporte & Logística:</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Habilita tu camión o flota en la grilla de transportadores adjuntando tarjeta, seguro obligatorio y tu licencia de conductor pesada.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Licencia Conducir (C2/C3):</label>
                            <input
                              type="text"
                              value={driverLicenseInput}
                              onChange={(e) => setDriverLicenseInput(e.target.value)}
                              placeholder="Ej. CC-102030"
                              className="w-full border p-1 rounded font-mono text-[11px] bg-white focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Poliza de Seguro SOAT:</label>
                            <input
                              type="text"
                              value={soatInput}
                              onChange={(e) => setSoatInput(e.target.value)}
                              placeholder="Seguros Colombia No. S-44"
                              className="w-full border p-1 rounded font-mono text-[11px] bg-white focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-600">Licencia de Tránsito:</label>
                            <input
                              type="text"
                              value={propertyCardInput}
                              onChange={(e) => setPropertyCardInput(e.target.value)}
                              placeholder="Tarjeta No. TP-99"
                              className="w-full border p-1 rounded font-mono text-[11px] bg-white focus:outline-none font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {(sectorKycSelect === 'hotelero' || sectorKycSelect === 'turismo') && (
                      <div className="p-4 bg-purple-50/45 border border-purple-150 rounded-xl space-y-3">
                        <span className="text-[10px] uppercase font-black text-purple-800">Prerrequisito Hotelero & Tours:</span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          De acuerdo con la legislación colombiana (Ley de Turismo), todos los prestadores de hospedaje u operadores turísticos deben poseer RNT activo.
                        </p>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-600">Código Registro Nacional de Turismo (RNT):</label>
                          <input
                            type="text"
                            value={rntLicenseInput}
                            onChange={(e) => setRntLicenseInput(e.target.value)}
                            placeholder="Ej. RNT-45521"
                            className="w-full border border-slate-200 p-2 rounded font-mono text-xs focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {level3Status === 'submitting' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-[10px] font-mono text-emerald-400">
                        <p className="animate-pulse">⏳ ANALIZANDO MATRICULAS FISCALES Y CERTIFICADOS SECTORIALES EN TIEMPO REAL...</p>
                        <p className="text-slate-500 mt-1">• Consultando base de datos RNT de Ministerio de Comercio...</p>
                        <p className="text-slate-500">• Verificando validez de NIT contra base nacional DIAN...</p>
                        <p className="text-slate-500">• Revisando historiales de multas de vehículos en RUNT...</p>
                        <p className="text-slate-200">• Verificación Corporativa completa. Estatus: EXCELENTE.</p>
                      </div>
                    )}

                    {level3Status === 'success' && (
                      <div className="p-4 bg-purple-50 text-purple-950 rounded-xl border border-purple-200 space-y-1">
                        <p className="font-extrabold text-[11px] uppercase tracking-wide text-purple-800 flex items-center justify-between">
                          <span>🎉 ¡Habilitación Nivel 3 Registrada!</span>
                          <span className="px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded text-[9.5px]">Corporativo Sinergía</span>
                        </p>
                        <p className="text-[10px] leading-relaxed text-slate-700">
                          Tu solicitud corporativa ha sido verificada. Tus sellos de confianza corporativa **🔵 Empresa Verificada** y **🟣 KYC Completo** están activos para el sector **{sectorKycSelect.toUpperCase()}**.
                        </p>
                      </div>
                    )}

                    {level3Status === 'idle' && (
                      <button
                        type="submit"
                        className="w-full py-3 bg-purple-650 hover:bg-purple-700 text-white rounded-xl font-bold uppercase transition-colors tracking-wider text-[10.5px]"
                      >
                        Someter Documentación Corporativa para Nivel 3
                      </button>
                    )}

                  </form>
                </div>
              )}

              {/* IS ALREADY LEVEL 3 DISPLAY */}
              {currentUser.verifLevel === 3 && (
                <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl border border-indigo-800 shadow-lg relative overflow-hidden space-y-4">
                  <div className="absolute -top-12 -right-12 bg-white/5 w-32 h-32 rounded-full blur-xl"></div>
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-white/10 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-emerald-405 text-emerald-400" />
                    </span>
                    <div>
                      <h4 className="font-mono text-[10px] uppercase font-black tracking-widest text-indigo-200">Zero Trust Safe Badge</h4>
                      <h2 className="text-lg font-bold">Identidad Totalmente Convalidada</h2>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-150 leading-relaxed font-sans text-indigo-200">
                    Tu cuenta posee el nivel máximo de verificación **Nivel 3: KYC Completo**. Estás completamente autorizado para comerciar, publicar inmuebles, operar hoteles, prestar transporte de fletes logísticos pesados, y realizar transacciones de liquidación financiera internacional en *Sinergia Connect*.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-indigo-205 block text-indigo-300">Razón Social:</span>
                      <strong className="text-xs font-mono">{currentUser.kycDetails?.razonSocial || 'Persona Natural'}</strong>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-indigo-205 block text-indigo-300">NIT / ID Legal:</span>
                      <strong className="text-xs font-mono">{currentUser.kycDetails?.nit || currentUser.documentId || ' CC 1020'}</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// Simulated logger helper inside component scope to prevent crashes
const addLogToAuditSimulated = (action: string, details: string) => {
  console.log(`[Audit Sim] Action: ${action} - Details: ${details}`);
};
