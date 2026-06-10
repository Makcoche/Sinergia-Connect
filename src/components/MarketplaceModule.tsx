import React, { useState } from 'react';
import { Product, Wallet } from '../types';
import { Search, ShoppingBag, ShoppingCart, Trash2, CheckCircle, Tag, WalletCards, Sparkles } from 'lucide-react';

interface MarketplaceModuleProps {
  products: Product[];
  wallet: Wallet;
  onPurchase: (totalAmount: number, description: string, orderedItems: { productId: string; qty: number }[]) => boolean | string;
  onProductStockChange: (productId: string, newStock: number) => void;
  triggerNotification: (title: string, desc: string, type: 'wallet' | 'logistics' | 'booking' | 'chat') => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function MarketplaceModule({ products, wallet, onPurchase, onProductStockChange, triggerNotification }: MarketplaceModuleProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // 0% to 100%
  const [couponMessage, setCouponMessage] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState('');

  const categories = ['all', 'Electrónica', 'Audio', 'Hogar', 'Accesorios'];

  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert('¡Vaya! Este producto no tiene existencias disponibles actualmente.');
      return;
    }
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + 1;
      if (newQty > product.stock) {
        alert(`Lo sentimos, el comercio solo cuenta con ${product.stock} unidades en almacén.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity = newQty;
      setCart(updatedCart);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateCartQty = (productId: string, qty: number) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return;
    if (qty > p.stock) {
      alert(`Lo sentimos, solo hay ${p.stock} unidades en existencia.`);
      return;
    }
    if (qty <= 0) {
      setCart(cart.filter(item => item.product.id !== productId));
      return;
    }
    setCart(cart.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SINERGIA10') {
      setAppliedDiscount(10);
      setCouponMessage('¡Cupón SINERGIA10 aprobado! 10% de descuento aplicado.');
    } else if (couponCode.toUpperCase() === 'SINERGIAFREE') {
      setAppliedDiscount(20);
      setCouponMessage('¡Cupón Premium aprobado! 20% de descuento aplicado.');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Cupón inválido. Intenta con SINERGIA10.');
    }
  };

  const handleCheckout = (paymentMethod: 'wallet' | 'card') => {
    if (cart.length === 0) return;
    
    // Calculate total price
    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const discountAmount = subtotal * (appliedDiscount / 100);
    const finalTotal = subtotal - discountAmount;

    if (paymentMethod === 'wallet' && finalTotal > wallet.balanceCopUSD) {
      alert('⚠️ Saldo insuficiente en tu Billetera Sinergia. Por favor recarga fondos antes de operar.');
      return;
    }

    // Build orderedItems object
    const itemsDescription = cart.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
    const orderedItems = cart.map(item => ({ productId: item.product.id, qty: item.quantity }));

    let res: boolean | string = true;
    if (paymentMethod === 'wallet') {
      res = onPurchase(finalTotal, `Pago Marketplace Sinergia: ${itemsDescription}`, orderedItems);
    } else {
      // Direct Card Pay
      // Update each product's stock inside the parent state
      orderedItems.forEach(ord => {
        const prod = products.find(p => p.id === ord.productId);
        if (prod) {
          onProductStockChange(prod.id, prod.stock - ord.qty);
        }
      });
    }

    if (typeof res === 'string') {
      alert(`Error en el checkout: ${res}`);
    } else {
      setPurchaseSuccess(true);
      setPurchaseMsg(`¡Pago Exitoso! Tu orden con ID sng-mkt-${Math.floor(Math.random() * 9000 + 1000)} ha sido creada y enviada a los comercios afiliados.`);
      
      // Emit notifications
      cart.forEach(item => {
        triggerNotification(
          'Orden despachada',
          `El comercio ${item.product.companyName} ha comenzado la preparación y empaque de su pedido (${item.quantity}x ${item.product.name}).`,
          'booking'
        );
        // also update parent stock if paid via wallet
        if (paymentMethod === 'wallet') {
          onProductStockChange(item.product.id, item.product.stock - item.quantity);
        }
      });

      // Clear cart
      setCart([]);
      setAppliedDiscount(0);
      setCouponCode('');
      setCouponMessage('');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const finalTotal = subtotal - discountAmount;
  const sngTotal = finalTotal * 3.5;

  return (
    <div id="marketplace-module" className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="p-2 bg-pink-100 text-pink-700 rounded-lg">🛒</span>
            Mercado & Comercio Colaborativo
          </h2>
          <p className="text-sm text-slate-500">Un ecosistema multiempresa que unifica despachos y garantiza precios justos</p>
        </div>

        {/* Search bar and Cart quick trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-64"
            />
          </div>

          <button
            id="cart-toggle-btn"
            onClick={() => { setShowCart(!showCart); setPurchaseSuccess(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all relative flex items-center gap-2 ${
              cart.length > 0
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 animate-pulse'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Ver Carrito
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {cart.reduce((s, c) => s + c.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 tracking-wide uppercase mb-3">Categorías</h4>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  id={`mkt-cat-${cat}`}
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex justify-between items-center ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <span className="capitalize">{cat === 'all' ? 'Ver Todos' : cat}</span>
                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">
                    {cat === 'all' ? products.length : products.filter(p => p.category === cat).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              ¡Códigos Descuento Cupón!
            </h4>
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              Utiliza el código <span className="font-mono bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-bold">SINERGIA10</span> para obtener un 10% dto en tu compra inicial.
            </p>
          </div>
        </div>

        {/* Product listing container */}
        <div className="lg:col-span-3">
          {purchaseSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">¡Compra realizada con éxito!</p>
                <p className="text-xs text-emerald-700 leading-relaxed mt-0.5">{purchaseMsg}</p>
                <p className="text-xs text-slate-500 mt-2 font-mono">Saldo actual wallet: ${wallet.balanceCopUSD.toFixed(2)} USD</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map(prod => (
              <div key={prod.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-40 bg-slate-100">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {prod.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 block">{prod.companyName}</span>
                    <h5 className="font-bold text-slate-800 text-xs line-clamp-1">{prod.name}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                    
                    <div className="flex justify-between items-center pt-2">
                      <div className="font-mono font-black text-rose-600 text-sm">
                        ${prod.price.toFixed(2)} <span className="text-[9px] text-slate-400 font-bold">USD</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium font-mono text-right">
                        Stock: <span className={prod.stock > 0 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold'}>
                          {prod.stock > 0 ? `${prod.stock} u` : 'Agotado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-slate-50 bg-slate-50/50">
                  <button
                    id={`add-to-cart-${prod.id}`}
                    onClick={() => addToCart(prod)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-black tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    disabled={prod.stock <= 0}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 font-medium">
                No encontramos productos que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Cart Slider Overlay Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-800 text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded"
            >
              ← Seguir comprando
            </button>

            <div className="pt-8 overflow-y-auto flex-grow space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                Mi Carrito de Compras ({cart.length})
              </h3>

              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-150">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 block truncate w-36">{item.product.name}</p>
                      <p className="text-[10px] font-mono font-black text-rose-600">${item.product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded overflow-hidden bg-white">
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                        className="px-1.5 py-0.5 hover:bg-slate-100 text-xs font-semibold"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                        className="px-1.5 py-0.5 hover:bg-slate-100 text-xs font-semibold"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-rose-500 hover:bg-rose-50 p-1.5 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-sm">
                  El carrito está vacío temporalmente. ¡Explora el catálogo!
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                {/* Coupon component */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cupón (ej. SINERGIA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    className="bg-slate-800 text-white hover:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Aplicar
                  </button>
                </form>

                {couponMessage && (
                  <p className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 p-1 rounded">
                    {couponMessage}
                  </p>
                )}

                {/* Subtotals and Totals */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Descuento Directo ({appliedDiscount}%)</span>
                      <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-800 font-black text-sm pt-1.5 border-t border-slate-200">
                    <span>Total Final (USD)</span>
                    <span className="font-mono text-rose-600">${finalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold text-[10px] bg-amber-50 p-1.5 rounded">
                    <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Equiv. Tokens</span>
                    <span className="font-mono">{sngTotal.toFixed(2)} SNG</span>
                  </div>
                </div>

                {/* Unified Checkout Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="checkout-wallet-btn"
                    onClick={() => handleCheckout('wallet')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <WalletCards className="w-4 h-4" />
                    Pago Wallet
                  </button>
                  <button
                    id="checkout-card-btn"
                    onClick={() => handleCheckout('card')}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black tracking-wide uppercase flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    Tarjeta Directa
                  </button>
                </div>
                <p className="text-[9px] text-slate-400 text-center leading-relaxed">
                  Sandbox de pruebas integrado. El pago de fondos se restará directamente del saldo interno al procesarse el check.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
