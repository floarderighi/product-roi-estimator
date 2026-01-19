import Image from 'next/image';
import Link from 'next/link';

export function TopBar() {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="https://www.delva.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo.svg"
              alt="Delva Logo"
              width={120}
              height={36}
              priority
              className="h-7 sm:h-8 w-auto"
            />
          </Link>

          <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900">
            Product ROI Estimator
          </h1>
        </div>
      </div>
    </header>
  );
}
