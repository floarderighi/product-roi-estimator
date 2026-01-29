import Image from 'next/image';
import Link from 'next/link';

export function FloatingLogo() {
  return (
    <Link
      href="https://www.delva.co/"
      target="_blank"
      rel="noopener noreferrer"
      className="hidden sm:fixed sm:bottom-6 sm:right-6 z-50 hover:opacity-80 transition-opacity bg-white rounded-lg shadow-lg p-3 border border-gray-200"
    >
      <Image
        src="/logo.svg"
        alt="Delva Logo"
        width={100}
        height={30}
        priority
        className="h-6 w-auto"
      />
    </Link>
  );
}
