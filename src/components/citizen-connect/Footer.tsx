import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-6 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-center sm:text-left grow-0">© Government of Jharkhand | Developed under Smart India Hackathon by Team Urban Dons</p>
            <div className="flex gap-4 shrink-0">
                <Link href="#" className="hover:underline">Privacy Policy</Link>
                <Link href="#" className="hover:underline">Terms of Use</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
