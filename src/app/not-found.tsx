import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="container-wide text-center">
        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-display font-bold text-primary/20">
            404
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or doesn&apos;t exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary" size="lg" className="gap-2">
              <ArrowLeft size={18} />
              View Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
