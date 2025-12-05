import { Metadata } from 'next';
import Link from 'next/link';
import { products } from '@/data/products';
import { SectionWrapper } from '@/components/sections/SectionWrapper';

export const metadata: Metadata = {
  title: 'Products | Premium Hardware Co.',
  description:
    'Explore our full range of premium hardware products. Designed with precision, built for excellence.',
};

export default function ProductsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-foreground mb-6">
            Our Products
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the full range of Premium hardware. Each product
            represents our commitment to excellence and innovation.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <article className="h-full rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                {/* Product Image Placeholder */}
                <div className="aspect-[4/3] bg-muted flex items-center justify-center relative overflow-hidden">
                  <span className="text-muted-foreground text-lg">
                    {product.name}
                  </span>
                  {product.isNew && (
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <span className="text-lg font-medium text-foreground">
                      {product.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {product.tagline}
                  </p>
                  <span className="text-sm text-primary font-medium group-hover:underline">
                    Learn more →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper background="muted" className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
          Need Help Choosing?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Our experts are here to help you find the perfect Premium product for
          your needs.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </Link>
      </SectionWrapper>
    </>
  );
}
