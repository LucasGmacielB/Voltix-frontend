'use client';

import { IoTrashOutline, IoAddOutline, IoRemoveOutline } from 'react-icons/io5';
import { CartItem as CartItemType } from '@/types/cart';
import { useCartStore } from '@/store/useCartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { product, quantity } = item;
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all duration-200 hover:border-zinc-700">
      {/* Imagem e Detalhes do Produto */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="h-16 w-16 flex-shrink-0 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 text-xs overflow-hidden">
          {product.imgUrl ? (
            <img src={product.imgUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px]">Sem Imagem</span>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-zinc-200 truncate">{product.name}</h3>
          <p className="text-zinc-500 text-[11px] mt-0.5 line-clamp-1">{product.description}</p>
          <span className="text-xs text-green-400 font-medium block mt-1">
            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>

      {/* Controles de Quantidade e Ações */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
        {/* Seletor de Quantidade */}
        <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Diminuir quantidade"
          >
            <IoRemoveOutline className="text-xs" />
          </button>
          
          <span className="px-3 text-xs font-semibold text-zinc-200 select-none w-8 text-center">
            {quantity}
          </span>
          
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            title="Aumentar quantidade"
          >
            <IoAddOutline className="text-xs" />
          </button>
        </div>

        {/* Subtotal e Remover */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-zinc-100 min-w-[80px] text-right">
            {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          
          <button
            onClick={() => removeItem(product.id)}
            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            title="Remover do carrinho"
          >
            <IoTrashOutline className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
