import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    slug: 'pro-x',
    name: 'Premium Pro X',
    tagline: 'The Ultimate Performance Machine',
    description:
      'The Premium Pro X represents the pinnacle of our engineering expertise. Every component has been meticulously designed to deliver uncompromising performance while maintaining whisper-quiet operation. Whether you are a creative professional or a demanding power user, the Pro X adapts to your workflow with effortless precision.',
    price: '$2,499',
    features: [
      'Advanced thermal management with liquid cooling',
      'Ultra-responsive controls with haptic feedback',
      'AI-powered adaptive performance optimization',
      'Seamless ecosystem integration',
      'Industry-leading 5-year warranty',
    ],
    specs: [
      { label: 'Dimensions', value: '12.5" × 8.5" × 4.2"' },
      { label: 'Weight', value: '6.8 lbs' },
      { label: 'Power', value: '850W (peak)' },
      { label: 'Connectivity', value: 'USB-C, Thunderbolt 4, Wi-Fi 6E' },
      { label: 'Cooling', value: 'Dual-phase liquid cooling' },
    ],
    images: {},
    category: 'flagship',
    isNew: true,
  },
  {
    id: '2',
    slug: 'studio',
    name: 'Premium Studio',
    tagline: 'Creativity Unleashed',
    description:
      'The Premium Studio is designed for creators who demand excellence. With its stunning 6K display, color-accurate calibration, and intuitive creative tools, it transforms your workspace into a professional studio. The perfect companion for photographers, videographers, and digital artists.',
    price: '$1,899',
    features: [
      '6K Retina display with P3 wide color',
      'Factory-calibrated for color accuracy',
      'Pressure-sensitive touch interface',
      'Integrated SD card reader and ports',
      '3-year AppleCare+ included',
    ],
    specs: [
      { label: 'Display', value: '27" 6K Retina' },
      { label: 'Resolution', value: '6016 × 3384' },
      { label: 'Color Accuracy', value: 'Delta E < 1' },
      { label: 'Refresh Rate', value: '120Hz ProMotion' },
      { label: 'Brightness', value: '1600 nits peak HDR' },
    ],
    images: {},
    category: 'premium',
    isNew: true,
  },
  {
    id: '3',
    slug: 'essential',
    name: 'Premium Essential',
    tagline: 'Excellence Made Accessible',
    description:
      'The Premium Essential brings our signature quality to a more accessible price point. Dont let the name fool you—this is still a Premium product through and through. Every detail has been carefully considered to deliver an exceptional experience that exceeds its class.',
    price: '$999',
    features: [
      'Premium aluminum unibody design',
      'All-day battery life',
      'Brilliant Retina display',
      'Fast charging support',
      '2-year standard warranty',
    ],
    specs: [
      { label: 'Dimensions', value: '11.5" × 7.8" × 0.6"' },
      { label: 'Weight', value: '2.8 lbs' },
      { label: 'Battery', value: 'Up to 18 hours' },
      { label: 'Display', value: '13.6" Retina' },
      { label: 'Storage', value: '256GB - 2TB SSD' },
    ],
    images: {},
    category: 'essential',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(
  category: Product['category']
): Product[] {
  return products.filter((product) => product.category === category);
}
