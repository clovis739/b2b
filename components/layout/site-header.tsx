"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "../../app/ui";
import { sectors, categoryPath } from "../../app/site-data";
import { navigation } from "../../lib/navigation";
import { useWorkspace } from "../../hooks/use-workspace";

export default function SiteHeader() {
  const { account } = useWorkspace();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const close = () => {
    setMobile(false);
    ref.current
      ?.querySelectorAll("details[open]")
      .forEach((d) => d.removeAttribute("open"));
  };
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 100);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", handle);
    return () => document.removeEventListener("pointerdown", handle);
  }, []);
  return (
    <header
      ref={ref}
      className="clone-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div className="clone-header-inner">
        <Link
          href="/"
          className="clone-brand"
          aria-label="Globy home"
          onClick={close}
        >
          <Logo />
        </Link>
        <nav
          className={`clone-navigation ${mobile ? "is-open" : ""}`}
          id="clone-navigation"
          aria-label="Main navigation"
        >
          <details className="clone-nav-details categories-menu">
            <summary>
              <Icon name="grid" size={18} />
              All Categories
            </summary>
            <div className="clone-mega categories-mega">
              <div className="mega-heading">
                <h2>All product sectors</h2>
                <Link href="/b2bmarket/category-listing" onClick={close}>
                  View all <Icon name="arrow" size={15} />
                </Link>
              </div>
              <div className="mega-sector-grid">
                {sectors.map((s) => (
                  <Link
                    key={s.slug}
                    href={categoryPath(s.slug)}
                    onClick={close}
                  >
                    <Icon name={s.icon} size={19} />
                    <span>{s.name}</span>
                    <Icon name="chevron" size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </details>
          {navigation.map((group) => (
            <details className="clone-nav-details" key={group.title}>
              <summary>
                {group.title}
                <Icon name="down" size={12} />
              </summary>
              <div className="clone-mega solution-mega">
                <span className="mega-eyebrow">{group.title}</span>
                <div className="mega-link-grid">
                  {group.links.map((l) => (
                    <Link href={l.href} key={l.href} onClick={close}>
                      <span className="mega-icon">
                        <Icon name={l.icon} size={22} />
                      </span>
                      <span>
                        <strong>{l.title}</strong>
                        <small>{l.description}</small>
                      </span>
                      <Icon name="arrow" size={16} />
                    </Link>
                  ))}
                </div>
              </div>
            </details>
          ))}
          <Link href="/help-center" className="clone-help" onClick={close}>
            Help Center
          </Link>
        </nav>
        <div className="clone-header-actions">
          <form
            action="/b2bmarket/search"
            className={`clone-header-search ${scrolled ? "visible" : ""}`}
          >
            <Icon name="search" size={20} />
            <input
              aria-label="Search the marketplace"
              name="q"
              placeholder="Search"
            />
            <button type="submit" aria-label="Submit search">
              <Icon name="arrow" size={16} />
            </button>
          </form>
          <details className="clone-language">
            <summary>
              <Icon name="globe" size={17} />
              EN
            </summary>
            <div>
              English edition <Icon name="check" size={15} />
            </div>
          </details>
          <Link href={account ? "/workspace" : "/auth/sign-in"} className="clone-signin" onClick={close}>
            {account ? "Workspace" : "Sign In"}
          </Link>
          <button
            className="clone-mobile-toggle"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls="clone-navigation"
            onClick={() => setMobile(!mobile)}
          >
            <Icon name={mobile ? "close" : "menu"} size={23} />
          </button>
        </div>
      </div>
    </header>
  );
}
