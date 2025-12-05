import { Hero } from '@/components/sections/Hero';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ProductShowcase } from '@/components/sections/ProductShowcase';
import { Cpu, Zap, Shield, Palette } from 'lucide-react';

const features = [
  {
    icon: <Cpu size={24} />,
    title: 'Powerful Performance',
    description:
      'Engineered with cutting-edge technology to deliver unmatched speed and efficiency.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Lightning Fast',
    description:
      'Instant response times that keep you ahead of the curve in everything you do.',
  },
  {
    icon: <Shield size={24} />,
    title: 'Built to Last',
    description:
      'Premium materials and rigorous testing ensure reliability for years to come.',
  },
  {
    icon: <Palette size={24} />,
    title: 'Beautiful Design',
    description:
      'Every detail carefully crafted to create a product that is as stunning as it is functional.',
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        headline="Innovation Redefined"
        tagline="Experience the future of premium hardware. Designed with precision, built for excellence."
        ctaText="Explore Products"
        ctaHref="/products"
        secondaryCtaText="Learn More"
        secondaryCtaHref="/support"
      />

      <SectionWrapper id="features">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
            Why Choose Premium
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We obsess over every detail to create products that exceed
            expectations.
          </p>
        </div>
        <FeatureGrid features={features} columns={4} />
      </SectionWrapper>

      <SectionWrapper background="muted" id="showcase">
        <ProductShowcase
          title="Precision Engineering"
          description="Our flagship product represents years of research and development. Every component has been optimized for maximum performance and durability."
          imageAlt="Premium product showcase"
          features={[
            'Advanced thermal management',
            'Whisper-quiet operation',
            'Seamless integration',
            'Industry-leading warranty',
          ]}
        />
      </SectionWrapper>

      <SectionWrapper id="showcase-2">
        <ProductShowcase
          title="Designed for You"
          description="Intuitive controls and thoughtful ergonomics make every interaction a pleasure. This is technology that adapts to your workflow, not the other way around."
          imageAlt="Product ergonomics showcase"
          features={[
            'Customizable interface',
            'One-touch controls',
            'Smart automation',
            'Personalized experience',
          ]}
          reversed
        />
      </SectionWrapper>

      <SectionWrapper background="muted" className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
          Ready to Experience Premium?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who have made the switch to
          excellence.
        </p>
        <a
          href="/products"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          View All Products
        </a>
      </SectionWrapper>
    </>
  );
}
