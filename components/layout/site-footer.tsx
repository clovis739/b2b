import Link from "next/link";
import { Icon, Logo } from "../../app/ui";
import { footerGroups } from "../../lib/navigation";
import FooterMotion from "../motion/footer-motion";

export default function SiteFooter() {
  return (
    <FooterMotion>
      <div className="clone-footer-inner">
        <div className="clone-footer-top">
          <div className="clone-footer-about">
            <Link href="/" aria-label="Globy home">
              <Logo />
            </Link>
            <p>
              Your trusted partner in global trade and logistics. We help
              suppliers and buyers connect and work more efficiently.
            </p>
          </div>
          <div className="clone-social">
            <span>Explore Globy</span>
            <div>
              {[
                { label: "About Globy", href: "/about-us", icon: "globe" },
                { label: "Industry insights", href: "/blog", icon: "file" },
                {
                  label: "Trade show calendar",
                  href: "/events-calendar",
                  icon: "calendar",
                },
                { label: "Help center", href: "/help-center", icon: "help" },
              ].map(({ label, href, icon }) => (
                <Link key={href} href={href} aria-label={label} title={label}>
                  <Icon name={icon} size={18} />
                </Link>
              ))}
            </div>
          </div>
          <div className="clone-footer-contact">
            <span>Need help?</span>
            <Link href="/contact-us">
              Contact us <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
        <nav className="clone-footer-columns" aria-label="Footer navigation">
          {footerGroups.map((g) => (
            <div key={g.title}>
              <h2>{g.title}</h2>
              {g.links.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="clone-footer-bottom">
          <p>
            © 2026 Globy
            <span className="clone-footer-disclosure">
              Independent local implementation.
            </span>
          </p>
          <nav aria-label="Legal information">
            <Link href="/terms-and-conditions">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/cookie-policy">Cookies</Link>
          </nav>
        </div>
      </div>
    </FooterMotion>
  );
}
