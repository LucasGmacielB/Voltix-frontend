'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IoCartOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-green-500/50 hover:shadow-[0_0_25px_rgba(34,197,94,0.12)]">
      <div>
        <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-lg">
          <div className="relative w-full h-44 bg-zinc-950 border border-zinc-800 rounded-lg mb-4 flex items-center justify-center text-zinc-500 text-sm overflow-hidden transition-all duration-500 group-hover:scale-[1.02]">
            {product.imgUrl ? (
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg transition-all duration-500 group-hover:opacity-90"
              />
            ) : (
              <span className="group-hover:text-zinc-400 transition-colors">Sem Imagem Cadastrada</span>
            )}
          </div>
        </Link>
        
        <Link href={`/products/${product.id}`} className="hover:underline block">
          <h2 className="text-lg font-semibold text-zinc-200 mb-2 transition-colors group-hover:text-white line-clamp-1">
            {product.name}
          </h2>
        </Link>
        <p className="text-zinc-400 text-xs line-clamp-2 mb-4 h-8">{product.description}</p>
      </div>

      <div className="mt-auto">
        <p className="text-2xl font-extrabold text-green-400 mb-4">
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        
        <div className="flex gap-2">
          <Link 
            href={`/products/${product.id}`}
            className="flex-1 text-center rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 text-xs font-semibold text-zinc-300 transition-all duration-200 hover:bg-zinc-800 hover:text-white"
          >
            Detalhes
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={added}
            className={`flex-[2] flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-white transition-all duration-300 ${
              added 
                ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                : 'bg-green-600 hover:bg-green-500 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <IoCheckmarkCircleOutline className="text-base animate-bounce" />
                Adicionado!
              </>
            ) : (
              <>
                <IoCartOutline className="text-base" />
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
