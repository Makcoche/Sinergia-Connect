import React, { useState } from 'react';
import { Company, Product, UserProfile, Transaction } from '../types';
import { 
  Building2, 
  Package, 
  Briefcase, 
  Calendar, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Edit, 
  Save,
  CheckCircle,
  Plus,
  Trash2,
  X,
  CreditCard,
  Lock,
  Share2,
  Bot,
  Sliders,
  Send,
  MessageSquare,
  Video,
  FolderOpen,
  Award,
  Network,
  GitBranch,
  Laptop
} from 'lucide-react';

interface SaaSCompanyPanelProps {
  currentUser?: UserProfile;
  currentCompany: Company;
  products: Product[];
  users: UserProfile[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateCompany: (id: string, updates: Partial<Company>) => void;
  onAddAuditLog: (action: string, details: string) => void;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

export default function SaaSCompanyPanel({
  currentUser,
  currentCompany,
  products,
  users,
  onAddProduct,
  onDeleteProduct,
  onUpdateCompany,
  onAddAuditLog,
  triggerNotification
}: SaaSCompanyPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    | 'profile'
    | 'products'
    | 'orders'
    | 'billing'
    | 'stats'
    | 'marketing'
    | 'branches'
    | 'documents'
    | 'internal'
    | 'bi'
    | 'growth'
  >('profile');

  // --- SOCIAL MARKETING & HUB ---
  const [socialConnections, setSocialConnections] = useState<Record<string, { connected: boolean; handle: string }>>({
    Facebook: { connected: true, handle: '@sinergiaconnect' },
    Instagram: { connected: true, handle: '@sinergiaconnect.app' },
    'WhatsApp Business': { connected: false, handle: '+57 321 000 0000' },
    TikTok: { connected: false, handle: '@sinergia_tiktok' },
    LinkedIn: { connected: true, handle: 'Sinergia Connect Latam' },
    YouTube: { connected: false, handle: 'Sinergia Ecosistema Channel' },
    Telegram: { connected: false, handle: '@sinergiabot' },
    'Google Business Profile': { connected: true, handle: 'Sinergia Connect HQ' },
    X: { connected: true, handle: '@SinergiaConnect' }
  });

  const [marketingCopy, setMarketingCopy] = useState('');
  const [targetSocials, setTargetSocials] = useState<string[]>(['Facebook', 'Instagram']);
  const [scheduledDate, setScheduledDate] = useState('2026-06-11');
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [postsList, setPostsList] = useState<any[]>([
    { id: 'pst-1', copy: '¡Visita nuestra tienda oficial en Sinergia Connect y obtén 15% de descuento en fletes!', channels: ['Facebook', 'Instagram'], date: '2026-06-10 18:00', status: 'published' },
    { id: 'pst-2', copy: 'Lanzamiento de nuevas soluciones SaaS para empresas multi-sucursal en Colombia.', channels: ['LinkedIn', 'Google Business Profile'], date: '2026-06-12 10:00', status: 'scheduled' }
  ]);

  // Unified Inbox messages (Facebook, IG, WhatsApp, Telegram)
  const [inboxMessages, setInboxMessages] = useState<any[]>([
    { id: 'msg-1', channel: 'WhatsApp', sender: 'Juan Carlos (Cliente)', text: 'Hola, ¿tienen stock disponible del Control Remoto Comando?', time: 'Hace 5 min', replies: [] },
    { id: 'msg-2', channel: 'Instagram', sender: 'María Lucía', text: 'Me interesa la propuesta del modelo Zero Trust. ¿Tienen manuales?', time: 'Hace 1 hora', replies: [] },
    { id: 'msg-3', channel: 'Facebook Messenger', sender: 'Felipe Giraldo', text: '¿Trabajan los fines de semana en la sede de Envigado?', time: 'Hace 3 horas', replies: [] }
  ]);
  const [activeInboxId, setActiveInboxId] = useState('msg-1');
  const [inboxReplyText, setInboxReplyText] = useState('');

  // Social CRM Leads & Comments Logger
  const [socialCRMCount, setSocialCRMCount] = useState(34);
  const [socialCRMLeads, setSocialCRMLeads] = useState<any[]>([
    { id: 'ld-1', name: 'Alfonso Reyes', source: 'WhatsApp API', keyword: 'PROMO_FLETE', phone: '+57 312 400 9012', status: 'Capturado', date: '2026-06-10 16:45' },
    { id: 'ld-2', name: 'Laura Restrepo', source: 'ManyChat Flow', keyword: 'PRECIO_COMANDO', phone: 'laura@restr.co', status: 'En Seguimiento', date: '2026-06-10 15:20' },
    { id: 'ld-3', name: 'Gabriel Barbosa', source: 'Meta API', keyword: 'NIVEL_3_KYC', phone: 'gabriel.barbosa@outlook.com', status: 'Interesado', date: '2026-06-09 11:10' }
  ]);

  // Automatización Config
  const [automationKeywords, setAutomationKeywords] = useState<any[]>([
    { id: 'kw-1', trigger: 'precio', channel: 'WhatsApp Cloud API', response: 'Hola, gracias por escribirnos. El precio del Control Remoto es de $22.00 USD. ¿Deseas ordenar?', status: true, leadsCaptured: 18 },
    { id: 'kw-2', trigger: 'catalogo', channel: 'ManyChat Flow', response: '¡Hola! Te compartimos nuestro catálogo multisucursal oficial de Sinergia Connect: click.ly/sinergia-catalogo', status: true, leadsCaptured: 27 },
    { id: 'kw-3', trigger: 'ubicacion', channel: 'Meta API', response: 'Nuestra Casa Matriz está en El Poblado, Medellín, y contamos con 3 sucursales adicionales.', status: false, leadsCaptured: 0 }
  ]);

  // AI Content Generator Engine
  const [aiIndustry, setAiIndustry] = useState('Tecnología / SaaS');
  const [aiObjective, setAiObjective] = useState('Generar ventas directas');
  const [aiKeywords, setAiKeywords] = useState('innovación, eficiencia, automatización, SNG Token');
  const [aiIsGenerating, setAiIsGenerating] = useState(false);
  const [aiGeneratedResult, setAiGeneratedResult] = useState('');

  // --- MULTISUCURSAL STATE ---
  const [branches, setBranches] = useState<any[]>([
    { id: 'br-1', name: 'Sinergia Casa Matriz - El Poblado', type: 'Casa Matriz', address: 'Cra 43A #1-50, Medellín', manager: 'Valeria Restrepo', phone: '+57 301 928 2912', status: 'Abierto' },
    { id: 'br-2', name: 'Sede Comercial Nordeste - Envigado', type: 'Sucursal', address: 'Calle 10 Sur #48-20, Envigado', manager: 'Manuel Torres', phone: '+57 320 881 0022', status: 'Abierto' },
    { id: 'br-3', name: 'Centro de Distribución - Rionegro', type: 'Punto de Venta / Despacho', address: 'Zona Franca Rionegro, Bodega 4', manager: 'Lina Maria', phone: '+57 311 552 2341', status: 'Abierto' }
  ]);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchType, setNewBranchType] = useState('Sucursal');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchManager, setNewBranchManager] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  // Independent Inventory per succursal
  const [branchInventory, setBranchInventory] = useState<Record<string, Record<string, number>>>({
    'br-1': { 'Control Remoto Comando': 40, 'Sensor Capacitivo SNG': 15 },
    'br-2': { 'Control Remoto Comando': 15, 'Sensor Capacitivo SNG': 5 },
    'br-3': { 'Control Remoto Comando': 150, 'Sensor Capacitivo SNG': 50 }
  });

  // --- DOCUMENT MANAGER ---
  const [documents, setDocuments] = useState<any[]>([
    { id: 'doc-1', name: 'Contrato_Afiliacion_Sinergia_SaaS.pdf', type: 'Contrato', size: '2.4 MB', uploadedBy: 'Super Admin', uploadedAt: '2026-06-09 11:30', permission: 'Solo Administradores' },
    { id: 'doc-2', name: 'Resolución_Cumplimiento_Regulatorio.pdf', type: 'Certificado', size: '1.1 MB', uploadedBy: 'Diana Restrepo', uploadedAt: '2026-06-08 15:45', permission: 'Inquilinos Autorizados' },
    { id: 'doc-3', name: 'Manual_Operativo_Multisucursal_v2.pdf', type: 'Manual', size: '4.8 MB', uploadedBy: 'Manuel Torres', uploadedAt: '2026-06-10 10:12', permission: 'Público General' }
  ]);
  const [fileToUpload, setFileToUpload] = useState<any>(null);
  const [docTypeChoice, setDocTypeChoice] = useState('Contrato');
  const [docPermChoice, setDocPermChoice] = useState('Solo Administradores');

  // --- INTERNAL COMMUNICATION ---
  const [internalChannel, setInternalChannel] = useState('#general');
  const [internalMessages, setInternalMessages] = useState<any[]>([
    { id: 'im-1', sender: 'Valeria Restrepo (Socio)', text: 'Equipo, recuerden revisar la documentación KYC para asegurar la promoción de Sello nivel 3.', time: '09:15 AM' },
    { id: 'im-2', sender: 'Manuel Torres (Logística)', text: 'Listo Valeria. El inventario de Rionegro ya está conectado en el nuevo módulo de Sucursales.', time: '09:22 AM' },
    { id: 'im-3', sender: 'Lina Maria', text: 'Hoy tenemos reunión de Business Intelligence a las 3:00 PM.', time: '10:05 AM' }
  ]);
  const [internalInputMsg, setInternalInputMsg] = useState('');

  // Videocall simulator
  const [isCalling, setIsCalling] = useState(false);
  const [callMicOn, setCallMicOn] = useState(true);
  const [callCamOn, setCallCamOn] = useState(true);
  const [callTimer, setCallTimer] = useState('00:00');

