"use client";
import { AddProductInCartUseCase } from "@/@core/application/cart/add-product-in-cart.use-case";
import { ClearCartUseCase } from "@/@core/application/cart/clear-cart.use-case";
import { GetCartUseCase } from "@/@core/application/cart/get-cart.use-case";
import { RemoveProductFromCartUseCase } from "@/@core/application/cart/remove-product-from-cart.use-case";
import { Cart } from "@/@core/domain/entities/cart";
import { Product } from "@/@core/domain/entities/product";
import { Registry, container } from "@/@core/infra/container-registry";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  clear: () => void;
}

const defaultValue: CartContextValue = {
  cart: new Cart({
    products: [],
  }),
  addProduct: (_product: Product) => { },
  removeProduct: (_productId: number) => { },
  clear: () => { },
}

export const CartContext = createContext<CartContextValue>(defaultValue);

const getCartUseCase = container.get<GetCartUseCase>(
  Registry.GetCartUseCase
)
const addProductUseCase = container.get<AddProductInCartUseCase>(
  Registry.AddProductInCartUseCase
)
const removeProductUseCase = container.get<RemoveProductFromCartUseCase>(
  Registry.RemoveProductFromCartUseCase
)
const clearCartUseCase = container.get<ClearCartUseCase>(
  Registry.ClearCartUseCase
)

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState(defaultValue.cart);

  useEffect(() => {
    const firstLoad = async () => {
      const cart = getCartUseCase.execute()
      setCart(cart)
    }
    firstLoad()
  }, []);

  const value  = useMemo(() => {
    const addProduct = (product: Product) => {
      const cart = addProductUseCase.execute(product)
      setCart(cart);
    }

    const removeProduct = (productId: number) => {
      const cart = removeProductUseCase.execute(productId)
      setCart(cart);
    }

    const clear = () => {
      const cart = clearCartUseCase.execute()
      setCart(cart);
    }

    return {
      cart,
      addProduct,
      removeProduct,
      clear,
    }
  }, [cart]);
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext);
  return context
}
