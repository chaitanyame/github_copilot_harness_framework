export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  features: string[];
  specs: ProductSpec[];
  images: {
    hero?: string;
    thumbnail?: string;
    gallery?: string[];
  };
  category: 'flagship' | 'premium' | 'essential';
  isNew?: boolean;
}
