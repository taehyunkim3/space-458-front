import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">SPACE 458</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              동시대 예술 플랫폼으로, 예술이 머무는 장소를 넘어서 
              지속적으로 질문하고 움직이는 살아있는 공간입니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">MENU</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  About
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  News/Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">CONTACT</h3>
            <div className="text-sm text-gray-600 space-y-2 font-light">
              <p>gallery@space458.com</p>
              <p>Instagram: @space458</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center font-light">
            © 2024 Space 458. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}