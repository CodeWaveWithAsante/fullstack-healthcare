import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Page not found
            </h2>
            <p className="text-muted-foreground">
              We couldn't find the page you're looking for. It might have been
              moved, deleted, or never existed.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground gap-2"
        >
          <MoveLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
