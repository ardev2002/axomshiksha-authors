import * as motion from "motion/react-client";
import { Mail, Phone, MapPin, Copyright, Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur supports-backdrop-filter:bg-background/40 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Top: Branding + Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            AxomShiksha
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mt-2">
            Empowering students in Assam with quality educational resources, study materials, and learning support.
            Your trusted companion in education.
          </p>
        </motion.div>

        {/* Middle: 3-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-and-conditions" className="hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/study-materials" className="hover:text-primary">Study Materials</Link></li>
              <li><Link href="/classes" className="hover:text-primary">Classes</Link></li>
              <li><Link href="/practice" className="hover:text-primary">Practice</Link></li>
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:contact@axomshiksha.com" className="hover:text-primary">
                  contact@axomshiksha.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+919954765021" className="hover:text-primary">
                  +91 9954765021
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                AxomShiksha Learning Center
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="flex space-x-4"
            >
              {[
                { icon: Instagram, href: "https://instagram.com" },
                { icon: Facebook, href: "https://facebook.com" },
                { icon: Twitter, href: "https://twitter.com" },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0 },
                  }}
                  href={href}
                  target="_blank"
                  className="p-2 rounded-full border border-border hover:border-primary transition-all hover:text-primary"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom: Copyright */}
        <div className="border-t flex items-center justify-center border-border mt-12 pt-6 text-center text-muted-foreground text-sm">
          <Copyright size={16}/>2026 - AxomShiksha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
