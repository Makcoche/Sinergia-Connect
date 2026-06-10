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
}

export default function OnboardingModule({
  users,
  companies,
  wallets,
  currentUser,
  onRegisterUser,
  onSwitchSession,
  onLogout
}: OnboardingProps) {
  // Tabs within Onboarding
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'accounts'>('login');

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

    </div>
  );
}

// Simulated logger helper inside component scope to prevent crashes
const addLogToAuditSimulated = (action: string, details: string) => {
  console.log(`[Audit Sim] Action: ${action} - Details: ${details}`);
};
