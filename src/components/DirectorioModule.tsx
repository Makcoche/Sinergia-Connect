import React, { useState } from 'react';
import { Company } from '../types';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CheckCircle, 
  Search, 
  Filter, 
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';

interface DirectorioProps {
  companies: Company[];
  onSwitchSession?: (userId: string) => void;
}

interface Review {
  companyId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  { companyId: 'comp-1', author: 'Valeria Restrepo', rating: 5, comment: 'Excelente flete refrigerado, la temperatura de las frutas se mantuvo intacta de Rionegro a Turbo.', date: '2026-06-08' },
  { companyId: 'comp-2', author: 'Manuel Beltrán', rating: 4, comment: 'Compro mucho repuestos mecánicos acá para la tractomula, buena disponibilidad.', date: '2026-06-05' },
  { companyId: 'comp-3', author: 'Lina Marcela', rating: 5, comment: 'La suite presidencial con vista al mar de Bocagrande es de otro mundo. Súper limpio.', date: '2026-06-09' },
  { companyId: 'comp-4', author: 'Carlos Mendoza', rating: 5, comment: 'Hicimos el recorrido al Valle del Cocora en Quindío y las guías fueron muy profesionales con buen dominio de inglés.', date: '2026-06-07' }
];

export default function DirectorioModule({ companies }: DirectorioProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  
  // Custom feedback inputs
  const [targetCompanyId, setTargetCompanyId] = useState<string | null>(null);
  const [feedbackAuthor, setFeedbackAuthor] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const filteredCompanies = companies.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.type.toLowerCase().includes(term);

    if (selectedType === 'todos') return matchesSearch;
    return matchesSearch && c.type === selectedType;
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCompanyId || !feedbackAuthor || !feedbackComment) {
      alert('Por favor complete los campos obligatorios del opinión.');
      return;
    }

    const newRev: Review = {
      companyId: targetCompanyId,
      author: feedbackAuthor,
      rating: feedbackRating,
      comment: feedbackComment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => [newRev, ...prev]);
    setFeedbackSuccess(true);
    setFeedbackAuthor('');
    setFeedbackComment('');
    setTimeout(() => {
      setFeedbackSuccess(false);
      setTargetCompanyId(null);
    }, 2500);
  };

  const getCompanyTypeLabel = (type: Company['type']) => {
    switch (type) {
      case 'logistics': return 'Transporte & Carga';
      case 'retail': return 'Comercio / Super Tienda';
      case 'hospitality': return 'Hotelería & Resorts';
      case 'tourism': return 'Operador Eco-Turístico';
      case 'professional': return 'Servicios Profesionales';
      default: return type;
    }
  };

  const getCompanyTypeBadge = (type: Company['type']) => {
    switch (type) {
      case 'logistics': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'retail': return 'bg-pink-50 text-pink-800 border-pink-100';
      case 'hospitality': return 'bg-sky-50 text-sky-800 border-sky-100';
      case 'tourism': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'professional': return 'bg-purple-50 text-purple-800 border-purple-100';
      default: return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  return (
    <div id="directorio-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
      
      {/* Visual Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <span className="p-2 bg-teal-100 text-teal-700 rounded-lg">🏢</span>
          Directorio Empresarial y Calificaciones SaaS
        </h2>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Consulta las firmas de marca blanca asociadas al ecosistema Sinergia Connect. Revisa sus calificaciones de satisfacción o ingresa un nuevo testimonio.
        </p>
      </div>

      {/* Control Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-250 flex flex-col md:flex-row gap-4 justify-between items-center select-none">
        
        {/* Search input bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Buscar empresa por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-lg text-xs focus:outline-none w-full font-semibold text-slate-700"
          />
        </div>

        {/* Type select */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase self-center mr-1">Filtrar:</span>
          {([
            { val: 'todos', label: 'Ver Todo' },
            { val: 'logistics', label: '🚚 Logística' },
            { val: 'retail', label: '🛍️ Retail' },
            { val: 'hospitality', label: '🏨 Hoteles' },
            { val: 'tourism', label: '🏔️ Turismo' },
            { val: 'professional', label: '💼 Expertos' }
          ] as const).map(bt => (
            <button
              key={bt.val}
              onClick={() => setSelectedType(bt.val)}
              className={`px-3 py-1 border rounded-lg text-[10.5px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedType === bt.val
                  ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Company listing cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {filteredCompanies.map(c => {
              const compReviews = reviews.filter(r => r.companyId === c.id);
              const compositeRating = compReviews.length > 0 
                ? (compReviews.reduce((sum, current) => sum + current.rating, 0) / compReviews.length).toFixed(1) 
                : c.rating.toFixed(1);

              return (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between">
                  
                  <div className="space-y-3.5">
                    
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <span className="text-2xl p-2 bg-slate-50 border border-slate-100 rounded-xl">{c.logo}</span>
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-1">
                            {c.name}
                            <Award className="w-3.5 h-3.5 text-teal-600" />
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 font-bold">{c.id.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1.5 text-xs font-sans text-slate-550 border-t border-slate-100/70">
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{c.email}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-indigo-650 font-medium">Urabá Antioqueño Sede Principal</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${getCompanyTypeBadge(c.type)}`}>
                        {getCompanyTypeLabel(c.type)}
                      </span>
                      <span className="flex items-center gap-0.5 font-mono text-[10px] font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{compositeRating} ({compReviews.length} opiniones)</span>
                      </span>
                    </div>

                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => { setTargetCompanyId(c.id); setFeedbackSuccess(false); }}
                      className="flex-1 py-1.5 text-center border border-slate-200 hover:border-slate-300 rounded-lg text-[10px] text-slate-600 font-extrabold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-slate-400" /> Opinar
                    </button>
                    <a
                      href={`https://wa.me/${c.phone.replace(/[\s+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg text-xs"
                      title="Enlace WhatsApp Directo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* Reviews and Feedback Side Form */}
        <div className="lg:col-span-4 space-y-4">
          
          {targetCompanyId ? (
            <div className="bg-white p-5 rounded-2xl border border-teal-200 space-y-4 animate-fade-in relative">
              <div className="pb-2 border-b border-slate-100">
                <span className="text-[9px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-black uppercase">Ficha Testimonio</span>
                <h4 className="font-extrabold text-slate-800 text-xs mt-2">Agregar Calificación</h4>
              </div>

              {feedbackSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-150 text-[11px] font-sans font-medium text-center">
                   ✔️ ¡Testimonio acreditado en sandbox exitosamente!
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs text-slate-600">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tu Nombre o Alias</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Valeria R."
                      value={feedbackAuthor}
                      onChange={(e) => setFeedbackAuthor(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 focus:bg-white text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Calificación de Servicio</label>
                    <select
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(parseInt(e.target.value))}
                      className="w-full border border-slate-200 rounded-md p-2 bg-white text-xs focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Excelente)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Bueno)</option>
                      <option value="3">⭐⭐⭐ (3 Aceptable)</option>
                      <option value="2">⭐⭐ (2 Regular)</option>
                      <option value="1">⭐ (1 Deficiente)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Comentario o Reseña</label>
                    <textarea
                      required
                      placeholder="Escribe tu testimonio detallado..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full border border-slate-200 rounded-md p-2 bg-slate-50 focus:bg-white h-20 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTargetCompanyId(null)}
                      className="w-1/3 py-1.5 bg-slate-100 rounded-md hover:bg-slate-200 text-slate-605 font-bold uppercase text-[10px]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-1.5 bg-teal-605 hover:bg-teal-700 text-white rounded-md font-bold uppercase tracking-wider text-[10px]"
                    >
                      Acreditar Opinión
                    </button>
                  </div>

                </form>
              )}
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ThumbsUp className="w-4.5 h-4.5 text-teal-600" />
                Garantía Sinergia Connect
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Todas las firmas de este directorio aprueban un severo proceso de auditoría y cumplimiento regulatorio regional sobre sus finanzas y balances fiscales antes de ingresar al pool corporativo.
              </p>
            </div>
          )}

          {/* Feed of raw public critiques */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Opiniones Recientes del Ecosistema</h4>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 text-xs">
              {reviews.map((rev, idx) => {
                const targetComp = companies.find(c => c.id === rev.companyId);
                return (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-slate-850 block">{rev.author}</span>
                        {targetComp && (
                          <span className="text-[10px] text-indigo-650 font-bold bg-indigo-50/50 px-1.5 py-0.5 rounded">
                            {targetComp.logo} {targetComp.name}
                          </span>
                        )}
                      </div>
                      <span className="p-0.5 bg-white border border-slate-200 rounded text-amber-500 font-bold font-mono text-[9px] flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" /> {rev.rating}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-normal leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[9.5px] text-slate-400 block font-mono text-right">{new Date(rev.date).toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
