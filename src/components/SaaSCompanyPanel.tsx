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
  CreditCard
} from 'lucide-react';

interface SaaSCompanyPanelProps {
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
  currentCompany,
  products,
  users,
  onAddProduct,
  onDeleteProduct,
  onUpdateCompany,
  onAddAuditLog,
  triggerNotification
}: SaaSCompanyPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'products' | 'orders' | 'billing' | 'stats'>('profile');
  
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
        <div className="flex bg-slate-200/50 border border-slate-200/80 p-1 rounded-xl text-[10.5px]">
          {([
            { id: 'profile', label: 'Mi Perfil' },
            { id: 'products', label: 'Mis Productos' },
            { id: 'orders', label: 'Pedidos / Reservas' },
            { id: 'billing', label: 'Liquidación / Facturas' },
            { id: 'stats', label: 'Estadísticas' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 font-bold rounded-lg transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-white text-indigo-705 shadow-xs'
                  : 'text-slate-505 hover:text-slate-800'
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
