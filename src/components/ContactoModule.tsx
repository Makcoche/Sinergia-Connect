import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Info, HelpCircle } from 'lucide-react';

interface ContactoProps {
  onAddAuditLog?: (action: string, details: string) => void;
}

export default function ContactoModule({ onAddAuditLog }: ContactoProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'support',
    message: ''
  });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Favor digite todos los datos obligatorios.');
      return;
    }

    if (onAddAuditLog) {
      onAddAuditLog('Contacto Enviado', `Mensaje de soporte de ${formData.name} (${formData.email}) - Asunto: ${formData.subject}`);
    }

    setSentSuccess(true);
    setFormData({ name: '', email: '', subject: 'support', message: '' });
    setTimeout(() => setSentSuccess(false), 4500);
  };

  return (
    <div id="contacto-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 lg:p-8 space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">✉️</span>
          Soporte Técnico y Alianza de Marca Blanca
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          ¿Tienes consultas de integración tecnológica? Escríbenos directamente o contacta a nuestro equipo de ingenieros de soporte de Sinergia Agencia Creativa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Contact Information Columns */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-extrabold text-slate-800 text-xs tracking-wide uppercase">Canales de Enlace</h3>
            
            <div className="space-y-4 text-xs font-sans text-slate-600">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-750">Sede Administrativa</p>
                  <p className="text-slate-500 mt-0.5">Carepa, Urabá Antioqueño • Colombia</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-750">Central Telefónica</p>
                  <p className="text-slate-505 mt-0.5 font-mono">+57 321 000 0000</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail className="w-5 h-5 text-pink-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-750">Correo Directo</p>
                  <p className="text-indigo-650 font-bold mt-0.5">soporte@sinergiahub.co</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
            <h4 className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">Ejecución SaaS</h4>
            <p className="text-[11px] text-slate-350 leading-relaxed font-sans font-medium">
              Sinergia Connect opera bajo un modelo de licenciamiento para consorcios comerciales. Todas las solicitudes técnicas se resuelven en un plazo máximo de 24 horas hábiles.
            </p>
          </div>
        </div>

        {/* Right Side: Form Submission container */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200">
          
          {sentSuccess ? (
            <div className="p-8 text-center space-y-4 animate-fade-in">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">✔️ ¡Mensaje Recibido de Forma Segura!</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Tu solicitud comercial ha sido registrada en el libro de auditoría de Sinergia Connect. Un asesor se comunicará contigo de inmediato.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs select-none">
              <h3 className="font-semibold text-slate-805 text-xs uppercase tracking-wide mb-3">Formulario Directo de Consultas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Tu Nombre Comercial o Personal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Valeria Restrepo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Correo Electrónico de Enlace *</label>
                  <input
                    type="email"
                    required
                    placeholder="valeria@correo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Asunto de la Consulta</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-white focus:outline-none"
                >
                  <option value="support">Soporte Técnico y Token Wallet</option>
                  <option value="incorporation">Incorporación de Empresa (SaaS Inquilinos)</option>
                  <option value="fletes">Logística Carga y Rutas de Transporte</option>
                  <option value="branding">Personalizar Marca Blanca Regional</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Descripción Detallada o Reclamo *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Por favor describe claramente tu requerimiento para enrutar el ticket..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white h-24 focus:outline-none text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-black uppercase tracking-wider text-[10px] text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Enviar Mensaje Seguro
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
