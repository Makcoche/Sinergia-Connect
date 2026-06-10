import React, { useState } from 'react';
import { Transaction, Wallet } from '../types';
import { CreditCard, Send, ArrowUpRight, ArrowDownLeft, Database, CircleHelp, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface WalletModuleProps {
  wallet: Wallet;
  transactions: Transaction[];
  onRecharge: (amount: number, description: string) => void;
  onTransfer: (toEmail: string, amount: number, description: string) => boolean | string;
}

export default function WalletModule({ wallet, transactions, onRecharge, onTransfer }: WalletModuleProps) {
  const [rechargeAmount, setRechargeAmount] = useState<string>('');
  const [transferEmail, setTransferEmail] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferDesc, setTransferDesc] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'history'>('overview');
  
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  
  const [cardHolder, setCardHolder] = useState('Valeria Restrepo');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9811');

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) return;
    onRecharge(amount, `Recarga automática vía Tarjeta **** 9811`);
    setRechargeAmount('');
    alert(`¡Depósito exitoso! Se han recargado $${amount.toFixed(2)} USD a tu cuenta.`);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);
    setTransferSuccess(false);

    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      setTransferError('Por favor introduce un monto válido.');
      return;
    }

    if (amount > wallet.balanceCopUSD) {
      setTransferError('Saldo insuficiente para completar la transferencia.');
      return;
    }

    if (!transferEmail.includes('@')) {
      setTransferError('Por favor introduce un correo de destino válido.');
      return;
    }

    const res = onTransfer(transferEmail, amount, transferDesc || `Transferencia inmediata a ${transferEmail}`);
    if (typeof res === 'string') {
      setTransferError(res);
    } else {
      setTransferSuccess(true);
      setTransferAmount('');
      setTransferEmail('');
      setTransferDesc('');
    }
  };

  // SNG conversion (1 USD = 3.5 SNG "Sinergia Tokens")
  const sngRatio = 3.5;
  const sngTokens = wallet.balanceCopUSD * sngRatio;

  return (
    <div id="wallet-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">🏦</span>
            Billetera Digital Multimoneda
          </h2>
          <p className="text-sm text-slate-500">Transacciones inmediatas integradas con tecnología SinergiaConnect</p>
        </div>
        
        {/* Navigation Inside Module */}
        <div className="flex bg-slate-200/60 p-1 rounded-lg border border-slate-200">
          <button 
            id="wallet-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Balance Global
          </button>
          <button 
            id="wallet-tab-actions"
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'actions' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Operar Fondos
          </button>
          <button 
            id="wallet-tab-history"
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Historial ({transactions.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Visual Card Account Balance */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
            {/* Absolute vector details */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs text-indigo-200/70 uppercase tracking-widest font-mono">Billetera Oficial Sinergia</p>
                <h3 className="text-lg font-bold tracking-tight">Sinergia Wallet Gold</h3>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400 font-mono">SNG</span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-indigo-200/70">Saldo Disponible</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-400">${wallet.balanceCopUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  <span className="text-xs font-bold text-slate-300">USD</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-indigo-200/60 font-medium">Equivalente en Tokens Sinergia</p>
                  <p className="text-sm font-extrabold text-amber-300 font-mono">{sngTokens.toLocaleString('en-US', { maximumFractionDigits: 2 })} SNG</p>
                </div>
                <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold">
                  1 USD = {sngRatio} SNG
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-end text-xs font-mono text-slate-400">
              <div>
                <p className="text-[9px] text-slate-500 uppercase">Titular Principal</p>
                <p className="text-white font-semibold">{cardHolder}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase">Número Cuenta</p>
                <p className="text-white tracking-widest">{wallet.accountNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Sinergia Pay Instantáneo
            </h4>
            <p className="text-xs text-slate-500">Usa tus fondos para pagar taxis, reservar cabañas, comprar insumos tecnológicos o contratar carpinteros al instante sin comisiones de intermediación.</p>
            <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-[11px] font-medium flex items-start gap-2 border border-emerald-100">
              <Database className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Transacciones instantáneas respaldadas por contratos inteligentes automatizados en Sandbox de Pruebas.</span>
            </div>
          </div>
        </div>

        {/* Center / Right Columns depends on Tab selected */}
        <div className="lg:col-span-2">
          
          {/* Active Tab: Overview Screen */}
          {activeTab === 'overview' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-3">Balance y Movimientos Recientes</h3>
                <p className="text-xs text-slate-500 mb-4">Revisa de forma resumida tus últimas transacciones comerciales e ingresos a la cuenta.</p>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                  {transactions.slice(0, 4).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund'
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                        }`}>
                          {tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{tx.description}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold font-mono ${
                          tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund'
                            ? 'text-emerald-600' 
                            : 'text-slate-800'
                        }`}>
                          {tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="text-center py-6 text-sm text-slate-400">Sin transacciones registradas.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-xl mt-4">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-indigo-600" />
                  ¿Necesitas recargar saldo rápidamente?
                </span>
                <button
                  onClick={() => setActiveTab('actions')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-lg transition-colors"
                >
                  Ir a Depositar Fondos
                </button>
              </div>
            </div>
          )}

          {/* Active Tab: Actions Screen */}
          {activeTab === 'actions' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Box 1: Recharge via Credit Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Depositar Fondos (Tarjeta Simulada)
                </h4>
                <p className="text-xs text-slate-500 mb-4">Ingresa fondos al instante a tu billetera interna para realizar compras inmediatas.</p>
                
                <form onSubmit={handleRechargeSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Monto de Depósito (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">$</span>
                      <input
                        type="number"
                        placeholder="100.00"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        required
                        min="5"
                        max="10000"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-500 leading-relaxed space-y-1">
                    <p className="font-bold flex justify-between">
                      <span>Tarjeta de Origen:</span>
                      <span className="font-mono text-slate-700">Visa ending in 9811</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Cargos por transacción:</span>
                      <span className="text-emerald-600 font-bold">GRATIS ($0.00)</span>
                    </p>
                  </div>

                  <button
                    id="submit-recharge"
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Confirmar Depósito Automático
                  </button>
                </form>
              </div>

              {/* Box 2: Instant Person to Person Transfer */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Transferir Dinero a un Usuario
                </h4>
                <p className="text-xs text-slate-500 mb-4">Envía dinero sin cargos utilizando el correo electrónico del inquilino u operador.</p>

                <form onSubmit={handleTransferSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Correo Electrónico Destino</label>
                    <input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      value={transferEmail}
                      onChange={(e) => setTransferEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Monto (USD)</label>
                      <input
                        type="number"
                        placeholder="50.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Concepto / Nota (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Pago de insumos"
                        value={transferDesc}
                        onChange={(e) => setTransferDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>

                  {transferError && (
                    <div className="p-2 bg-rose-50 text-rose-800 text-[10px] rounded border border-rose-100 flex items-center gap-1">
                      <span>⚠️ {transferError}</span>
                    </div>
                  )}

                  {transferSuccess && (
                    <div className="p-2 bg-emerald-50 text-emerald-800 text-[10px] rounded border border-emerald-100 flex items-center gap-1">
                      <span>✓ ¡Envío completado exitosamente! El saldo ya está en la cuenta destino.</span>
                    </div>
                  )}

                  <button
                    id="submit-transfer"
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Transferir Fondos Sinergia
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* Active Tab: History Screen */}
          {activeTab === 'history' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Historial Completo de Transacciones</h3>
              <p className="text-xs text-slate-500 mb-4">Listado de ingresos, transferencias enviadas, reembolsos y pagos autorizados del tenant.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5 px-3">ID Transacción</th>
                      <th className="py-2.5 px-3">Fecha y Hora</th>
                      <th className="py-2.5 px-3">Descripción</th>
                      <th className="py-2.5 px-3">Estado</th>
                      <th className="py-2.5 px-3 text-right">Monto (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="text-xs hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-mono text-slate-500 font-semibold">{tx.id}</td>
                        <td className="py-2 px-3 text-slate-500">{new Date(tx.timestamp).toLocaleString()}</td>
                        <td className="py-2 px-3 text-slate-800 font-medium">{tx.description}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase ${
                            tx.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-right font-bold font-mono ${
                          tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund'
                            ? 'text-emerald-600'
                            : 'text-slate-800'
                        }`}>
                          {tx.type === 'recharge' || tx.type === 'transfer_received' || tx.type === 'refund' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
