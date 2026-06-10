import React, { useState } from 'react';
import { 
  Company, 
  Product, 
  LogisticsRequest, 
  AuditLog, 
  UserRole, 
  UserProfile,
  Transaction,
  Wallet 
} from '../types';
import { 
  ShieldAlert, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  Lock, 
  Download, 
  ListOrdered, 
  Building2, 
  Package, 
  TrendingUp, 
  FolderLock, 
  UserPlus, 
  X, 
  Play, 
  Fingerprint 
} from 'lucide-react';

interface AdminDashboardProps {
  currentRole: UserRole;
  companies: Company[];
  products: Product[];
  logistics: LogisticsRequest[];
  auditLogs: AuditLog[];
  transactions: Transaction[];
  wallets: Wallet[];
  onAddCompany: (comp: Omit<Company, 'id' | 'createdAt'>) => void;
  onUpdateCompany: (id: string, updates: Partial<Company>) => void;
  onDeleteCompany: (id: string) => void;
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onDeleteProduct: (id: string) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export default function AdminDashboard({
  currentRole,
  companies,
  products,
  logistics,
  auditLogs,
  transactions,
  wallets,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onAddProduct,
  onDeleteProduct,
  onAddAuditLog
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'tenants' | 'audit' | 'inventory' | 'reports'>('tenants');
  
  // New tenant state
  const [newCompName, setNewCompName] = useState('');
  const [newCompType, setNewCompType] = useState<Company['type']>('retail');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompLogo, setNewCompLogo] = useState('🏢');
  const [showCompModal, setShowCompModal] = useState(false);

  // New product state
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCat, setNewProdCat] = useState('Electrónica');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState('10');
  const [showProdModal, setShowProdModal] = useState(false);

