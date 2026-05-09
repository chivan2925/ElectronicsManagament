import { products } from "./products";

export const mockCartConfigs = [
  {
    quantity: 1,
    slug: "asus-rog-zephyrus-g14-2024",
    variant: "Đen Eclipse / Ryzen 9 / 12 tháng",
  },
  {
    quantity: 2,
    slug: "logitech-g-pro-x-wireless",
    variant: "Đen Eclipse / Wireless Bundle",
  },
  {
    quantity: 1,
    slug: "hyperx-cloud-iii-wireless",
    variant: "Trắng Moon / Pro Kit",
  },
];

export function createMockCartItems() {
  return mockCartConfigs
    .map((config) => {
      const product = products.find((item) => item.slug === config.slug);

      if (!product) {
        return null;
      }

      const maxQuantity = Math.min(Math.max(product.stock, 1), 9);

      return {
        id: `${product.id}-${config.variant}`,
        maxQuantity,
        product,
        quantity: Math.min(config.quantity, maxQuantity),
        variant: config.variant,
      };
    })
    .filter(Boolean);
}
