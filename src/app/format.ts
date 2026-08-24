const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatPrice = (value: number) => currency.format(value);
