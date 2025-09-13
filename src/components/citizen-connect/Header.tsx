import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
                <div className="bg-white rounded-full p-1">
                  <Image src="https://i.postimg.cc/zBZXPtFF/Jharkhand-Rajakiya-Chihna-svg.webp" alt="Jharkhand Government Logo" width={48} height={48} />
                </div>
               <div>
                <span className="font-headline text-xl font-bold tracking-tight text-primary">
                    Urban Dons
                </span>
                 <p className="text-xs text-muted-foreground font-semibold">An Initiative by Government of Jharkhand</p>
               </div>
            </Link>
            <div className="hidden lg:flex items-center gap-3 border-l pl-4">
                <p className="text-sm font-semibold text-muted-foreground">Civic Sense Prototype for SIH 2025</p>
                <Image src="https://i0.wp.com/opportunitycell.com/wp-content/uploads/2022/03/SIH2.png?fit=327%2C345&ssl=1" alt="SIH 2025 Logo" width={40} height={40} className="object-contain" />
            </div>
        </div>
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
