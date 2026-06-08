'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  IoCartOutline, 
  IoChevronBackOutline, 
  IoLocationSharp, 
  IoCardOutline, 
  IoBarcodeOutline, 
  IoQrCodeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleSharp
} from 'react-icons/io5';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CartItem } from '@/components/CartItem/CartItem';
import { buscarEnderecos } from '@/services/address';
import { createOrder } from '@/services/orderService';
import { Logo } from '@/components/logo/Logo';
import { getErrorMessage } from '@/utils/getErrorMessage';

type PaymentMethod = 'CREDIT_CARD' | 'PIX' | 'BOLETO';

export default function CartPage() {
  const router = useRouter();
  
  // Zustand Store values
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  
  // Auth values
  const user = useAuthStore((state) => state.user);
  const basicAuth = useAuthStore((state) => state.basicAuth);

  // Component states
  const [mounted, setMounted] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch addresses if user is logged in
  const { data: addresses, isLoading: loadingAddresses } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => buscarEnderecos(basicAuth!),
    enabled: !!basicAuth && mounted,
  });

  // Pre-select first address if available
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id ?? null);
    }
  }, [addresses, selectedAddressId]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-green-500 font-medium animate-pulse">Carregando carrinho...</p>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  // Free shipping over R$ 200, otherwise R$ 15
  const shippingCost = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!user || !basicAuth) {
      router.push('/login');
      return;
    }

    if (!selectedAddressId) {
      setCheckoutError('Por favor, cadastre e selecione um endereço de entrega.');
      return;
    }

    if (items.length === 0) {
      setCheckoutError('Seu carrinho está vazio.');
      return;
    }

    try {
      setCheckoutLoading(true);
      setCheckoutError(null);

      const checkoutItems = items.map((item) => ({
        productId: Number(item.product.id),
        quantity: item.quantity,
      }));

      await createOrder(
        user.id,
        {
          addressId: selectedAddressId,
          items: checkoutItems,
        },
        basicAuth
      );

      setCheckoutSuccess(true);
      clearCart();
      
      // Redirect to orders page after showing success animation
      setTimeout(() => {
        router.push('/orders');
      }, 2000);

    } catch (err) {
      console.error(err);
      setCheckoutError(getErrorMessage(err) || 'Erro ao finalizar o pedido. Verifique o estoque dos produtos.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-16">
      {/* Header */}
      <header className="border-b border-zinc-900 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo />
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-green-400 transition"
          >
            <IoChevronBackOutline className="text-base" />
            Voltar ao Catálogo
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <section className="mx-auto max-w-6xl px-6 mt-8">
        <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-3">
          <IoCartOutline className="text-green-500" />
          Meu Carrinho
        </h1>

        {checkoutSuccess ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-950/20 p-8 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-2xl">
            <IoCheckmarkCircleSharp className="text-green-400 text-6xl mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-white mb-2">Pedido Recebido!</h2>
            <p className="text-zinc-400 text-sm max-w-md">
              Seu pedido foi registrado com sucesso. Você está sendo redirecionado para a página "Meus Pedidos" para acompanhar o status.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center max-w-2xl mx-auto shadow-xl">
            <IoCartOutline className="text-zinc-600 text-6xl mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Seu carrinho está vazio</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Navegue pelo nosso catálogo e encontre os melhores equipamentos elétricos.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 active:scale-95 shadow-lg shadow-green-900/20"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 shadow-xl">
                <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">
                  Itens Selecionados ({items.length})
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItem key={item.product.id} item={item} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Summary & Settings */}
            <div className="space-y-6">
              {/* Checkout Summary Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6 shadow-xl">
                <h2 className="text-lg font-bold text-white border-b border-zinc-800 pb-3">
                  Resumo da Compra
                </h2>

                {/* Subtotals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-200">
                      {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Frete</span>
                    <span className="font-semibold text-zinc-200">
                      {shippingCost === 0 ? (
                        <span className="text-green-400 font-bold">Grátis</span>
                      ) : (
                        shippingCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      )}
                    </span>
                  </div>
                  
                  {subtotal <= 200 && (
                    <p className="text-[11px] text-zinc-500 text-right italic">
                      Adicione mais R$ {(200.01 - subtotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} para obter Frete Grátis!
                    </p>
                  )}

                  <div className="border-t border-zinc-850 pt-3 flex justify-between text-base font-extrabold text-white">
                    <span>Total</span>
                    <span className="text-green-400 text-lg">
                      {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                {/* Authentication Check & Address / Payment Settings */}
                {!user ? (
                  <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 space-y-3">
                    <div className="flex gap-2.5">
                      <IoAlertCircleOutline className="text-yellow-500 text-lg flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-yellow-400">Identificação Necessária</p>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Você precisa estar autenticado para selecionar o endereço de entrega e finalizar a compra.
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/login"
                      className="block text-center w-full rounded-lg bg-yellow-600 hover:bg-yellow-500 text-xs font-bold text-black py-2.5 transition active:scale-95"
                    >
                      Entrar na Minha Conta
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Delivery Address Selector */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <IoLocationSharp className="text-green-500" />
                        Endereço de Entrega
                      </label>
                      {loadingAddresses ? (
                        <p className="text-xs text-zinc-500 animate-pulse">Carregando seus endereços...</p>
                      ) : addresses && addresses.length > 0 ? (
                        <div className="relative">
                          <select
                            value={selectedAddressId || ''}
                            onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                            className="w-full text-xs rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200 outline-none transition focus:border-green-500 cursor-pointer appearance-none"
                          >
                            {addresses.map((addr) => (
                              <option key={addr.id} value={addr.id}>
                                {addr.street}, {addr.number} - {addr.city}/{addr.state}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-500 text-xs">
                            ▼
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-zinc-500 leading-relaxed">Nenhum endereço cadastrado no seu perfil.</p>
                          <Link
                            href="/addresses/new"
                            className="block text-center w-full rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold py-2.5 text-zinc-300 transition"
                          >
                            Cadastrar Endereço
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Simulated Payment Methods */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <IoCardOutline className="text-green-500" />
                        Forma de Pagamento
                      </label>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {/* PIX */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('PIX')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            paymentMethod === 'PIX'
                              ? 'border-green-500 bg-green-500/10 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <IoQrCodeOutline className="text-lg mb-1" />
                          <span className="text-[10px]">PIX</span>
                        </button>

                        {/* Credit Card */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('CREDIT_CARD')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            paymentMethod === 'CREDIT_CARD'
                              ? 'border-green-500 bg-green-500/10 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <IoCardOutline className="text-lg mb-1" />
                          <span className="text-[10px] whitespace-nowrap">Cartão</span>
                        </button>

                        {/* Boleto */}
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('BOLETO')}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            paymentMethod === 'BOLETO'
                              ? 'border-green-500 bg-green-500/10 text-white font-bold'
                              : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <IoBarcodeOutline className="text-lg mb-1" />
                          <span className="text-[10px]">Boleto</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Error Banner */}
                {checkoutError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex gap-2 text-xs text-red-400 leading-relaxed">
                    <IoAlertCircleOutline className="text-lg flex-shrink-0 mt-0.5" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                {/* Submit Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || items.length === 0 || !user || !selectedAddressId}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
                    checkoutLoading || items.length === 0 || !user || !selectedAddressId
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                      : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/10 hover:shadow-green-500/20'
                  }`}
                >
                  {checkoutLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar Compra'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
