import Link from "next/link";
import { GALLERY_INFO } from "../constants/galleryInfo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">
              {GALLERY_INFO.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed font-light">
              {GALLERY_INFO.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">MENU</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/exhibitions"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link
                  href="/news"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  News/Events
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-light tracking-wider mb-4">CONTACT</h3>
            <div className="text-sm text-gray-600 space-y-2 font-light flex flex-col gap-0.5">
              <Link
                href={`mailto:${GALLERY_INFO.contact.email}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                {GALLERY_INFO.contact.email}
              </Link>
              <Link
                href={GALLERY_INFO.socialMedia.instagramUrl}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Instagram: {GALLERY_INFO.socialMedia.instagramId}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 font-light">
              © 2025 Space 458. All rights reserved.
            </p>
            <Link
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-500 transition-colors font-light "
            >
              관리자
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
