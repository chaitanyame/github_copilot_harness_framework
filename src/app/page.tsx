export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-display font-bold tracking-tight">
          Premium Hardware Co.
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Experience the future of premium hardware. Designed with precision, built for excellence.
        </p>
        <button className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-medium hover:opacity-90 transition-opacity">
          Learn More
        </button>
      </div>
    </main>
  );
}