  // --- BUSINESS INTELLIGENCE (BI) SELECTED KPI REPORT ---
  const [biTimeRange, setBiTimeRange] = useState('Este Mes');
  const [biReportType, setBiReportType] = useState('Ventas & Crecimiento');
  const [isBiCompiling, setIsBiCompiling] = useState(false);
  const [compiledBiReport, setCompiledBiReport] = useState<string | null>(null);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentCompany.name);
  const [editPhone, setEditPhone] = useState(currentCompany.phone);
  const [editEmail, setEditEmail] = useState(currentCompany.email);
  const [editLogo, setEditLogo] = useState(currentCompany.logo);

  // New products modal state
  const [showAddProd, setShowAddProd] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('Electrónica');
  const [newProdStock, setNewProdStock] = useState('30');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Scoped lists - ONLY products/data belonging to THIS company
  const companyProducts = products.filter(p => p.companyId === currentCompany.id);

  // Simulated orders for this company
  const simulatedOrders = [
    { id: 'ORD-8041', product: 'Control Remoto Comando', client: 'Valeria Restrepo', qty: 2, total: 44.00, status: 'completed', date: '2026-06-10' },
    { id: 'ORD-5542', product: 'Sensor Capacitivo SNG', client: 'Carlos Mendoza', qty: 1, total: 110.00, status: 'processing', date: '2026-06-09' }
  ];

  // Simulated billing logs
  const commissionsSum = companyProducts.reduce((acc, p) => acc + (p.price * 0.15), 0) + 40;
  const grossIncome = (companyProducts.length * 480) + 154;
  const netEarnings = grossIncome - commissionsSum;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(currentCompany.id, {
      name: editName,
      phone: editPhone,
      email: editEmail,
      logo: editLogo
    });
    setIsEditingProfile(false);
    onAddAuditLog('Perfil Corporativo Editado', `Inquilino "${editName}" actualizó sus datos comerciales.`);
    triggerNotification('Perfil Actualizado', 'Los cambios en tu perfil SaaS han sido propagados.', 'system' as any);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProdPrice);
    const stock = parseInt(newProdStock);

    if (!newProdName || isNaN(price) || isNaN(stock)) {
      alert('Favor digita datos correctos.');
      return;
    }

    onAddProduct({
      name: newProdName,
      price,
      stock,
      category: newProdCat,
      description: newProdDesc || 'Sin descripción corporativa.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80',
      rating: 5.0,
      companyId: currentCompany.id,
      companyName: currentCompany.name
    });

    onAddAuditLog('Producto Tenant Creado', `Empresa ${currentCompany.name} añadió un producto al catálogo: "${newProdName}"`);
    setShowAddProd(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
  };

  return (
    <div id="saas-company-panel" className="bg-slate-50 p-6 rounded-2xl border border-slate-205 space-y-6">
      
      {/* SaaS Co Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 bg-indigo-50 border border-indigo-100 rounded-2xl">{currentCompany.logo || '🏢'}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{currentCompany.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Tenant {currentCompany.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Consola de Control SaaS Empresarial • ID Inquilino: {currentCompany.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Subtab selection Buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-200/55 border border-slate-200/80 p-1.5 rounded-xl text-[10.5px] max-w-full">
          {([
            { id: 'profile', label: 'Mi Perfil' },
            { id: 'products', label: 'Mis Productos' },
            { id: 'orders', label: 'Pedidos / Reservas' },
            { id: 'marketing', label: '📢 Hub Social & RRSS' },
            { id: 'branches', label: '🏢 Multi-Sucursal' },
            { id: 'documents', label: '📁 Gestión Documental' },
            { id: 'internal', label: '💬 Comunicación' },
            { id: 'bi', label: '📊 BI Inteligencia' },
            { id: 'growth', label: '🚀 Plan Crecimiento' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main SaaS sections details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200">
        
        {/* TAB 1: Profile View or edit form */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1">
                <Building2 className="w-4 h-4 text-indigo-600" /> Perfil Empresarial Autorizado
              </h3>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 text-[10.5px] font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Editar Datos
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs select-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Nombre Comercial</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Emoji Logotipo</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white text-center focus:outline-none"
                      value={editLogo}
                      onChange={(e) => setEditLogo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Contacto Telefónico</label>
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Correo de Enlace</label>
                    <input
                      type="email"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-slate-50 text-[10px] font-bold text-slate-550 uppercase"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Guardar Conexión
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans text-slate-655">
                <div className="space-y-3.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-150">
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Nombre Comercial:</span> <strong className="text-slate-800">{currentCompany.name}</strong></p>
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Estructura SaaS:</span> <strong className="text-indigo-600 font-mono text-[10px] uppercase">{currentCompany.type}</strong></p>
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Identificador:</span> <strong className="font-mono text-[10px]">{currentCompany.id}</strong></p>
                  <p className="flex justify-between font-medium"><span>Calificación de satisfacción:</span> <strong className="text-amber-500 flex items-center gap-0.5">⭐ {currentCompany.rating.toFixed(1)}</strong></p>
                </div>

                <div className="space-y-3.5 p-4 bg-slate-50/50 rounded-2xl border border-slate-155">
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Correo Enlace:</span> <strong className="text-slate-800">{currentCompany.email}</strong></p>
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Teléfono Directo:</span> <strong className="text-slate-800">{currentCompany.phone}</strong></p>
                  <p className="border-b border-slate-200/50 pb-2 flex justify-between font-medium"><span>Fecha de Registro:</span> <strong className="font-mono font-medium">{currentCompany.createdAt || 'Y-Y-D'}</strong></p>
                  <p className="flex justify-between font-medium"><span>Plataforma Marca Blanca:</span> <strong className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9.5px]">Sinergia Connect</strong></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Private product directory (No seeing others) */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            {(currentUser?.verifLevel || 1) < 3 ? (
              <div className="p-6 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 space-y-3 max-w-xl mx-auto my-6 text-center shadow-xs">
                <Lock className="w-10 h-10 text-rose-500 mx-auto animate-bounce" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Publicación Suspendida - Control de Fraude KYC</h3>
                <p className="text-xs text-rose-650 leading-relaxed font-sans font-medium">
                  De acuerdo con el modelo de seguridad <strong>Zero Trust</strong> de Sinergia Connect, únicamente las empresas y comercios con <strong>Nivel 3 (KYC Corporativo Completo)</strong> tienen privilegios de publicación de catálogo comercial.
                </p>
                <div className="p-3.5 bg-white/70 rounded-xl text-[10px] text-slate-500 italic text-left space-y-1">
                  <span>Tu nivel de verificación actual: <strong className="text-rose-650 font-bold uppercase">Nivel {currentUser?.verifLevel || 1}</strong></span>
                  <br />
                  <span>Para solucionarlo, ve al panel de <strong>"Control de Seguridad & KYC"</strong> en tu cuenta y sube la documentación de tu sector. Podrás promover tu cuenta de inmediato o solicitar aprobación al administrador de la red.</span>
                </div>
              </div>
            ) : (
              <>
                <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1">
                      <Package className="w-4 h-4 text-emerald-600" /> Mi Inventario de Catálogo
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Solo verás y editarás tus propios productos.</p>
                  </div>

                  <button
                    onClick={() => setShowAddProd(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-extrabold uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Registrar Producto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-slate-600">
                  {companyProducts.map(p => (
                    <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <span className="font-mono text-[10px] text-indigo-700 font-extrabold">${p.price.toFixed(2)} USD</span>
                          <button
                            onClick={() => { onDeleteProduct(p.id); }}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                            title="Desincorporar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-extrabold text-slate-805 text-xs mt-2 line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] text-slate-405 mt-1 line-clamp-2">{p.description}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200/50 flex justify-between text-[10px]">
                        <span className="font-bold text-slate-500">Unidades: <strong>{p.stock}u</strong></span>
                        <span className="bg-slate-200 text-slate-650 px-1.5 py-0.5 rounded font-bold uppercase">{p.category}</span>
                      </div>
                    </div>
                  ))}

                  {companyProducts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-xs text-slate-405">
                      No tienes productos cargados en tu catálogo. Presiona "Registrar Producto" para comenzar.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: Scoped Orders & Bookings */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1">
                <FileText className="w-4 h-4 text-indigo-650" /> Bitácora de Pedidos Directos
              </h3>
              <p className="text-[10px] text-slate-400">Ordenes de compra o reservas registradas localmente en su tenant sandbox.</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px] text-slate-605">
                <thead>
                  <tr className="border-b bg-slate-50 uppercase font-bold text-slate-400">
                    <th className="py-2.5 px-4 font-mono select-none">ID Pedido</th>
                    <th className="py-2.5 px-4">Fecha</th>
                    <th className="py-2.5 px-4">Comprador</th>
                    <th className="py-2.5 px-4">Producto</th>
                    <th className="py-2.5 px-4 text-center">Unidades</th>
                    <th className="py-2.5 px-4 text-right">Sumatoria Total</th>
                    <th className="py-2.5 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {simulatedOrders.map(ord => (
                    <tr key={ord.id} className="hover:bg-slate-50/10">
                      <td className="py-3 px-4 font-bold font-mono text-slate-700">{ord.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{ord.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{ord.client}</td>
                      <td className="py-3 px-4 truncate max-w-[120px]">{ord.product}</td>
                      <td className="py-3 px-4 text-center font-bold">{ord.qty}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-500">${ord.total.toFixed(2)} USD</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          ord.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Billing Summary & Commissions */}
        {activeSubTab === 'billing' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1">
                <CreditCard className="w-4 h-4 text-rose-600" /> Liquidación y Retención de Comisiones
              </h3>
              <p className="text-[10px] text-slate-400">Balance y cálculo fiscal de comisiones pactadas en marca blanca (15% Red).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 bg-slate-55 border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-450 block text-[9.5px] uppercase font-bold">Venta Bruta Global</span>
                <span className="font-mono text-lg font-black text-slate-800">${grossIncome.toFixed(2)} USD</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                <span className="text-amber-80 * 2 font-bold block text-[9.5px] uppercase">Retención Sinergia (15%)</span>
                <span className="font-mono text-lg font-black text-amber-700">${commissionsSum.toFixed(2)} USD</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-1">
                <span className="text-emerald-750 font-bold block text-[9.5px] uppercase">Fondos Netos Liquidados</span>
                <span className="font-mono text-lg font-black text-emerald-850">${netEarnings.toFixed(2)} USD</span>
              </div>
            </div>

            {/* Invoices listings */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Facturas y Retenciones Emitidas</h4>
              
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">Factura SaaS #FAC-2026-621</p>
                  <p className="text-[10px] text-slate-400">Generado el 2026-06-10. Concepto: Comisión Mensual por uso de Ecosistema.</p>
                </div>
                <div className="text-right">
                  <span className="text-rose-600 font-mono font-bold block">-${(commissionsSum).toFixed(2)} USD</span>
                  <span className="text-[9.5px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase font-black text-[9px]">PAGADO</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SVG Statistics View */}
        {activeSubTab === 'stats' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Rendimiento & KPIs de Operación
              </h3>
              <p className="text-[10px] text-slate-400">Visualización de crecimiento y facturación acumulada.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Custom micro SVG chart */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3 flex flex-col justify-between">
                <span className="text-[10.5px] font-bold text-slate-600 block">Flujo de Ingresos (SNG Tokens)</span>
                
                <svg viewBox="0 0 300 120" className="w-full h-auto bg-white rounded-xl border border-slate-200 px-3 py-2">
                  {/* Grid Lines */}
                  <line x1="10" y1="20" x2="290" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="10" y1="50" x2="290" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="10" y1="80" x2="290" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="10" y1="100" x2="290" y2="100" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Line Chart */}
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3.5"
                    points="20,100 80,75 140,84 200,45 260,25"
                  />

                  {/* Nodes */}
                  <circle cx="20" cy="100" r="5" fill="#4f46e5" />
                  <circle cx="80" cy="75" r="5" fill="#4f46e5" />
                  <circle cx="140" cy="84" r="5" fill="#4f46e5" />
                  <circle cx="200" cy="45" r="5" fill="#4f46e5" />
                  <circle cx="260" cy="25" r="5" fill="#10b981" />

                  {/* Texts */}
                  <text x="20" y="115" fontSize="8" fill="#94a3b8" textAnchor="middle">Ene</text>
                  <text x="80" y="115" fontSize="8" fill="#94a3b8" textAnchor="middle">Feb</text>
                  <text x="140" y="115" fontSize="8" fill="#94a3b8" textAnchor="middle">Mar</text>
                  <text x="200" y="115" fontSize="8" fill="#94a3b8" textAnchor="middle">Abr</text>
                  <text x="260" y="115" fontSize="8" fill="#475569" textAnchor="middle" fontWeight="black">Mayo</text>
                </svg>

                <p className="text-[10px] text-slate-400 text-center font-sans">Evolución acumulativa en depósitos de liquidez.</p>
              </div>

              {/* Conversion Statistics */}
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-550">Tasa de Conversión</span>
                  <strong className="text-slate-800 font-mono">4.82%</strong>
                </div>
                <div className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-550">Tiempo Promedio de Cierre</span>
                  <strong className="text-slate-800 font-mono">1.2 Dias</strong>
                </div>
                <div className="p-3.5 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-550">Retención de Clientes</span>
                  <strong className="text-emerald-600 font-mono font-bold">89.4%</strong>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO 1: REDES SOCIALES Y MARKETING DIGITAL / SOCIAL HUB 
           ========================================================= */}
        {activeSubTab === 'marketing' && (
          <div className="space-y-8 select-none">
            
            {/* Header & Description */}
            <div className="pb-3 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Share2 className="w-4 h-4 text-indigo-650" /> Social Hub Empresarial & Marketing Digital
                </h3>
                <p className="text-[10px] text-slate-400">Canaliza todas tus rede sociales, automatizaciones, CRM y campañas simultáneas desde un solo cuadrante.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-150 rounded-md font-mono flex items-center gap-1">
                  <Bot className="w-3 h-3 animate-bounce" /> MuchosFlows Active
                </span>
              </div>
            </div>

            {/* Sub-grid of Social Connections status */}
            <div className="space-y-2">
              <span className="text-[9.5px] uppercase font-bold text-slate-500 block tracking-wider">Conexiones de Canal Disponibles</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {Object.entries(socialConnections).map(([platform, rawInfo]) => {
                  const info = rawInfo as { connected: boolean; handle: string };
                  return (
                    <div 
                      key={platform} 
                      onClick={() => {
                        setSocialConnections(prev => ({
                          ...prev,
                          [platform]: { ...prev[platform], connected: !prev[platform].connected }
                        }));
                        onAddAuditLog('Conexión RRSS Alternada', `Se ${!info.connected ? 'conectó' : 'desconectó'} el canal "${platform}" del Social Hub.`);
                        triggerNotification('Social Hub Config', `Canal ${platform} actualizado.`, 'chat');
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 select-none ${
                        info.connected 
                          ? 'bg-emerald-50/50 border-emerald-220 hover:bg-emerald-50' 
                          : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-extrabold text-[11px] text-slate-800">{platform}</span>
                        <span className={`w-2 h-2 rounded-full ${info.connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-350'}`} />
                      </div>
                      <p className="text-[9px] text-slate-500 font-mono truncate">{info.connected ? info.handle : 'Desconectado'}</p>
                      <span className="text-[8px] uppercase font-bold text-indigo-600 mt-1 block">
                        {info.connected ? '🟢 Conectado' : '⚡ Conectar'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unified Publisher & Copys AI generator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Creator Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-650 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Publicación Simultánea & Programación
                </span>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-550">Editor de Contenidos (Copy del Post)</label>
                  <textarea
                    rows={4}
                    value={marketingCopy}
                    onChange={(e) => setMarketingCopy(e.target.value)}
                    placeholder="Escribe la promoción comercial de tu empresa... Ej. ¡Super promoción del mes en Sinergia Connect!"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Target Channels Checkboxes */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-550">Publicar simultáneamente en (Canales Activos):</label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(socialConnections).map(platform => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => {
                          if (targetSocials.includes(platform)) {
                            setTargetSocials(prev => prev.filter(c => c !== platform));
                          } else {
                            setTargetSocials(prev => [...prev, platform]);
                          }
                        }}
                        className={`px-2 py-1 rounded bg-white border text-[10px] font-bold transition-all ${
                          targetSocials.includes(platform)
                            ? 'border-indigo-550 text-indigo-700 bg-indigo-50'
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        {targetSocials.includes(platform) ? '✓ ' : ''}{platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scheduling tools */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 mb-0.5">Fecha de Programación</label>
                    <input 
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 bg-white text-[11px]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-550 mb-0.5">Hora de Salida</label>
                    <input 
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full border border-slate-200 rounded p-1.5 bg-white text-[11px]" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (!marketingCopy.trim()) {
                        alert('Escribe un texto de publicación primero.');
                        return;
                      }
                      const newP = {
                        id: `pst-${Date.now()}`,
                        copy: marketingCopy,
                        channels: [...targetSocials],
                        date: 'Inmediato (Ahora mismo)',
                        status: 'published'
                      };
                      setPostsList(prev => [newP, ...prev]);
                      setMarketingCopy('');
                      onAddAuditLog('Publicación Social Hub', `Publicado inmediatamente en: [${targetSocials.join(', ')}]`);
                      triggerNotification('Publicado Inmediatamente', 'Publicación transmitida con éxito vía APIs unificadas.', 'chat');
                    }}
                    className="flex-1 py-2 bg-indigo-650 hover:bg-slate-900 text-white rounded text-[10.5px] font-bold uppercase transition-all tracking-wider"
                  >
                    Publicar Ahora Simultáneamente
                  </button>
                  <button
                    onClick={() => {
                      if (!marketingCopy.trim()) {
                        alert('Escribe un texto de publicación primero.');
                        return;
                      }
                      const newP = {
                        id: `pst-${Date.now()}`,
                        copy: marketingCopy,
                        channels: [...targetSocials],
                        date: `${scheduledDate} ${scheduledTime}`,
                        status: 'scheduled'
                      };
                      setPostsList(prev => [newP, ...prev]);
                      setMarketingCopy('');
                      onAddAuditLog('Publicación Programada', `Publicación agendada para ${scheduledDate} a las ${scheduledTime} en: [${targetSocials.join(', ')}]`);
                      triggerNotification('Agendamiento Exitoso', 'La publicación ha sido guardada en tu calendario editorial.', 'chat');
                    }}
                    className="px-3.5 py-2 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-150 rounded text-[10.5px] font-bold uppercase transition-all"
                  >
                    Agendar
                  </button>
                </div>
              </div>

              {/* Instant IA Copy Generator */}
              <div className="p-4 bg-indigo-950 text-white rounded-xl border border-indigo-900 space-y-4 relative overflow-hidden flex flex-col justify-between">
                
                {/* Background decorative shine */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-2xl pointer-events-none" />
                
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Bot className="w-4 h-4 animate-pulse text-amber-400" /> Sinergia IA Content Center (Gemini v3.5-Flash)
                  </span>
                  <p className="text-[10px] text-indigo-200">Genera copys, slogans comerciales y hashtags profesionales optimizados para redes con un click.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] uppercase font-bold text-indigo-300 mb-0.5">Giro/Industria</label>
                      <select 
                        value={aiIndustry} 
                        onChange={e => setAiIndustry(e.target.value)}
                        className="w-full bg-indigo-900 border border-indigo-700 rounded p-1.5 text-white text-[11px] focus:outline-none focus:border-amber-400"
                      >
                        <option value="Tecnología / SaaS">Tecnología / SaaS</option>
                        <option value="Inmobiliaria / SNG Prop">Inmobiliaria / SNG Prop</option>
                        <option value="Hoteles y Turismo">Hoteles y Turismo</option>
                        <option value="Gastronomía & Catering">Gastronomía & Catering</option>
                        <option value="Servicios Profesionales">Servicios Profesionales</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-bold text-indigo-300 mb-0.5">Objetivo Comercial</label>
                      <select 
                        value={aiObjective} 
                        onChange={e => setAiObjective}
                        className="w-full bg-indigo-900 border border-indigo-700 rounded p-1.5 text-white text-[11px] focus:outline-none"
                      >
                        <option value="Generar ventas directas">Generar ventas directas</option>
                        <option value="Aumentar Interacciones">Aumentar Interacciones</option>
                        <option value="Anunciar nuevo lanzamiento">Nuevo lanzamiento</option>
                        <option value="Ofrecer Cupón / Descuento">Ofrecer Cupón/Promo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase font-bold text-indigo-300 mb-0.5">Palabras clave de marca (Separadas por comas)</label>
                    <input 
                      type="text" 
                      value={aiKeywords}
                      onChange={e => setAiKeywords(e.target.value)}
                      className="w-full bg-indigo-900 border border-indigo-700 rounded p-1.5 text-white text-[11px] focus:outline-none focus:border-amber-400"
                      placeholder="ej. fletes, rapidez, Medellín"
                    />
                  </div>
                </div>

                {/* Generated response box */}
                {aiGeneratedResult && (
                  <div className="bg-indigo-900/80 border border-indigo-700 p-3 rounded-lg text-[10.5px] font-sans text-slate-100 max-h-36 overflow-y-auto space-y-1">
                    <span className="text-[8.5px] font-mono uppercase bg-amber-400 text-slate-900 px-1 rounded font-black">Copy Generado con IA:</span>
                    <p className="whitespace-pre-line leading-relaxed">{aiGeneratedResult}</p>
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => {
                          setMarketingCopy(aiGeneratedResult);
                          triggerNotification('Texto Copiado', 'Se trasladó el copy generado al editor.', 'system' as any);
                        }}
                        className="px-2 py-0.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded text-[9.5px]"
                      >
                        Utilizar este Copy
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setAiIsGenerating(true);
                    setTimeout(() => {
                      setAiIsGenerating(false);
                      const baseCopys: Record<string, string> = {
                        'Tecnología / SaaS': `🚀 ¡Maximiza la gestión comercial de tu negocio multi-sucursal con Sinergia Connect! 🏢✨\n\nNuestras herramientas integran inventarios independientes, analíticas inteligentes y el Social Hub Unificado para que administres todo desde una única consola centralizada.\n\nOptimiza procesos y escala con #SNGToken 🪙\n👉 Únete hoy en: sinergiaconnect.com \n\n#SinergiaSaaS #EcosistemaDigital #InnovacionFinanciera #TecnologiaLatam #Productividad`,
                        'Inmobiliaria / SNG Prop': `🏡 ¿Buscas la propiedad de tus sueños? Sinergia Inmobiliaria te conecta con las mejores opciones en Medellín y Rionegro. 💫\n\nContratos digitales con firma autorizada, transacciones transparentes y comisiones liquidadas de forma inmediata.\n\nConsulta nuestro portafolio de arriendos y ventas hoy mismo. \n\n#Inmobiliaria #RealEstateMedellin #SNGProp #Arrendamientos #Inversiones`,
                        'Hoteles y Turismo': `🌴 Escápate de la rutina y reserva tu estadía ideal en nuestra cadena de hoteles afiliados. 🍹🏖️\n\n✓ Habitaciones completamente independientes\n✓ Guías turísticos locales\n✓ Recorridos todo incluido por el Eje Cafetero y Antioquia\n\n¡Reserva pagando con tus SNG Tokens y recibe un 15% de descuento en fletes de cortesía!\n\n#TurismoSinergia #Hoteleria #EjeCafetero #VacacionesColombia #ViajaSeguro`,
                        'Gastronomía & Catering': `🍔🍕 Un deleite para tu paladar. Conoce nuestro Marketplace Gastronómico en Sinergia Connect. \n\n¡Ordena en línea desde tu sucursal más cercana con despacho express y flete unificado y seguro!\n\n#GastronomiaSinergia #FoodiesColombia #DeliveryExpress #RestaurantesMedellin`,
                        'Servicios Profesionales': `💼 ¿Necesitas asesoría contable, legal o de marketing empresarial avanzado?\n\nConéctate con nuestros profesionales certificados en Sinergia Connect. Contratos escrow inteligentes y acompañamiento garantizado.\n\n#AsesoriaEmpresarial #Consultoria #EscrowSeguro #SinergiaProfesional`
                      };
                      setAiGeneratedResult(baseCopys[aiIndustry] || `✨ ¡Lleva tu campaña de "${aiObjective}" al siguiente nivel!\n\nDescubre la sinergia de trabajar en un ecosistema unificado. Palabras claves destacadas: ${aiKeywords}.\n\n#SNG #EcosistemaConectado #SinergiaConnect`);
                    }, 1200);
                  }}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded text-[10.5px] font-bold uppercase transition-all tracking-wider flex items-center justify-center gap-1.5"
                >
                  {aiIsGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Analizando palabras clave...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 text-slate-900" /> Inteligencia Artificial: Crear Post Corporativo
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Unified Inbox & ManyChat / Cloud API Auto-responders */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Inbox Left List + Selected chat details */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[340px]">
                <div className="p-3 bg-slate-50 border-b flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 uppercase font-mono tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-indigo-650 animate-pulse" /> Bandeja de Entrada Unificada
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 font-bold rounded">
                    {inboxMessages.length} Mensajes por Responder
                  </span>
                </div>

                <div className="flex flex-1 h-full overflow-hidden">
                  
                  {/* Left contacts tab */}
                  <div className="w-1/3 border-r divide-y divide-slate-100 overflow-y-auto">
                    {inboxMessages.map(msg => (
                      <div
                        key={msg.id}
                        onClick={() => setActiveInboxId(msg.id)}
                        className={`p-2 bg-white text-left cursor-pointer hover:bg-slate-50 select-none text-[10px] ${
                          msg.id === activeInboxId ? 'border-l-4 border-indigo-650 bg-slate-50/50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-extrabold text-slate-850 truncate">{msg.sender.split(' ')[0]}</span>
                          <span className="text-[7.5px] text-slate-450 font-mono">{msg.time}</span>
                        </div>
                        <p className="text-[8.5px] text-slate-500 font-mono mb-1">{msg.channel}</p>
                        <p className="text-[8.5px] text-slate-600 truncate">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Right active chat room */}
                  <div className="w-2/3 flex flex-col justify-between bg-slate-50/30">
                    {(() => {
                      const activeChat = inboxMessages.find(m => m.id === activeInboxId);
                      if (!activeChat) return <p className="p-4 text-center select-none text-[11px] text-slate-400">Selecciona una conversación</p>;
                      return (
                        <>
                          {/* Chat feed */}
                          <div className="p-3.5 space-y-3 overflow-y-auto flex-1 h-full text-[11px]">
                            <div className="text-center">
                              <span className="text-[8.5px] font-mono bg-slate-205 text-slate-505 px-2 py-0.5 rounded-full">
                                Chat originado en: {activeChat.channel}
                              </span>
                            </div>

                            {/* Client Message */}
                            <div className="flex flex-col items-start space-y-1">
                              <span className="text-[9px] font-bold text-slate-600">{activeChat.sender}</span>
                              <div className="p-2.5 bg-white border border-slate-200 rounded-2xl rounded-tl-none max-w-[85%] text-slate-800 shadow-2xs font-sans">
                                {activeChat.text}
                              </div>
                            </div>

                            {/* Replies */}
                            {activeChat.replies?.map((rep: any, idx: number) => (
                              <div key={idx} className="flex flex-col items-end space-y-1">
                                <span className="text-[9px] font-bold text-indigo-700">Tú (Empresa) • Instantáneo</span>
                                <div className="p-2.5 bg-indigo-600 text-white rounded-2xl rounded-tr-none max-w-[85%] font-sans">
                                  {rep}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Reply Input */}
                          <div className="p-2 border-t bg-white flex gap-1.5 items-center">
                            <input
                              type="text"
                              value={inboxReplyText}
                              onChange={e => setInboxReplyText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && inboxReplyText.trim()) {
                                  setInboxMessages(prev => prev.map(m => {
                                    if (m.id === activeInboxId) {
                                      return { ...m, replies: [...(m.replies || []), inboxReplyText] };
                                    }
                                    return m;
                                  }));
                                  onAddAuditLog('Respuesta Social Hub', `Respuesta enviada a ${activeChat.sender} vía api ${activeChat.channel}`);
                                  setInboxReplyText('');
                                }
                              }}
                              placeholder="Escribe una respuesta unificada..."
                              className="flex-1 border p-1.5 text-xs rounded-lg focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                if (!inboxReplyText.trim()) return;
                                setInboxMessages(prev => prev.map(m => {
                                  if (m.id === activeInboxId) {
                                    return { ...m, replies: [...(m.replies || []), inboxReplyText] };
                                  }
                                  return m;
                                }));
                                onAddAuditLog('Respuesta Social Hub', `Respuesta enviada a ${activeChat.sender} vía api ${activeChat.channel}`);
                                setInboxReplyText('');
                              }}
                              className="p-2 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                </div>
              </div>

              {/* Automation Triggers Config Panel */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-[340px]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-500 block tracking-wider">Flujos & Automatizaciones</span>
                  <p className="text-[9px] text-slate-400">Define respuestas automáticas asociadas a ManyChat, WhatsApp Cloud API o Meta API.</p>
                </div>

                <div className="overflow-y-auto space-y-2.5 my-3 flex-1">
                  {automationKeywords.map(kw => (
                    <div key={kw.id} className="p-2.5 bg-slate-55 border rounded-lg text-[10.5px] space-y-1">
                      <div className="flex justify-between items-center font-bold">
                        <span className="font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold text-[9.5px]">
                          Trigger: "{kw.trigger}"
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[8.5px] text-slate-500 font-mono">{kw.channel}</span>
                          <input 
                            type="checkbox" 
                            checked={kw.status}
                            onChange={() => {
                              setAutomationKeywords(prev => prev.map(k => k.id === kw.id ? { ...k, status: !k.status } : k));
                              onAddAuditLog('Trigger Automation Alternado', `Palabra clave "${kw.trigger}": ${!kw.status ? 'activada' : 'desactivada'}.`);
                              triggerNotification('Módulo Automatización', `Trigger "${kw.trigger}" actualizado.`, 'booking');
                            }}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>
                      <p className="text-[9.5px] text-slate-600 leading-tight italic">"{kw.response}"</p>
                      <div className="pt-1 flex justify-between items-center text-[8.5px] text-slate-400 font-mono">
                        <span>Leads capturados automáticamente: <strong className="text-emerald-600 font-bold">{kw.leadsCaptured}</strong></span>
                        <span className={kw.status ? 'text-emerald-500 font-extrabold' : 'text-slate-400'}>
                          {kw.status ? '● ACTIVO' : '○ INACTIVO'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const trig = prompt('Digita la palabra clave de activación automática (ej. descuento):');
                    if (!trig) return;
                    const r = prompt('Mensaje de respuesta automático:');
                    if (!r) return;
                    const newKw = {
                      id: `kw-${Date.now()}`,
                      trigger: trig.toLowerCase(),
                      channel: 'WhatsApp Cloud API',
                      response: r,
                      status: true,
                      leadsCaptured: 0
                    };
                    setAutomationKeywords(prev => [...prev, newKw]);
                    onAddAuditLog('Flow Auto-Respuesta Añadido', `Se configuró respuesta automática para trigger "${trig}".`);
                    triggerNotification('Ajuste Registrado', 'Nuevo trigger operando en producción.', 'system' as any);
                  }}
                  className="w-full py-1.5 border border-dashed border-indigo-400 font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 rounded text-[10px] uppercase font-mono"
                >
                  + Agregar Nueva Regla de Disparo
                </button>
              </div>

            </div>

            {/* Social CRM Captured Leads Panel */}
            <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Social CRM • Captura Automática de Clientes Potenciales</span>
                <span className="text-[9.5px] font-mono font-bold text-slate-500">Última actualización: Hace un momento</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-sans text-slate-700">
                  <thead>
                    <tr className="border-b bg-slate-100/80 text-slate-500 font-bold uppercase text-[9px]">
                      <th className="py-2 px-3">Cliente</th>
                      <th className="py-2 px-3">Canal Entrada</th>
                      <th className="py-2 px-3">Trigger Flow</th>
                      <th className="py-2 px-3">Contacto / Correo</th>
                      <th className="py-2 px-3 text-center">Estado Lead</th>
                      <th className="py-2 px-3">Fecha Captura</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {socialCRMLeads.map(ld => (
                      <tr key={ld.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{ld.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-500 text-[10px]">{ld.source}</td>
                        <td className="py-2 px-3"><span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[9px]">#{ld.keyword}</span></td>
                        <td className="py-2 px-3 font-bold">{ld.phone}</td>
                        <td className="py-2 px-3 text-center text-[10px]">
                          <select
                            value={ld.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setSocialCRMLeads(prev => prev.map(l => l.id === ld.id ? { ...l, status: newStatus } : l));
                              onAddAuditLog('Lead Social CRM Modificado', `Lead "${ld.name}" cambió de estado a "${newStatus}"`);
                            }}
                            className="bg-white border rounded px-1.5 py-0.5 text-[9.5px]"
                          >
                            <option value="Capturado">Capturado</option>
                            <option value="En Seguimiento">En Seguimiento</option>
                            <option value="Interesado">Interesado</option>
                            <option value="Convertido">Convertido</option>
                            <option value="Descalificado">Descalificado</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-500 text-[10px]">{ld.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            MÓDULO 2: MULTI-SUCURSAL E INVENTARIOS DE SEDES INDEPENDIENTES 
           ========================================================= */}
        {activeSubTab === 'branches' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Network className="w-4 h-4 text-emerald-600" /> Control Multi-Sucursal, Franquicias & Puntos de Venta
                </h3>
                <p className="text-[10px] text-slate-400">Delega, regula e independiza los inventarios y gerentes de cada sucursal de tu empresa en Medellín y el Área Metropolitana.</p>
              </div>
              <button
                onClick={() => setShowAddBranch(true)}
                className="px-3 py-1.5 bg-emerald-650 hover:bg-emerald-700 text-white rounded-lg text-[10.5px] font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Sucursal / Sede
              </button>
            </div>

            {/* Grid of branches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {branches.map(br => (
                <div key={br.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="p-2 bg-white rounded-lg border border-slate-200">🏢</span>
                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-black uppercase ${
                      br.type === 'Casa Matriz' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {br.type}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">{br.name}</h4>
                    <p className="text-[9.5px] text-slate-400 font-mono mt-0.5">{br.address}</p>
                  </div>

                  <div className="p-2.5 bg-white border rounded-lg text-[10px] space-y-1 font-mono text-slate-600">
                    <p className="flex justify-between"><span>Gerente:</span> <strong className="text-slate-800 font-sans">{br.manager}</strong></p>
                    <p className="flex justify-between"><span>Celular:</span> <strong className="text-slate-800">{br.phone}</strong></p>
                    <p className="flex justify-between"><span>Estado:</span> <strong className="text-emerald-600">{br.status}</strong></p>
                  </div>

                  <div className="pt-2 border-t flex justify-end">
                    <button
                      onClick={() => {
                        const confirmDel = window.confirm(`¿Deseas dar de baja la sucursal de ${br.name}?`);
                        if (confirmDel) {
                          setBranches(prev => prev.filter(b => b.id !== br.id));
                          onAddAuditLog('Sucursal Removida', `Sede "${br.name}" de tipo ${br.type} fue dada de baja.`);
                          triggerNotification('Sucursal de Baja', 'Los cambios se han propagado.', 'system' as any);
                        }
                      }}
                      className="text-[9px] uppercase font-bold text-rose-600 hover:underline"
                    >
                      Dar de baja sede
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventories Independientes section */}
            <div className="bg-white border rounded-xl p-4 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider font-mono">Control de Inventario Descentralizado</span>
              
              <div className="overflow-x-auto border border-slate-150 rounded-xl">
                <table className="w-full text-left text-[11px] text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b uppercase text-slate-500 font-mono text-[9px]">
                      <th className="py-2.5 px-4">Producto del Catálogo</th>
                      {branches.map(br => (
                        <th key={br.id} className="py-2.5 px-4 text-center">{br.name.substring(0, 20)}...</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {['Control Remoto Comando', 'Sensor Capacitivo SNG'].map(prodName => (
                      <tr key={prodName} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-extrabold text-slate-800">{prodName}</td>
                        {branches.map(br => {
                          const stockValue = branchInventory[br.id]?.[prodName] ?? 0;
                          return (
                            <td key={br.id} className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-1">
                                <button
                                  onClick={() => {
                                    setBranchInventory(prev => {
                                      const currentBranchInv = prev[br.id] || {};
                                      const newStock = Math.max(0, (currentBranchInv[prodName] ?? 0) - 1);
                                      return {
                                        ...prev,
                                        [br.id]: {
                                          ...currentBranchInv,
                                          [prodName]: newStock
                                        }
                                      };
                                    });
                                    onAddAuditLog('Ajuste Inventario Sucursal', `Cambio de stock en sucursal ${br.name} para ${prodName} (Restando, valor: ${stockValue - 1})`);
                                  }}
                                  className="w-5 h-5 bg-white border rounded hover:bg-slate-100 font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="font-mono font-bold w-10 text-slate-900 inline-block text-center">{stockValue} u</span>
                                <button
                                  onClick={() => {
                                    setBranchInventory(prev => {
                                      const currentBranchInv = prev[br.id] || {};
                                      const newStock = (currentBranchInv[prodName] ?? 0) + 1;
                                      return {
                                        ...prev,
                                        [br.id]: {
                                          ...currentBranchInv,
                                          [prodName]: newStock
                                        }
                                      };
                                    });
                                    onAddAuditLog('Ajuste Inventario Sucursal', `Cambio de stock en sucursal ${br.name} para ${prodName} (Sumando, valor: ${stockValue + 1})`);
                                  }}
                                  className="w-5 h-5 bg-white border rounded hover:bg-slate-100 font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[9.5px] font-mono text-slate-400 italic">Cada sucursal opera con stock autónomo de almacenamiento para evitar quiebre de inventario.</p>
            </div>

            {/* Modal for adding branch */}
            {showAddBranch && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-slate-205">
                  <h3 className="font-bold text-slate-800 text-xs uppercase mb-3.5 tracking-wider font-mono">Alta de Sucursal / Sede Operativa</h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Nombre Comercial</label>
                      <input 
                        type="text" 
                        value={newBranchName}
                        onChange={e => setNewBranchName(e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none" 
                        placeholder="ej. Sede Poblado Milla de Oro"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Tipo de Sede</label>
                        <select 
                          value={newBranchType}
                          onChange={e => setNewBranchType(e.target.value)}
                          className="w-full border rounded p-2 bg-white"
                        >
                          <option value="Sucursal">Sucursal</option>
                          <option value="Franquicia">Franquicia</option>
                          <option value="Punto de Venta / Despacho">Punto de Despacho</option>
                          <option value="Casa Matriz">Matriz Secundaria</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Gerente Responsable</label>
                        <input 
                          type="text" 
                          value={newBranchManager}
                          onChange={e => setNewBranchManager(e.target.value)}
                          className="w-full border rounded p-2 focus:outline-none" 
                          placeholder="ej. Diana Rodriguez"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Dirección Física</label>
                      <input 
                        type="text" 
                        value={newBranchAddress}
                        onChange={e => setNewBranchAddress(e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none" 
                        placeholder="ej. Transversal 39b # 4-12"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Celular de Contacto de Sede</label>
                      <input 
                        type="text" 
                        value={newBranchPhone}
                        onChange={e => setNewBranchPhone(e.target.value)}
                        className="w-full border rounded p-2 focus:outline-none" 
                        placeholder="ej. +57 301 000 0000"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setShowAddBranch(false)}
                        className="flex-1 py-2 font-bold uppercase text-[10px] border rounded hover:bg-slate-50"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => {
                          if (!newBranchName || !newBranchAddress) {
                            alert('Define el nombre y la dirección del punto.');
                            return;
                          }
                          const id = `br-${Date.now()}`;
                          const newB = {
                            id,
                            name: newBranchName,
                            type: newBranchType,
                            address: newBranchAddress,
                            manager: newBranchManager || 'Sin programar',
                            phone: newBranchPhone || 'N/A',
                            status: 'Abierto'
                          };
                          setBranches(prev => [...prev, newB]);
                          setBranchInventory(prev => ({
                            ...prev,
                            [id]: { 'Control Remoto Comando': 10, 'Sensor Capacitivo SNG': 10 }
                          }));
                          onAddAuditLog('Sucursal Programada', `Se abrió alta operativa para sucursal "${newBranchName}"`);
                          triggerNotification('Sucursal Agregada', 'La sede ha ingresado al ecositema multisucursal.', 'system' as any);
                          setShowAddBranch(false);
                          setNewBranchName('');
                          setNewBranchAddress('');
                          setNewBranchManager('');
                          setNewBranchPhone('');
                        }}
                        className="flex-1 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold uppercase text-[10px] rounded"
                      >
                        Crear Sede
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            MÓDULO 3: GESTIÓN DOCUMENTAL CORPORATIVA Y PERMISOS 
           ========================================================= */}
        {activeSubTab === 'documents' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <FolderOpen className="w-4 h-4 text-rose-500" /> Archivo & Gestión Documental
              </h3>
              <p className="text-[10px] text-slate-400">Resguardo central de Contratos, Facturas, Certificados, Licencias y Manuales con permisos de visibilidad para tu empresa.</p>
            </div>

            {/* Grid with central files */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Document uploader simulating drag drop */}
              <div className="lg:col-span-1 bg-slate-50 border border-slate-205 rounded-xl p-4 space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider font-mono">Cargar Nuevo Documento</span>
                
                <div 
                  onClick={() => {
                    const fName = prompt('Nombre del documento a simular: (ej. Contrato_Fletes_Poblado.pdf)');
                    if (fName) {
                      setFileToUpload({ name: fName, size: '1.8 MB' });
                    }
                  }}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-100 hover:border-indigo-400 transition-all text-xs space-y-1.5 select-none"
                >
                  <span className="text-2xl block">📁</span>
                  <p className="font-bold text-slate-700">
                    {fileToUpload ? `✓ Seleccionado: ${fileToUpload.name}` : 'Arrastra archivos o haz CLICK para buscar'}
                  </p>
                  <p className="text-[9.5px] text-slate-400">Archivos PDF, DOCX, ZIP o PNG hasta 15MB</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5 uppercase mb-1">Clasificación de Documento</label>
                    <select 
                      value={docTypeChoice}
                      onChange={e => setDocTypeChoice(e.target.value)}
                      className="w-full border rounded p-1.5 bg-white"
                    >
                      <option value="Contrato">Contrato Comercial</option>
                      <option value="Factura">Factura de Liquidación</option>
                      <option value="Certificado">Certificado de Cumplimiento / KYC</option>
                      <option value="Licencia">Licencia Comercial</option>
                      <option value="Manual">Manual Operativo de Sede</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-500 mb-0.5 uppercase mb-1">Permisos de Acceso / Privacidad</label>
                    <select
                      value={docPermChoice}
                      onChange={e => setDocPermChoice(e.target.value)}
                      className="w-full border rounded p-1.5 bg-white"
                    >
                      <option value="Solo Administradores">Solo Administradores (Privado)</option>
                      <option value="Inquilinos Autorizados">Inquilinos Autorizados (Staff)</option>
                      <option value="Público General">Público General (Acceso Abierto)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!fileToUpload) {
                        alert('Selecciona o digita un archivo simulado para subir primero.');
                        return;
                      }
                      const newDoc = {
                        id: `doc-${Date.now()}`,
                        name: fileToUpload.name,
                        type: docTypeChoice,
                        size: fileToUpload.size,
                        uploadedBy: currentUser.name,
                        uploadedAt: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        permission: docPermChoice
                      };
                      setDocuments(prev => [newDoc, ...prev]);
                      onAddAuditLog('Documento Cargado', `Resguardo de doc "${fileToUpload.name}" clasificado en: [${docTypeChoice}]`);
                      triggerNotification('Documento Registrado', 'Archivo securizado e indexado correctamente.', 'system' as any);
                      setFileToUpload(null);
                    }}
                    className="w-full py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-[10px] uppercase rounded transition-colors"
                  >
                    Resguardar en Archivo SaaS
                  </button>
                </div>
              </div>

              {/* Document List with specific permissions info badge */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 overflow-hidden flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider font-mono">Bóveda Documental Indexada</span>
                
                <div className="divide-y divide-slate-100 overflow-y-auto my-3 flex-1">
                  {documents.map(doc => (
                    <div key={doc.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <p className="font-bold text-slate-800 hover:underline cursor-pointer">{doc.name}</p>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-650 text-[9px] font-mono font-bold uppercase border">
                            {doc.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <span>Tamaño: <strong>{doc.size}</strong></span>
                          <span>•</span>
                          <span>Por: <strong>{doc.uploadedBy}</strong></span>
                          <span>•</span>
                          <span>Fecha: <strong>{doc.uploadedAt}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-extrabold ${
                          doc.permission === 'Solo Administradores' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          doc.permission === 'Inquilinos Autorizados' ? 'bg-amber-50 text-amber-800 border border-amber-100' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        }`}>
                          {doc.permission}
                        </span>
                        <button
                          onClick={() => {
                            const newPerm = prompt('Actualizar permiso ("Solo Administradores", "Inquilinos Autorizados", "Público General"):', doc.permission);
                            if (newPerm) {
                              setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, permission: newPerm } : d));
                              onAddAuditLog('Permiso Documento Editado', `Permiso para doc "${doc.name}" cambiado a "${newPerm}"`);
                            }
                          }}
                          className="px-2 py-1 bg-slate-100 rounded text-[9px] text-slate-600 hover:bg-slate-200"
                        >
                          Editar Clave
                        </button>
                        <button
                          onClick={() => {
                            setDocuments(prev => prev.filter(d => d.id !== doc.id));
                            onAddAuditLog('Documento Puron', `Se desincorporó el doc "${doc.name}" de la base de datos.`);
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          title="Eliminar del archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-rose-600" /> Protocolo SNG-Securised activo con encriptación militar SHA-256.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO 4: COMUNICACIÓN INTERNA (CHAT & SINEGIA CALL VIDEO) 
           ========================================================= */}
        {activeSubTab === 'internal' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <MessageSquare className="w-4 h-4 text-indigo-650" /> Consola de Comunicación Interna & Sinergia Call
              </h3>
              <p className="text-[10px] text-slate-400">Interactúa con tus gerentes, empleados de logística y franquiciados en salas de chat seguras o vía videollamada HD.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Internal Slack-like Chat Room */}
              <div className="lg:col-span-7 bg-white border border-slate-205 rounded-xl overflow-hidden flex flex-col h-[340px]">
                <div className="p-3 bg-slate-50 border-b flex justify-between items-center text-xs">
                  <div className="flex gap-2">
                    {['#general', '#marketing', '#logistica-flete'].map(ch => (
                      <button
                        key={ch}
                        onClick={() => {
                          setInternalChannel(ch);
                          if (ch === '#logistica-flete') {
                            setInternalMessages([
                              { id: 'm-1', sender: 'Manuel Torres (Logística)', text: 'Hola, tengo una carga de flete lista para Envigado.', time: 'Ayer' },
                              { id: 'm-2', sender: 'Super Admin', text: 'Excelente Manuel, autorizada con firmas digitales.', time: 'Ayer' }
                            ]);
                          } else {
                            setInternalMessages([
                              { id: 'im-1', sender: 'Valeria Restrepo (Socio)', text: 'Equipo, recuerden revisar la documentación KYC para asegurar la promoción de Sello nivel 3.', time: '09:15 AM' },
                              { id: 'im-2', sender: 'Manuel Torres (Logística)', text: 'Listo Valeria. El inventario de Rionegro ya está conectado en el nuevo módulo de Sucursales.', time: '09:22 AM' },
                              { id: 'im-3', sender: 'Lina Maria', text: 'Hoy tenemos reunión de Business Intelligence a las 3:00 PM.', time: '10:05 AM' }
                            ]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all ${
                          internalChannel === ch ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-650'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                  <span className="text-[9.5px] text-slate-400 font-mono">Chat Corporativo</span>
                </div>

                <div className="p-3.5 space-y-3 overflow-y-auto flex-1 h-full text-[11px] bg-slate-50/20">
                  {internalMessages.map(im => (
                    <div key={im.id} className="space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-800 text-[10px]">
                        <span>{im.sender}</span>
                        <span className="font-mono text-slate-400 text-[9px]">{im.time}</span>
                      </div>
                      <div className="p-2 bg-white border border-slate-150 rounded-xl leading-relaxed text-slate-700 max-w-[95%]">
                        {im.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 border-t bg-white flex gap-2">
                  <input
                    type="text"
                    value={internalInputMsg}
                    onChange={e => setInternalInputMsg(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && internalInputMsg.trim()) {
                        const newM = {
                          id: `im-${Date.now()}`,
                          sender: `${currentUser.name} (Tú)`,
                          text: internalInputMsg,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        };
                        setInternalMessages(prev => [...prev, newM]);
                        setInternalInputMsg('');
                      }
                    }}
                    placeholder={`Enviar mensaje a canal ${internalChannel}...`}
                    className="flex-1 text-xs border rounded-lg p-2 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (!internalInputMsg.trim()) return;
                      const newM = {
                        id: `im-${Date.now()}`,
                        sender: `${currentUser.name} (Tú)`,
                        text: internalInputMsg,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setInternalMessages(prev => [...prev, newM]);
                      setInternalInputMsg('');
                    }}
                    className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-lg text-xs"
                  >
                    Enviar
                  </button>
                </div>
              </div>

              {/* Sinergia Call Videocall Simulator View */}
              <div className="lg:col-span-5 bg-white border border-slate-205 rounded-xl p-4 flex flex-col justify-between h-[340px]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 block tracking-wider">Sala de Videollamadas • Sinergia Call</span>
                  <p className="text-[9.5px] text-slate-400">Canal de audio, video y compartición de pantalla ZeroTrust.</p>
                </div>

                {isCalling ? (
                  <div className="bg-slate-900 rounded-xl p-3 flex flex-col justify-between h-[210px] relative overflow-hidden">
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[8px] font-mono font-bold rounded-full animate-pulse">
                      🔴 EN DIRECTO HD
                    </span>

                    {/* Simulating 3 frames of participants */}
                    <div className="grid grid-cols-3 gap-2 my-auto">
                      <div className="bg-slate-800 rounded-lg h-24 relative flex items-center justify-center border border-indigo-500/40">
                        {callCamOn ? (
                          <div className="absolute inset-0 bg-cover bg-center rounded-lg opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80')` }} />
                        ) : (
                          <span className="text-xs text-slate-500">Video Off</span>
                        )}
                        <span className="absolute bottom-1 right-1 text-[8.5px] bg-slate-950/60 text-white px-1 rounded truncate max-w-full">Tú</span>
                      </div>
                      
                      <div className="bg-slate-800 rounded-lg h-24 relative flex items-center justify-center border border-slate-700">
                        <div className="absolute inset-0 bg-cover bg-center rounded-lg opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80')` }} />
                        <span className="absolute bottom-1 right-1 text-[8.5px] bg-slate-950/60 text-white px-1 rounded">Valeria</span>
                      </div>

                      <div className="bg-slate-800 rounded-lg h-24 relative flex items-center justify-center border border-slate-700">
                        <div className="absolute inset-0 bg-cover bg-center rounded-lg opacity-80" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80')` }} />
                        <span className="absolute bottom-1 right-1 text-[8.5px] bg-slate-950/60 text-white px-1 rounded">Manuel</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-800 pt-1.5 text-xs text-slate-350 select-none">
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setCallMicOn(!callMicOn)}
                          className={`p-1 rounded bg-slate-800 text-white hover:bg-slate-700 ${!callMicOn ? 'bg-rose-900 border border-rose-500' : ''}`}
                        >
                          {callMicOn ? '🎤 Mic' : '🔇 Mudo'}
                        </button>
                        <button 
                          onClick={() => setCallCamOn(!callCamOn)}
                          className={`p-1 rounded bg-slate-800 text-white hover:bg-slate-700 ${!callCamOn ? 'bg-rose-900 border border-rose-500' : ''}`}
                        >
                          {callCamOn ? '📹 Cam' : '❌ Cam'}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setIsCalling(false);
                          onAddAuditLog('Sinergia Call Cerrada', 'Finalizó videollamada directiva con gerentes.');
                        }}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold uppercase text-[9.5px]"
                      >
                        Terminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border rounded-xl p-8 text-center space-y-4 my-auto">
                    <span className="text-4xl block animate-pulse">📹</span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-slate-850">¿Iniciar nueva reunión de sucursales?</h4>
                      <p className="text-[10px] text-slate-450 leading-relaxed">Se notificará inmediatamente a los administradores de canal por Telegram e Instagram de tu empresa.</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCalling(true);
                        onAddAuditLog('Sinergia Call Iniciada', 'Socio principal abrió una reunión corporativa en tiempo real.');
                      }}
                      className="px-4 py-2 bg-indigo-650 hover:bg-slate-900 text-white font-bold text-[10.5px] uppercase rounded-lg tracking-widest transition-all"
                    >
                      Conectar instantáneamente
                    </button>
                  </div>
                )}

                <div className="text-center font-mono text-[9px] text-slate-400">
                  Respetando permisos corporativos, SNG-Call es peer-to-peer cifrado.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================
            MÓDULO 5: INTELIGENCIA EMPRESARIAL / BUSINESS INTELLIGENCE (BI) 
           ========================================================= */}
        {activeSubTab === 'bi' && (
          <div className="space-y-6">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Laptop className="w-4 h-4 text-indigo-700 animate-pulse" /> Sinergia Business Intelligence (BI Center)
                </h3>
                <p className="text-[10px] text-slate-400">Compila información real-time, fletes de logística, inventarios independientes y reservación para emitir análisis del ecosistema.</p>
              </div>
            </div>

            {/* Config box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest block font-mono mb-3">Definición de Compilación BI</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">Rango Cronológico</label>
                  <select 
                    value={biTimeRange}
                    onChange={e => setBiTimeRange(e.target.value)}
                    className="w-full bg-white border rounded p-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Este Mes">Este Mes (Actual)</option>
                    <option value="Último Trimestre">Último Trimestre</option>
                    <option value="Año Fiscal 2026">Año Fiscal 2026 completo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 font-mono uppercase">Segmento de Negocio</label>
                  <select
                    value={biReportType}
                    onChange={e => setBiReportType(e.target.value)}
                    className="w-full bg-white border rounded p-2 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Ventas & Crecimiento">Global Ventas & Catálogos</option>
                    <option value="Ocupación Hotelera & Reservas">Ocupación de Hoteles & Turismo</option>
                    <option value="Eficiencia Logística">Tiempos de Despacho Logístico</option>
                    <option value="Conversión Social Hub">Marketing Digital y Social Hub</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setIsBiCompiling(true);
                      setCompiledBiReport(null);
                      setTimeout(() => {
                        setIsBiCompiling(false);
                        const prompts: Record<string, string> = {
                          'Ventas & Crecimiento': `Sinergia Connect BI — Reporte General de Ventas\n======================================================\n\n📌 Rendimiento en SNG Tokens: $14,925.00 CopUSD\n🚀 Ventas Directas Totales de Catálogo: 42 Órdenes registradas.\n🔥 Sucursal Líder: Centro de Distribución - Rionegro (65% del volumen).\n\n💡 Consejos Estratégicos de IA Sinergia:\n- Aumentar el stock del producto "Sensor Capacitivo SNG" en la sucursal Envigado Nordeste, ya que registra un tiempo de rotación de apenas 1.2 días.\n- Se recomienda incorporar pasarela ESCROW directa en los catálogos B2B para acelerar cierres de contrato.`,
                          'Ocupación Hotelera & Reservas': `Sinergia Connect BI — Ocupación Hotelera y Reservas\n======================================================\n\n📌 Ocupación Promedio: 84.5% en la cadena de hoteles.\n📦 Reservas de Tours Eje Cafetero: 18 completas este mes.\n💼 Satisfacción global: ⭐ 4.9 estrellas.\n\n💡 Consejos Estratégicos de IA Sinergia:\n- Incrementar en un 10% las tarifas de fin de semana debido a sobredemanda de turismo local en la zona de Llanogrande.\n- Promover paquetes de tours familiares combinados con un 15% de descuento en fletes de distribución comercial para empresas aliadas.`,
                          'Eficiencia Logística': `Sinergia Connect BI — Eficiencia Logística y Fletes\n======================================================\n\n📌 Eficiencia de Despachos: 96.8% a tiempo.\n⏱️ Tiempo Promedio de Tránsito: 4.8 horas en Envigado.\n🚛 Solicitudes procesadas: 12 cargas completadas.\n\n💡 Consejos Estratégicos de IA Sinergia:\n- Se identifican demoras de hasta 40 minutos en la ruta norte durante las horas pico. Reasignar choferes de relevo.\n- Usar tokens SNG para liquidación instantánea del conductor con el objetivo de maximizar satisfacción.`,
                          'Conversión Social Hub': `Sinergia Connect BI — Analíticas de Marketing de Social Hub\n======================================================\n\n📌 Alcance Total: 45,900 impresiones acumuladas.\n💬 Engagement Promedio: 12.8% en Meta API y Instagram Direct.\n🔥 Leads Capturados con ManyChat Auto-flow: 34 Clientes potenciales.\n\n💡 Consejos Estratégicos de IA Sinergia:\n- El trigger automatizado "catalogo" es el que registra mayor conversión (27 leads). Diseñar un flujo similar para la palabra clave "descuentos".\n- Lanzar una campaña cruzada simultánea en LinkedIn enfocada en turismo corporativo.`
                        };
                        setCompiledBiReport(prompts[biReportType]);
                        onAddAuditLog('Reporte BI Generado', `Compilación ejecutiva para el departamento "${biReportType}"`);
                        triggerNotification('Reporte BI Compilado', 'Análisis inteligente emitido con éxito.', 'system' as any);
                      }, 1000);
                    }}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-750 text-white font-mono font-bold uppercase rounded-lg text-xs"
                  >
                    {isBiCompiling ? 'Calculando con IA...' : 'Compilar Reporte Ejecutivo'}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated executive document with interactive chart */}
            {isBiCompiling && (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2 select-none">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin inline-block" />
                <p className="font-bold text-slate-700 animate-pulse">Consultando base de datos descentralizada de inquilinos...</p>
                <p className="text-[10px]">Agrupando inventarios de sucursales, facturas resguardadas e interacciones del Social Hub.</p>
              </div>
            )}

            {compiledBiReport && !isBiCompiling && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Text Report */}
                <div className="p-5 bg-slate-950 text-indigo-300 font-mono text-[11px] rounded-xl border border-slate-800 space-y-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">DOCUMENTO CONFIDENCIAL SAAS</span>
                  <p className="whitespace-pre-line leading-relaxed text-indigo-200">{compiledBiReport}</p>
                  
                  <div className="pt-2 flex justify-between border-t border-slate-900">
                    <button
                      onClick={() => {
                        alert('Reporte comercial descargado en caché local corporativo (Sinergia_BI_Report.pdf)');
                        triggerNotification('Descarga exitosa', 'Reporte exportado.', 'system' as any);
                      }}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded uppercase text-[9.5px]"
                    >
                      Exportar Reporte Comercial
                    </button>
                    <span className="text-[9.5px] text-slate-500 my-auto">Sinergia BI Engine v2.0</span>
                  </div>
                </div>

                {/* SVG Visual Metrics Chart */}
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
                  <span className="text-[10.5px] font-bold text-slate-700 block tracking-wider uppercase font-mono">Tendencia del Rendimiento Semanal (KPI Compilado)</span>
                  
                  <svg viewBox="0 0 320 180" className="w-full h-auto bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    {/* Y Axis markings */}
                    <line x1="20" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="20" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="20" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="20" y1="140" x2="300" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Bar columns representing the variables dynamically depending on report type */}
                    {biReportType === 'Ventas & Crecimiento' ? (
                      <>
                        <rect x="50" y="80" width="22" height="60" rx="3" fill="#6366f1" />
                        <rect x="110" y="50" width="22" height="90" rx="3" fill="#6366f1" />
                        <rect x="170" y="30" width="22" height="110" rx="3" fill="#6366f1" />
                        <rect x="230" y="15" width="22" height="125" rx="3" fill="#10b981" />
                      </>
                    ) : biReportType === 'Ocupación Hotelera & Reservas' ? (
                      <>
                        <rect x="50" y="40" width="22" height="100" rx="3" fill="#f59e0b" />
                        <rect x="110" y="30" width="22" height="110" rx="3" fill="#f59e0b" />
                        <rect x="170" y="45" width="22" height="95" rx="3" fill="#f59e0b" />
                        <rect x="230" y="25" width="22" height="115" rx="3" fill="#10b981" />
                      </>
                    ) : (
                      <>
                        <rect x="50" y="60" width="22" height="80" rx="3" fill="#3b82f6" />
                        <rect x="110" y="80" width="22" height="60" rx="3" fill="#3b82f6" />
                        <rect x="170" y="40" width="22" height="100" rx="3" fill="#3b82f6" />
                        <rect x="230" y="20" width="22" height="120" rx="3" fill="#10b981" />
                      </>
                    )}

                    {/* Labels */}
                    <text x="61" y="155" fontSize="8.5" fill="#64748b" textAnchor="middle" fontWeight="bold">S1</text>
                    <text x="121" y="155" fontSize="8.5" fill="#64748b" textAnchor="middle" fontWeight="bold">S2</text>
                    <text x="181" y="155" fontSize="8.5" fill="#64748b" textAnchor="middle" fontWeight="bold">S3</text>
                    <text x="241" y="155" fontSize="8.5" fill="#1e293b" textAnchor="middle" fontWeight="black">S4 (Actual)</text>

                    {/* Meta labels of metric weight */}
                    <text x="305" y="25" fontSize="8" fill="#94a3b8" textAnchor="start">Excelente</text>
                    <text x="305" y="145" fontSize="8" fill="#94a3b8" textAnchor="start">Límite</text>
                  </svg>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans text-center">La barra destaca el avance de rendimiento acumulado versus las metas preestablecidas por el Super Administrador.</p>
                </div>

              </div>
            )}

            {!compiledBiReport && !isBiCompiling && (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center text-xs text-slate-450 select-none">
                <span className="text-3xl block">📊</span>
                <p className="font-bold text-slate-700 mt-2">No se ha compilado ningún reporte</p>
                <p>Elige el segmento de tu negocio en el panel de arriba y presiona "Compilar Reporte Ejecutivo".</p>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            MÓDULO 6: PLAN DE CRECIMIENTO DEL ECOSISTEMA (ROADMAP) 
           ========================================================= */}
        {activeSubTab === 'growth' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Award className="w-4 h-4 text-indigo-650" /> Plan de Crecimiento & Visión del Ecosistema
                </h3>
                <p className="text-[10px] text-slate-400">Sinergia Connect todo en uno: del Directorio Empresarial al Marketplace global con control absoluto.</p>
              </div>
            </div>

            {/* Complete Chronological Interactive Roadmap timeline (8 Phases) */}
            <div className="space-y-6">
              
              <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8 select-none">
                
                {[
                  { phase: 'FASE 1', title: 'Marketplace Empresarial', status: 'COMPLETADO', color: 'bg-emerald-500 font-bold text-white', desc: 'Senda de integración de tiendas descentralizadas, perfiles de inquilinos, fletes de carga locales y pasarela de pago.' },
                  { phase: 'FASE 2', title: 'ERP Empresarial Integrado', status: 'ACTIVO EN PLATAFORMA', color: 'bg-indigo-650 font-bold text-white shadow', desc: 'Sistemas de facturación unificada, liquidación mensual por comisiones SaaS, auditoría instantánea para el Super Administrador y balance de liquidez en tokens.' },
                  { phase: 'FASE 3', title: 'CRM Empresarial', status: 'ACTIVO EN PLATAFORMA', color: 'bg-indigo-650 font-bold text-white shadow', desc: 'Social Hub para canalizar múltiples redes, publicación centralizada programable en checklists de conexión, automatización con triggers de disparo, bandeja unificada y CRM.' },
                  { phase: 'FASE 4', title: 'Bolsa de Negocios B2B', status: 'PLANIFICADO', color: 'bg-slate-300 font-bold text-slate-700', desc: 'Sinergia de transacciones corporativas directas por volumen, permutas comerciales de largo alcance y alianzas de fletes industriales entre inquilinos autorizados.' },
                  { phase: 'FASE 5', title: 'IA Empresarial Avanzada', status: 'EN DESARROLLO', color: 'bg-indigo-100 font-bold text-indigo-700 border border-indigo-200', desc: 'Integración avanzada con Gemini para generación de campañas de marketing digital completas, automatización de chat omnicanal, y preselección inteligente de fletes.' },
                  { phase: 'FASE 6', title: 'Centro de Inteligencia Comercial', status: 'PLANIFICADO', color: 'bg-slate-300 font-bold text-slate-700', desc: 'Business Intelligence avanzado compilador de KPIs históricos de ventas, ocupación de turismo local, stock descentralizado y conversiones globales del ecosistema.' },
                  { phase: 'FASE 7', title: 'Expansión Nacional', status: 'PLANIFICADO', color: 'bg-slate-300 font-bold text-slate-700', desc: 'Habilitación de marca blanca para empresas asociadas en Bogotá, Cali y Barranquilla con total autonomía operativa pero bajo el Sello Central Sinergia.' },
                  { phase: 'FASE 8', title: 'Expansión Internacional', status: 'PLANIFICADO', color: 'bg-slate-300 font-bold text-slate-700', desc: 'Internacionalización comercial del ecosistema conectando inquilinos multisucursales en Latinoamérica con pagos directos ZeroTrust SNG.' }
                ].map((roadmap, index) => (
                  <div key={roadmap.phase} className="relative select-none hover:bg-slate-50 p-2.5 rounded-lg transition-all">
                    
                    {/* Circle timeline anchor */}
                    <div className="absolute -left-[31px] top-3.5 w-4.5 h-4.5 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9.5px] font-black text-indigo-600 tracking-wider">[{roadmap.phase}]</span>
                          <h4 className="font-extrabold text-xs text-slate-800">{roadmap.title}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono tracking-widest ${roadmap.color}`}>
                          {roadmap.status}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 font-sans leading-relaxed">{roadmap.desc}</p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* Quick interactive user feedback box for growth suggestions */}
            <div className="bg-slate-50 p-4 border rounded-xl space-y-3.5">
              <span className="text-[10.5px] uppercase font-bold text-slate-600 block tracking-wider font-mono">Suro de Propuestas de Crecimiento (Feedback Canalizado)</span>
              
              <div className="text-xs space-y-2">
                <p className="text-[10px] text-slate-400">¿Echas en falta alguna herramienta en nuestra Visión Final? Envía sugerencias directamente al Sindicato del Super Administrador.</p>
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    id="growth-feedback-input"
                    className="flex-1 bg-white border p-2 rounded-lg text-xs" 
                    placeholder="ej. Sistema de contabilidad tributaria integrado..."
                  />
                  <button
                    onClick={() => {
                      const inp = document.getElementById('growth-feedback-input') as HTMLInputElement;
                      if (!inp || !inp.value.trim()) {
                        alert('Escribe tu propuesta comercial primero.');
                        return;
                      }
                      onAddAuditLog('Sugerencia Roadmap Enviada', `Propuesta enviat de expansión: "${inp.value}"`);
                      triggerNotification('Propuesta Enviada', 'Tu sugerencia se canalizó con el Super Administrador.', 'system' as any);
                      inp.value = '';
                    }}
                    className="px-4 py-2 bg-indigo-650 hover:bg-slate-900 text-white rounded-lg font-bold uppercase text-[10px]"
                  >
                    Enviar Propuesta
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MODAL: REGISTER PRODUCT FOR THIS COMPANY ONLY */}
      {showAddProd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-slate-200">
            <button
              onClick={() => setShowAddProd(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-4">Añadir Nuevo Producto (Tenant {currentCompany.name})</h3>
            
            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Comercial del Producto</label>
                <input
                  type="text"
                  placeholder="ej. Componente SNG v2"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Precio Unitario (USD)</label>
                  <input
                    type="number"
                    placeholder="45.00"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded focus:outline-none text-right font-mono"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Stock Inicial (unidades)</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded focus:outline-none text-right font-mono"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Categoría Oficial</label>
                <select
                  value={newProdCat}
                  onChange={(e) => setNewProdCat(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded bg-white focus:outline-none"
                >
                  <option value="Electrónica">Electrónica</option>
                  <option value="Audio">Audio</option>
                  <option value="Hogar">Hogar</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Descripción Breve o Características</label>
                <textarea
                  placeholder="Confeccionada con lona resistente para senderismo..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded h-16 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white rounded font-bold transition-colors uppercase tracking-widest text-[10px] mt-4"
              >
                Añadir al catálogo de Tienda
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
