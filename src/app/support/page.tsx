import { Metadata } from 'next';
import Link from 'next/link';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import {
  HelpCircle,
  Book,
  MessageCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support | Premium Hardware Co.',
  description:
    'Get help with your Premium products. Access documentation, FAQs, and contact our support team.',
};

const supportCategories = [
  {
    icon: <Book size={24} />,
    title: 'Documentation',
    description: 'Comprehensive guides and manuals for all Premium products.',
    href: '#documentation',
  },
  {
    icon: <HelpCircle size={24} />,
    title: 'FAQs',
    description: 'Quick answers to commonly asked questions.',
    href: '#faqs',
  },
  {
    icon: <MessageCircle size={24} />,
    title: 'Contact Support',
    description: 'Get in touch with our expert support team.',
    href: '/contact',
  },
  {
    icon: <FileText size={24} />,
    title: 'Warranty & Returns',
    description: 'Information about our warranty coverage and return policy.',
    href: '#warranty',
  },
];

const faqs = [
  {
    question: 'What is included in the warranty?',
    answer:
      'All Premium products come with a comprehensive warranty that covers manufacturing defects and hardware failures. Our flagship products include a 5-year warranty, while standard products come with 2-3 years of coverage.',
  },
  {
    question: 'How do I set up my new Premium product?',
    answer:
      'Each Premium product comes with a quick start guide. For detailed instructions, visit our Documentation section or download the Premium companion app for guided setup.',
  },
  {
    question: 'Can I extend my warranty?',
    answer:
      'Yes! Premium Care+ extended warranty is available for all products. You can purchase extended coverage within 60 days of your original purchase.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for all unused products in original packaging. For defective products, we offer free replacements or repairs under warranty.',
  },
  {
    question: 'How do I contact technical support?',
    answer:
      'You can reach our technical support team via the Contact page, or call us directly at 1-800-PREMIUM. Support is available 24/7 for flagship product owners.',
  },
];

export default function SupportPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-foreground mb-6">
            How Can We Help?
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers, access documentation, and get support for your Premium
            products.
          </p>
        </div>
      </section>

      {/* Support Categories */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportCategories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group flex items-start gap-4 p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                {category.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {category.title}
                </h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <ChevronRight
                size={20}
                className="text-muted-foreground group-hover:text-primary transition-colors mt-1"
              />
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQs */}
      <SectionWrapper background="muted" id="faqs">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border border-border bg-card overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 text-lg font-medium text-foreground hover:text-primary transition-colors">
                  {faq.question}
                  <ChevronRight
                    size={20}
                    className="transform group-open:rotate-90 transition-transform text-muted-foreground"
                  />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Documentation */}
      <SectionWrapper id="documentation">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
            Product Documentation
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Access user guides, technical specifications, and setup instructions
            for all Premium products.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {['Pro X User Guide', 'Studio Manual', 'Essential Quick Start'].map(
              (doc, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-border bg-card text-center"
                >
                  <FileText
                    size={32}
                    className="mx-auto text-muted-foreground mb-4"
                  />
                  <h3 className="font-medium text-foreground mb-2">{doc}</h3>
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    Download PDF
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </SectionWrapper>

      {/* Warranty Info */}
      <SectionWrapper background="muted" id="warranty">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
            Warranty & Returns
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            We stand behind every Premium product. All purchases include
            comprehensive warranty coverage and our satisfaction guarantee.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-4xl font-display font-bold text-primary mb-2">
                5yr
              </div>
              <div className="text-foreground font-medium">
                Flagship Warranty
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-4xl font-display font-bold text-primary mb-2">
                30
              </div>
              <div className="text-foreground font-medium">
                Day Returns
              </div>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="text-4xl font-display font-bold text-primary mb-2">
                24/7
              </div>
              <div className="text-foreground font-medium">
                Support Available
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="text-center">
        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-foreground mb-4">
          Still Need Help?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Our expert support team is ready to assist you with any questions or
          concerns.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Contact Support
        </Link>
      </SectionWrapper>
    </>
  );
}
