export type ShopImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopProductBasic = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopImage | null;
  priceRange: {
    minVariantPrice: ShopPrice;
    maxVariantPrice: ShopPrice;
  };
};

export type ShopProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopPrice;
};

export type ShopProduct = ShopProductBasic & {
  descriptionHtml: string;
  images: ShopImage[];
  variants: ShopProductVariant[];
  availableForSale: boolean;
};

export type ShopSearchSuggestion = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ShopImage | null;
  price: ShopPrice;
};

export type CartItem = {
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  price: ShopPrice;
  quantity: number;
  image: ShopImage | null;
};
