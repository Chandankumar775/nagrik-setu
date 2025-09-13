import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
            <Image src="https://i.postimg.cc/zBZXPtFF/Jharkhand-Rajakiya-Chihna-svg.webp" alt="Jharkhand Government Logo" width={48} height={48} />
           <div>
            <span className="font-headline text-xl font-bold tracking-tight text-primary">
                Jharkhand Citizen Connect
            </span>
             <p className="text-xs text-muted-foreground font-semibold">An Initiative by Government of Jharkhand</p>
           </div>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/#report-form">Submit Report</Link>
            </Button>
            <Button variant="ghost" asChild>
                <Link href="/track">Track Report</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="#">About</Link>
            </Button>
             <Button variant="ghost" asChild>
                <Link href="#">Contact</Link>
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
