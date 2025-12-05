import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { products, getProductBySlug } from '@/data/products';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Check } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Premium Hardware Co.',
    };
  }

  return {
    title: `${product.name} | Premium Hardware Co.`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Back Link */}
      <div className="container-wide pt-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>

      {/* Product Hero */}
      <section className="py-12 md:py-20">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Product Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">
                  {product.name}
                </span>
              </div>
              {product.isNew && (
                <span className="absolute top-6 left-6 px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-full">
                  New
                </span>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight text-foreground mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {product.tagline}
              </p>
              <p className="text-3xl font-semibold text-foreground mb-8">
                {product.price}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="flex-1">
                  Buy Now
                </Button>
                <Link href="/contact" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </div>

              {/* Key Features */}
              <div className="border-t border-border pt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <SectionWrapper background="muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-6">
            About {product.name}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      </SectionWrapper>

      {/* Specifications */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-8 text-center">
            Technical Specifications
          </h2>
          <div className="rounded-2xl border border-border overflow-hidden">
            {product.specs.map((spec, index) => (
              <div
                key={index}
                className={`flex justify-between py-4 px-6 ${
                  index !== product.specs.length - 1
                    ? 'border-b border-border'
                    : ''
                }`}
              >
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium text-foreground">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper background="muted" className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Experience the {product.name} for yourself. Our team is ready to help
          you make the perfect choice.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg">Buy {product.name}</Button>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Talk to an Expert
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
}
