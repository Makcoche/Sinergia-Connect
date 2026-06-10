import React, { useState } from 'react';
import { ProfessionalService, ServiceContract, Wallet } from '../types';
import { Briefcase, Clock, Calendar, Star, CheckCircle, ShieldCheck, Calculator, Mail } from 'lucide-react';

interface ProfessionalsModuleProps {
  professionals: ProfessionalService[];
  contracts: ServiceContract[];
  wallet: Wallet;
  onHireProfessional: (contract: Omit<ServiceContract, 'id' | 'createdAt'>) => boolean | string;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

export default function ProfessionalsModule({ professionals, contracts, wallet, onHireProfessional, triggerNotification }: ProfessionalsModuleProps) {
  const [selectedProf, setSelectedProf] = useState<ProfessionalService | null>(null);
  const [hours, setHours] = useState('5');
  const [startDate, setStartDate] = useState('2026-06-12');
  const [contractSuccess, setContractSuccess] = useState<string | null>(null);

  const handleHireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf) return;

    const reqHours = parseInt(hours);
    if (isNaN(reqHours) || reqHours <= 0) {
      alert('Por favor introduce un número válido de horas.');
      return;
    }

    const totalPrice = selectedProf.hourlyRate * reqHours;

    if (totalPrice > wallet.balanceCopUSD) {
      alert(`⚠️ Saldo insuficiente en la Wallet interna. El costo total estimado para este contrato de ${reqHours} horas es de $${totalPrice.toFixed(2)} USD.`);
      return;
    }

    const res = onHireProfessional({
      serviceId: selectedProf.id,
      professionalName: selectedProf.name,
      profession: selectedProf.profession,
      clientName: 'Valeria Restrepo',
      hoursRequested: reqHours,
      totalPrice,
      status: 'active',
      startDate,
    });

    if (typeof res === 'string') {
      alert(`Error en el contrato de servicio: ${res}`);
    } else {
      setContractSuccess(`¡Contrato activado! Has reservado ${reqHours} horas con ${selectedProf.name}. Saldo deducido: $${totalPrice.toFixed(2)} USD.`);
      triggerNotification(
        'Contrato iniciado',
        `Servicio profesional de ${selectedProf.name} agendado a partir del ${startDate} por ${reqHours} horas.`,
        'booking'
      );
      setSelectedProf(null);
      setHours('5');
    }
  };

  return (
    <div id="professionals-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">💼</span>
          Directorio de Expertos & Servicios Profesionales
        </h2>
        <p className="text-sm text-slate-500">Contratación ágil por horas para ingeniería, asesoría fiscal, mantenimiento y soportes técnicos calificados</p>
      </div>

      {contractSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Contratación Procesada Exitosamente</p>
            <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">{contractSuccess}</p>
            <button
              onClick={() => setContractSuccess(null)}
              className="text-xs text-indigo-600 underline font-bold mt-2"
            >
              Cerrar y continuar navegando
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Directory Listings */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-800 text-xs tracking-wide uppercase">Profesionales Disponibles en Red</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionals.map(prof => (
              <div key={prof.id} className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-xs transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <img
                      src={prof.avatar}
                      alt={prof.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-150"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{prof.name}</h4>
                      <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide capitalize">{prof.profession}</p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{prof.rating.toFixed(1)} ({prof.completedJobs} Trabajos)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">{prof.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {prof.skills.map(sk => (
                      <span key={sk} className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold font-mono">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">VALOR HORA:</span>
                    <span className="font-mono font-black text-slate-800">${prof.hourlyRate.toFixed(2)} USD</span>
                  </div>

                  <button
                    id={`hire-btn-${prof.id}`}
                    onClick={() => { setSelectedProf(prof); setContractSuccess(null); }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    Cotizar Horas
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Calculator & Booking form */}
        <div className="lg:col-span-1 space-y-4">
          {selectedProf ? (
            <div className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm animate-fade-in space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold uppercase">Formulario de Contratación</span>
                <h3 className="font-bold text-slate-900 text-sm mt-2">Reservar con {selectedProf.name}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Socio afiliado de {selectedProf.companyName}</p>
              </div>

              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Horas Solicitadas</label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-right font-mono"
                      min="1"
                      max="160"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Fecha Programada de Inicio</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tarifa por Hora</span>
                    <span className="font-mono text-slate-800">${selectedProf.hourlyRate.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1.5 mt-1">
                    <span>Estimación Total</span>
                    <span className="font-mono text-rose-600">${(selectedProf.hourlyRate * (parseInt(hours) || 0)).toFixed(2)} USD</span>
                  </div>
                </div>

                <button
                  id="submit-hire-lock"
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Autorizar Contrato de Red
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase flex items-center gap-1">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Panel de Cotización Rápida
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">Selecciona cualquiera de los profesionales calificados listados en la red de Sinergia Connect a la izquierda para cotizar las horas estimadas de su labor y procesar el pago seguro.</p>
              
              <div className="p-3 bg-indigo-50 text-indigo-950 rounded-xl text-[10px] space-y-1.5 border border-indigo-100">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Depósito en Garantía (Escrow)
                </p>
                <p>El dinero debitado es retenido por Sinergia Connect y solo se libera al profesional una vez confirmes que la labor ha concluido de forma satisfactoria.</p>
              </div>
            </div>
          )}

          {/* Active Hire Contracts mini lists */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mis Contratos Activos</h4>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 text-xs">
              {contracts.map(cnt => (
                <div key={cnt.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{cnt.professionalName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{cnt.profession}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800 uppercase">
                      {cnt.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px] border-t border-slate-200/60 pt-1 text-slate-500 font-mono">
                    <span>Horas: {cnt.hoursRequested}h</span>
                    <span className="font-bold text-slate-700">${cnt.totalPrice.toFixed(2)} USD</span>
                  </div>
                </div>
              ))}
              {contracts.length === 0 && (
                <p className="text-center py-4 text-[11px] text-slate-400">Ningún contrato de trabajo activo.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
