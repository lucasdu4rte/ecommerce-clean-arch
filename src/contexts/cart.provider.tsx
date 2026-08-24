"use client";

import { AddProductInCartUseCase } from "@/@core/application/cart/add-product-in-cart.use-case";
import { ClearCartUseCase } from "@/@core/application/cart/clear-cart.use-case";
import { GetCartUseCase } from "@/@core/application/cart/get-cart.use-case";
import { RemoveProductFromCartUseCase } from "@/@core/application/cart/remove-product-from-cart.use-case";
import { CheckoutUseCase } from "@/@core/application/order/checkout.use-case";
import { Cart } from "@/@core/domain/entities/cart";
import { Order } from "@/@core/domain/entities/order";
import { Product } from "@/@core/domain/entities/product";
import { Registry, container } from "@/@core/infra/container-registry";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextValue = {
  cart: Cart;
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  clear: () => void;
  checkout: (creditCardNumber: string) => Promise<Order>;
};

const CartContext = createContext<CartContextValue | null>(null);

const getCartUseCase = container.get<GetCartUseCase>(Registry.GetCartUseCase);
const addProductUseCase = container.get<AddProductInCartUseCase>(Registry.AddProductInCartUseCase);
const removeProductUseCase = container.get<RemoveProductFromCartUseCase>(
  Registry.RemoveProductFromCartUseCase
);
const clearCartUseCase = container.get<ClearCartUseCase>(Registry.ClearCartUseCase);
const checkoutUseCase = container.get<CheckoutUseCase>(Registry.CheckoutUseCase);

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState(new Cart({ products: [] }));

  useEffect(() => {
    setCart(getCartUseCase.execute());
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      addProduct: (product: Product) => setCart(addProductUseCase.execute(product)),
      removeProduct: (productId: number) => setCart(removeProductUseCase.execute(productId)),
      clear: () => setCart(clearCartUseCase.execute()),
      checkout: async (creditCardNumber: string) => {
        const order = await checkoutUseCase.execute({ credit_card_number: creditCardNumber });
        setCart(getCartUseCase.execute());
        return order;
      },
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
};
