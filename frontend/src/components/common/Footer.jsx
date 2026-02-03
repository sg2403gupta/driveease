import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-b from-bg-muted-light to-bg-primary-light dark:from-bg-muted-dark dark:to-bg-primary-dark">
      {/* Top separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent dark:via-border-dark" />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="mb-2 text-lg font-semibold tracking-wide text-text-primary-light dark:text-text-primary-dark">
              Drive
              <span className="relative ml-1 text-accent">
                Ease
                <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-accent/30" />
              </span>
            </h2>

            <p className="max-w-sm text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
              DriveEase is a modern vehicle rental platform offering cars,
              bikes, and scooties with transparent pricing and flexible booking.
            </p>

            <p className="mt-3 text-xs text-text-muted-light/80 dark:text-text-muted-dark/80">
              Trusted by thousands of users across India.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted-dark">
              <li>Car Rentals</li>
              <li>Bike Rentals</li>
              <li>Long-term Booking</li>
              <li>Corporate Rentals</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:underline" to="/contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link className="hover:underline" to="/faq">
                  FAQs
                </Link>
              </li>
              <li>
                <Link className="hover:underline" to="/help">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-primary-light dark:text-text-primary-dark">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:underline" to="/privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:underline" to="/terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border-light pt-4 text-center dark:border-border-dark">
          <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
            © {new Date().getFullYear()} DriveEase. All rights reserved.
          </p>

          <p className="text-[10px] tracking-widest text-text-muted-light/70 dark:text-text-muted-dark/70">
            PREMIUM • SIMPLE • TRUSTED
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
