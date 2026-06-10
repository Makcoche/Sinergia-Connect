import React, { useState, useEffect } from 'react';
import { LogisticsRequest, Wallet } from '../types';
import { Truck, MapPin, Scale, ShieldAlert, Sparkles, Navigation, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface LogisticsModuleProps {
  logisticsRequests: LogisticsRequest[];
  wallet: Wallet;
  onCreateRequest: (request: Omit<LogisticsRequest, 'id' | 'createdAt' | 'progress' | 'companyId'>) => void;
  onUpdateStatus: (id: string, status: LogisticsRequest['status'], progress: number) => void;
}

export default function LogisticsModule({ logisticsRequests, wallet, onCreateRequest, onUpdateStatus }: LogisticsModuleProps) {
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [cargoType, setCargoType] = useState<'cargo' | 'relocation' | 'refrigerated'>('cargo');
  const [desc, setDesc] = useState('');
  const [weight, setWeight] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Real-time progress simulator triggers
  const [simulatedTransitId, setSimulatedTransitId] = useState<string | null>(null);

  // Auto progression driver simulation interval
  useEffect(() => {
    const transitRequests = logisticsRequests.filter(req => req.status === 'in_transit');
    if (transitRequests.length === 0) return;

    const interval = setInterval(() => {
      transitRequests.forEach(req => {
        const nextProgress = req.progress + 15;
        if (nextProgress >= 100) {
          onUpdateStatus(req.id, 'delivered', 100);
        } else {
          onUpdateStatus(req.id, 'in_transit', nextProgress);
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [logisticsRequests, onUpdateStatus]);

  const calculateEstimate = () => {
    const basePrices = {
      cargo: 1.5, // USD per Kg
      relocation: 2.2, // USD per Kg 
      refrigerated: 3.8 // USD per Kg (Requires precise temperature control triggers)
    };
    const rate = basePrices[cargoType];
    const w = parseFloat(weight) || 0;
    return w * rate * 0.15 + 120; // Simulated scaling calculation with baseline
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!pickup || !delivery || !desc || isNaN(w) || w <= 0) {
      alert('Por favor completa todos los campos del envío para calcular la cotización.');
      return;
    }

    const estimatedCost = calculateEstimate();

    // Verify wallet balance is available for draft creation
    if (estimatedCost > wallet.balanceCopUSD) {
      alert(`⚠️ Saldo insuficiente en la Wallet interna. La cotización aproximada es de $${estimatedCost.toFixed(2)} USD.`);
      return;
    }

    onCreateRequest({
      type: cargoType,
      senderName: 'Usuario Autenticado',
      pickupAddress: pickup,
      deliveryAddress: delivery,
      cargoDescription: desc,
      weightKg: w,
      price: estimatedCost,
      status: 'pending',
    });

    setPickup('');
    setDelivery('');
    setDesc('');
    setWeight('');
    setShowForm(false);
    alert(`✔ Cotización enviada. Un transportador de red afiliado revisará la solicitud de carga #${Math.floor(Math.random() * 8000 + 1000)} en segundos.`);
  };

  const handleSimulateDispatch = (id: string) => {
    onUpdateStatus(id, 'assigned', 10);
    setTimeout(() => {
      onUpdateStatus(id, 'in_transit', 35);
    }, 2000);
  };

  const totalCost = calculateEstimate();

  return (
    <div id="logistics-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">🚚</span>
            Servicio Logístico & Carga Pesada
          </h2>
          <p className="text-sm text-slate-500">Gestión de mudanzas, mercancía refrigerada a nivel nacional e industrial</p>
        </div>

        <button
          id="btn-new-freight"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-500/10 transition-colors flex items-center gap-1"
        >
          <Truck className="w-4 h-4" />
          {showForm ? 'Cerrar Cotizador' : 'Nueva Cotización de Carga'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Form Container (Full or partial conditional column grid) */}
        {showForm && (
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Ingresa los Datos del Envío
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tipo de Servicio Logístico</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                  {(['cargo', 'relocation', 'refrigerated'] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setCargoType(type)}
                      className={`py-1 text-[9px] font-bold rounded capitalize transition-all ${
                        cargoType === type ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-500'
                      }`}
                    >
                      {type === 'cargo' ? 'Carga general' : type === 'relocation' ? 'Mudanzas' : 'Refrigerado'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Dirección de Origen / Recogida</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-emerald-500" />
                  <input
                    type="text"
                    placeholder="Calle 100 #15-30, Bogotá (Sede Carga)"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Dirección Destino / Entrega</label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-rose-500" />
                  <input
                    type="text"
                    placeholder="Terminal Multimodal, Medellín"
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Peso estimado (Kg)</label>
                  <div className="relative">
                    <Scale className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      placeholder="1200"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none text-right font-mono"
                      required
                      min="5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Descripción de Mercancía</label>
                  <input
                    type="text"
                    placeholder="Cajas de alimentos, madera, etc."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Costo Estimado</span>
                  <span className="font-mono text-emerald-600">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed mt-1">Estimación variable basada en el tipo de producto e insumos refrigerados requeridos.</p>
              </div>

              <button
                id="btn-submit-freight"
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Deseo Solicitar Transportador
              </button>
            </form>
          </div>
        )}

        {/* Vector Tracking Map: Dynamic Visual Widget */}
        <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'} grid grid-cols-1 md:grid-cols-12 gap-6`}>
          
          {/* Active Shipments Route list */}
          <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase flex items-center justify-between">
              <span>Ordenes de Carga Activas</span>
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-mono font-bold">Total: {logisticsRequests.length}</span>
            </h3>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {logisticsRequests.map(req => (
                <div key={req.id} className="p-3 border border-slate-150 rounded-xl hover:bg-slate-50/50 transition-colors flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-extrabold uppercase font-mono">{req.type}</span>
                        <span className="text-xs font-bold text-slate-700">#{req.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{req.cargoDescription}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black text-rose-500 font-mono">${req.price.toFixed(2)} USD</p>
                      <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-black uppercase mt-1 ${
                        req.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'in_transit' ? 'bg-sky-100 text-sky-800 animate-pulse' :
                        req.status === 'assigned' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status === 'in_transit' ? `En tránsito • ${req.progress}%` : req.status}
                      </span>
                    </div>
                  </div>

                  {/* Route points */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="truncate"><span className="font-bold text-emerald-600">A:</span> {req.pickupAddress}</p>
                    <p className="truncate"><span className="font-bold text-rose-500">B:</span> {req.deliveryAddress}</p>
                  </div>

                  {/* Transport dispatcher simulator triggers */}
                  {req.status === 'pending' && (
                    <button
                      id={`simulate-dispatch-${req.id}`}
                      onClick={() => handleSimulateDispatch(req.id)}
                      className="w-full py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[9px] font-extrabold uppercase transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Asignar y simular recorrido dinámico
                    </button>
                  )}

                  {req.status === 'in_transit' && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold text-indigo-700">
                        <span>Análisis de Sensor GPS</span>
                        <span>Velocidad: 68 Km/h</span>
                      </div>
                      <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${req.progress}%` }} />
                      </div>
                    </div>
                  )}

                  {req.status === 'delivered' && (
                    <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 p-1.5 rounded border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Entregado por: {req.driverName || 'Manuel Beltrán'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SVG map tracker visualizer */}
          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase flex items-center gap-1">
                <Navigation className="w-4 h-4 text-indigo-600" />
                Ruta Trazador Activo (GPS)
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Simulación interactiva de las rutas comerciales Colombianas.</p>
            </div>

            {/* Custom Interactive SVG mapping matrix */}
            <div className="relative border border-slate-150 rounded-xl bg-slate-950 p-2 my-4 h-52 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                {/* Simulated contour lines */}
                <path d="M10,80 Q50,20 180,60" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                <path d="M30,150 Q100,100 190,160" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" fill-opacity="0.2" />

                {/* Main highway network lines (Bogota - Medellin - Cali - Cartagena) */}
                {/* Route highway 1: Bogota (130, 130) to Medellin (70, 80) */}
                <line x1="130" y1="130" x2="70" y2="80" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />
                {/* Route highway 2: Medellin (70, 80) to Cali (50, 160) */}
                <line x1="70" y1="80" x2="50" y2="160" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />
                {/* Route highway 3: Medellin (70, 80) to Cartagena (60, 30) */}
                <line x1="70" y1="80" x2="60" y2="30" stroke="#334155" strokeWidth="2" strokeDasharray="3,3" />

                {/* Draw active truck location indicator */}
                {logisticsRequests.map((req, idx) => {
                  if (req.status !== 'in_transit') return null;
                  
                  // Interpolate coordinates based on progress between A (Bogota 130,130) and B (Medellin 70,80)
                  const startX = 130;
                  const startY = 130;
                  const endX = 70;
                  const endY = 80;
                  const frac = req.progress / 100;
                  const curX = startX + (endX - startX) * frac;
                  const curY = startY + (endY - startY) * frac;

                  return (
                    <g key={req.id}>
                      {/* Laser path highlight */}
                      <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="rgba(16, 185, 129, 0.2)" strokeWidth="3" />
                      <line x1={startX} y1={startY} x2={curX} y2={curY} stroke="#10b981" strokeWidth="2" />
                      
                      {/* Pulse beacon radar */}
                      <circle cx={curX} cy={curY} r="6" fill="#10b981" opacity="0.4" className="animate-ping" />
                      <circle cx={curX} cy={curY} r="3" fill="#10b981" />
                      
                      {/* Mini float box */}
                      <text x={curX + 6} y={curY - 4} fill="#10b981" fontSize="5" fontWeight="bold" fontFamily="monospace">
                        TRUCK {req.id} ({req.progress}%)
                      </text>
                    </g>
                  );
                })}

                {/* Map Node Dots with titles */}
                {/* Cartagena Node */}
                <circle cx="60" cy="30" r="3" fill="#6366f1" />
                <text x="65" y="32" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">Cartagena (Hub Norte)</text>

                {/* Medellin Node */}
                <circle cx="70" cy="80" r="4" fill="#38bdf8" />
                <text x="76" y="82" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="sans-serif">Medellín</text>

                {/* Bogota Node */}
                <circle cx="130" cy="130" r="4" fill="#10b981" />
                <text x="136" y="132" fill="#e2e8f0" fontSize="6" fontWeight="bold" fontFamily="sans-serif">Bogotá</text>

                {/* Cali Node */}
                <circle cx="50" cy="160" r="3" fill="#ec4899" />
                <text x="56" y="162" fill="#94a3b8" fontSize="6" fontFamily="sans-serif">Cali (Terminal)</text>
              </svg>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-[9px] text-slate-400 space-y-1">
              <p className="text-white font-bold flex items-center gap-1 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                Leyenda de Navegación Satelital
              </p>
              <p>Los transportadores actualizan periódicamente su estado de viaje mediante GPS. En zona climática controlada se reportan de forma continua los datos de temperatura interna.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