  // Report generator state
  const [reportType, setReportType] = useState<'excel' | 'pdf' | 'csv'>('csv');
  const [reportTarget, setReportTarget] = useState<'audit_trail' | 'financial_ledger' | 'tenant_status'>('audit_trail');
  const [exportedData, setExportedData] = useState<string | null>(null);

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName || !newCompEmail) {
      alert('Ingresa el nombre y correo de la empresa.');
      return;
    }
    
    onAddCompany({
      name: newCompName,
      type: newCompType,
      status: 'active',
      logo: newCompLogo,
      email: newCompEmail,
      phone: newCompPhone || '+57 300 000 0000',
      rating: 5.0
    });

    onAddAuditLog(
      'Creación de Tenant',
      `Se dio de alta el inquilino corporativo "${newCompName}" tipo: ${newCompType}`
    );

    setNewCompName('');
    setNewCompEmail('');
    setNewCompPhone('');
    setShowCompModal(false);
    alert('✔ ¡Empresa registrada con éxito en el tenant pool!');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newProdPrice);
    const stock = parseInt(newProdStock);

    if (!newProdName || isNaN(price) || isNaN(stock)) {
      alert('Por favor digita datos de inventario válidos.');
      return;
    }

    onAddProduct({
      name: newProdName,
      price,
      category: newProdCat,
      description: newProdDesc || 'Sin descripción detallada.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80',
      rating: 5.0,
      stock,
      companyId: 'comp-2',
      companyName: 'Mercado Sinergia Super Store'
    });

    onAddAuditLog(
      'Creación Producto',
      `Añadido nuevo producto direct: "${newProdName}" al catálogo general`
    );

    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setShowProdModal(false);
    alert('✔ Producto añadido con éxito al catálogo de Sinergia.');
  };

  const toggleCompanyStatus = (comp: Company) => {
    const nextStatus = comp.status === 'active' ? 'suspended' : 'active';
    onUpdateCompany(comp.id, { status: nextStatus });
    
    onAddAuditLog(
      'Actualización Tenant',
      `Estado de la empresa ${comp.name} actualizado de ${comp.status} a ${nextStatus}`
    );
  };

  const handleDeleteComp = (id: string) => {
    if (!confirm('¿Estás seguro de que deseas desincorporar permanentemente este tenant de la base de datos de Sinergia Connect?')) return;
    onDeleteCompany(id);
    onAddAuditLog('Eliminación Tenant', `Eliminado ID de tenant: ${id}`);
  };

  const handleCompileReport = () => {
    let output = '';
    if (reportTarget === 'audit_trail') {
      output = `ID,Actor,Rol,Accion,Detalles,Timestamp,IP\n`;
      auditLogs.forEach(log => {
        output += `"${log.id}","${log.actorName}","${log.actorRole}","${log.action}","${log.details}","${log.timestamp}","${log.ipAddress}"\n`;
      });
    } else if (reportTarget === 'financial_ledger') {
      output = `ID,Usuario,Comercio/Detalle,Monto (USD),Estado,Fecha\n`;
      transactions.forEach(tx => {
        output += `"${tx.id}","${tx.userId}","${tx.description}",$${tx.amount.toFixed(2)},"${tx.status}","${tx.timestamp}"\n`;
      });
    } else {
      output = `Tenant ID,Nombre Inquilino,Estructura SaaS,Status,Creado el\n`;
      companies.forEach(c => {
        output += `"${c.id}","${c.name}","${c.type}","${c.status}","${c.createdAt}"\n`;
      });
    }

    setExportedData(output);
  };

  const downloadReportFile = () => {
    if (!exportedData) return;
    const blob = new Blob([exportedData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sinergia_connect_report_${reportTarget}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasSuperAccess = currentRole === 'super_admin' || currentRole === 'company_admin';

  if (!hasSuperAccess) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-12">
        <Lock className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h3 className="font-bold text-slate-800 text-lg">Área Restringida por Roles (RBAC)</h3>
        <p className="text-xs text-slate-500 leading-relaxed">Su rol actual es <span className="font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded-full font-mono">{currentRole}</span>. No cuenta con permisos administrativos para operar las llaves globales del Tenant Pool.</p>
        <div className="p-3 bg-slate-50 text-[10px] text-slate-500 rounded-lg">
          💡 Puedes cambiar tu nivel de rol en el <strong>Selector de Rol Superior</strong> en el encabezado principal de la aplicación.
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">🛡️</span>
            Sinergia Connect SaaS Administration Panel
          </h2>
          <p className="text-sm text-slate-500 font-mono">Control de inquilinos, inventario de productos, logs de auditoría y reportes exportables</p>
        </div>

        {/* Local Admin Navigation Menu */}
        <div className="flex bg-slate-200/60 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            id="admin-subtab-tenants"
            onClick={() => setActiveSubTab('tenants')}
            className={`px-3 py-1.5 font-bold rounded transition-colors ${activeSubTab === 'tenants' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Gestión Multitenant ({companies.length})
          </button>
          <button
            id="admin-subtab-inventory"
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3 py-1.5 font-bold rounded transition-colors ${activeSubTab === 'inventory' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Inventario Catálogo
          </button>
          <button
            id="admin-subtab-audit"
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 font-bold rounded transition-colors ${activeSubTab === 'audit' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Auditoría Acciones
          </button>
          <button
            id="admin-subtab-reports"
            onClick={() => setActiveSubTab('reports')}
            className={`px-3 py-1.5 font-bold rounded transition-colors ${activeSubTab === 'reports' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Compilador Reportes
          </button>
        </div>
      </div>

      {currentRole === 'company_admin' && (
        <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs mb-6 border border-amber-200 flex items-center gap-2 font-medium">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Acceso limitado: Rol **Administrador de Empresa**. Puedes ver datos, pero las acciones CRUD estructurales requieren rol **Super Admin**.</span>
        </div>
      )}

      {/* SUB-TABS VIEWS */}

      {/* Subtab 1: Tenants List & Actions */}
      {activeSubTab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Directorio de Empresas Conectadas (Inquilinos)
            </h3>
            {currentRole === 'super_admin' && (
              <button
                id="btn-add-tenant"
                onClick={() => setShowCompModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Alta de Empresa (SaaS)
              </button>
            )}
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 font-bold uppercase select-none">
                  <th className="py-3 px-4">Inquilino / Logo</th>
                  <th className="py-3 px-4">Tipo SaaS</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Fecha Alta</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  {currentRole === 'super_admin' && <th className="py-3 px-4 text-right">Acción Estructural</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {companies.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-50/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl p-1 bg-slate-100 rounded-lg">{comp.logo}</span>
                        <div>
                          <p className="font-bold text-slate-800">{comp.name}</p>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">{comp.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 font-extrabold capitalize text-[10px]">
                        {comp.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-700">{comp.email}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{comp.phone}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{comp.createdAt}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => currentRole === 'super_admin' ? toggleCompanyStatus(comp) : null}
                        className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase cursor-pointer ${
                          comp.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                        disabled={currentRole !== 'super_admin'}
                      >
                        {comp.status}
                      </button>
                    </td>
                    {currentRole === 'super_admin' && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteComp(comp.id)}
                          className="text-rose-650 hover:text-rose-800 hover:bg-rose-50 p-2 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Marketplace Inventory Management */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
              <Package className="w-4.5 h-4.5 text-indigo-650" />
              Gestión Maestra de Productos
            </h3>
            {currentRole === 'super_admin' && (
              <button
                id="btn-add-product"
                onClick={() => setShowProdModal(true)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Crear Nuevo Producto
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(prod => (
              <div key={prod.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono font-black text-rose-600">${prod.price.toFixed(2)} USD</span>
                    {currentRole === 'super_admin' && (
                      <button
                        onClick={() => { onDeleteProduct(prod.id); onAddAuditLog('Eliminación Producto', `Eliminado ID: ${prod.id} (${prod.name})`); }}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs mt-2 line-clamp-1">{prod.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 lines-clamp-2 leading-relaxed">{prod.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-mono">
                  <span>Stock: <strong>{prod.stock}u</strong></span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded select-none text-[9px] font-bold uppercase">{prod.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Action Audit Ledger */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1">
              <Fingerprint className="w-4.5 h-4.5 text-indigo-700" />
              Auditoría y Bitácora Estructural de Operaciones (Logs)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Sandbox Trace IP</span>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 font-bold uppercase">
                  <th className="py-2.5 px-4 font-mono">Log ID</th>
                  <th className="py-2.5 px-4">Fecha y Hora</th>
                  <th className="py-2.5 px-4">Operador</th>
                  <th className="py-2.5 px-4">Nivel Rol</th>
                  <th className="py-2.5 px-4">Categoría Action</th>
                  <th className="py-2.5 px-4">Detalles Técnicas</th>
                  <th className="py-2.5 px-4 text-right">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/30">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500">{log.id}</td>
                    <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-800 font-bold">{log.actorName}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        log.actorRole === 'super_admin' ? 'bg-indigo-150 text-indigo-805 font-black' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">{log.action}</td>
                    <td className="py-3 px-4 text-slate-500">{log.details}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Reports Generator Engine */}
      {activeSubTab === 'reports' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 uppercase">
              <Download className="w-5 h-5 text-indigo-600" />
              Compilador y Exportador de Reportes Corporativos
            </h3>
            <p className="text-xs text-slate-400 mt-1">Generación dinámica de auditoría y flujos financieros multiempresa de Sinergia Connect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">1. Seleccionar la Ficha de Origen</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="reportTarget"
                      checked={reportTarget === 'audit_trail'}
                      onChange={() => { setReportTarget('audit_trail'); setExportedData(null); }}
                    />
                    <span>Bitácora de Auditoría de Acciones ({auditLogs.length} registros)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="reportTarget"
                      checked={reportTarget === 'financial_ledger'}
                      onChange={() => { setReportTarget('financial_ledger'); setExportedData(null); }}
                    />
                    <span>Libro Diario de Pagos y Wallet ({transactions.length} registros)</span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 border border-slate-200 rounded-lg text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="reportTarget"
                      checked={reportTarget === 'tenant_status'}
                      onChange={() => { setReportTarget('tenant_status'); setExportedData(null); }}
                    />
                    <span>Catálogo de Inquilinos y Estado SaaS ({companies.length} registros)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">2. Formato de Compilación</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-lg">
                  {(['csv', 'excel', 'pdf'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setReportType(fmt)}
                      className={`py-1 text-[10px] font-bold rounded uppercase transition-all ${
                        reportType === fmt ? 'bg-white text-indigo-700 shadow-sm font-black' : 'text-slate-500'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-trigger-compile-report"
                onClick={handleCompileReport}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wide transition-all"
              >
                Generar Vista Previa del Reporte
              </button>
            </div>

            {/* Compiled Preview Window */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 block pb-1 border-b border-slate-200 uppercase">Vista Previa de Generación</span>
                
                {exportedData ? (
                  <pre className="text-[10px] font-mono text-slate-600 bg-white p-3 rounded border border-slate-200 max-h-[160px] overflow-y-auto mt-2 leading-tight">
                    {exportedData}
                  </pre>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    Ninguna consulta compilada. Presiona "Generar Vista Previa" para previsualizar los registros en Sandbox.
                  </div>
                )}
              </div>

              {exportedData && (
                <button
                  id="btn-download-compiled-report"
                  onClick={downloadReportFile}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mt-4 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar Archivo ({reportType.toUpperCase()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. Modal Create Company Tenant */}
      {showCompModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-slate-200">
            <button
              onClick={() => setShowCompModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-4">Incorporar Nueva Empresa Inquilina (SaaS Multi-tenant)</h3>
            
            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Comercial de la Empresa</label>
                <input
                  type="text"
                  placeholder="Insumos del Valle"
                  value={newCompName}
                  onChange={(e) => setNewCompName(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Estructura Corporativa</label>
                  <select
                    value={newCompType}
                    onChange={(e) => setNewCompType(e.target.value as Company['type'])}
                    className="w-full border border-slate-200 p-2 rounded focus:outline-none bg-white"
                  >
                    <option value="retail">Tienda / Retail</option>
                    <option value="logistics">Carga / Logística</option>
                    <option value="hospitality">Hotelería / Hospedaje</option>
                    <option value="tourism">Operador Turístico</option>
                    <option value="professional">Profesional Independiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Logotipo (Emoji)</label>
                  <input
                    type="text"
                    value={newCompLogo}
                    onChange={(e) => setNewCompLogo(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded focus:outline-none text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Correo Enlace Principal</label>
                <input
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={newCompEmail}
                  onChange={(e) => setNewCompEmail(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Teléfono Contacto</label>
                <input
                  type="text"
                  placeholder="+57 312 400 4040"
                  value={newCompPhone}
                  onChange={(e) => setNewCompPhone(e.target.value)}
                  className="w-full border border-slate-200 p-2 rounded focus:outline-none"
                />
              </div>

              <button
                id="submit-new-tenant-modal"
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-colors uppercase tracking-widest text-[10px] mt-4"
              >
                Registrar Inquilino en Sandbox
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Create Product */}
      {showProdModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-slate-200">
            <button
              onClick={() => setShowProdModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-slate-900 text-sm mb-4">Añadir Nuevo Producto al E-Commerce</h3>
            
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Nombre Comercial del Producto</label>
                <input
                  type="text"
                  placeholder="Mochila impermeable de viaje"
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
                <label className="block text-[10px] font-bold text-slate-600 text-slate-500 mb-1">Categoría Oficial</label>
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
                id="submit-new-product-modal"
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-colors uppercase tracking-widest text-[10px] mt-4"
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
