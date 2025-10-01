import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px- py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Image Section */}
          <div className="flex justify-center items-center order-2 lg:order-1">
            <div className="relative">
              <div className="relative bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <Image
                  src="/404.png"
                  width={500}
                  height={500}
                  alt="404 illustration image"
                  className="w-full h-auto max-w-md mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                Error 404
              </div>

              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
                Oops...
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                The page you are looking for can not be found.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Possible Reasons
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>The URL may have been typed incorrectly</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>The page may have been moved or deleted</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span>It could be a broken or outdated link</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="group">
                <Link href="/" className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 48 48"
                    className="transition-transform group-hover:-translate-x-1"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M44 40.836c-4.893-5.973-9.238-9.362-13.036-10.168c-3.797-.805-7.412-.927-10.846-.365V41L4 23.545L20.118 7v10.167c6.349.05 11.746 2.328 16.192 6.833c4.445 4.505 7.009 10.117 7.69 16.836Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Back to Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
