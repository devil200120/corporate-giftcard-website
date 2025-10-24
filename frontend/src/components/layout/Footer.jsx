import React from "react";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../icons/SocialIcons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Stay Updated with Our Latest Offers
            </h2>
            <p className="text-base mb-4 text-gray-700">
              Subscribe to our newsletter and never miss exclusive deals and new
              arrivals
            </p>
            <div className="max-w-sm mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-3 py-2 text-sm rounded-l-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border-0"
              />
              <button className="bg-gray-900 hover:bg-gray-800 px-4 py-2 text-sm rounded-r-lg font-medium text-white transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"></div>
                <span className="text-2xl font-bold">GiftHub</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your premier destination for corporate gifting solutions. We
                help businesses strengthen relationships through thoughtful,
                personalized gifts.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                  <a
                    href="mailto:support@gifthub.com"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@gifthub.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="w-5 h-5 text-primary-400" />
                  <a
                    href="tel:+1-555-123-4567"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-primary-400 mt-1" />
                  <address className="text-gray-300 not-italic">
                    123 Business District
                    <br />
                    Corporate Plaza, Suite 500
                    <br />
                    New York, NY 10001
                  </address>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/categories"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Categories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/corporate/register"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Corporate Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/bulk-orders"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Bulk Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gift-cards"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Customer Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Shipping Information
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    to="/track-order"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal & Policies</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie-policy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sitemap"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media & Payment Methods */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
            {/* Social Media Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium">Follow Us:</span>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">We Accept:</span>
              <div className="flex space-x-2">
                <div className="bg-white rounded p-2">
                  <img
                    src="/payment-icons/visa.svg"
                    alt="Visa"
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white rounded p-2">
                  <img
                    src="/payment-icons/mastercard.svg"
                    alt="Mastercard"
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white rounded p-2">
                  <img
                    src="/payment-icons/amex.svg"
                    alt="American Express"
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white rounded p-2">
                  <img
                    src="/payment-icons/paypal.svg"
                    alt="PayPal"
                    className="h-6 w-auto"
                  />
                </div>
                <div className="bg-white rounded p-2">
                  <img
                    src="/payment-icons/stripe.svg"
                    alt="Stripe"
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} GiftHub. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline flex items-center">
                Made with <HeartIcon className="w-4 h-4 text-red-500 mx-1" />{" "}
                for businesses
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <Link to="/status" className="hover:text-white transition-colors">
                System Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
