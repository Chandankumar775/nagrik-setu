import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
           <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M12 10a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>
                <path d="M12 12.5c-4.42 0-8 1.79-8 4v.5"></path>
                <path d="M20 16.5c-4.42 0-8-1.79-8-4"></path>
                <path d="M12 2.5v2.5"></path>
                <path d="M12 10v2.5"></path>
                <path d="M16.5 4.75l-2.5 1.5"></path>
                <path d="M7.5 6.25l2.5-1.5"></path>
                <path d="m19.5 9-2.5 1.5"></path>
                <path d="m4.5 10.5 2.5-1.5"></path>
                <path d="M18.5 14.25-16 12"></path>
                <path d="m5.5 14.25 2.5-1.5"></path>
           </svg>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">
            Citizen Connect
          </span>
        </Link>
        <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/track">Track Report</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/admin">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                </Link>
            </Button>
        </nav>
      </div>
    </header>
  );
}
