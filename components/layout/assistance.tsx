"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "../../app/ui";

export default function Assistance() {
  const [cookies, setCookies] = useState(false);
  const [settings, setSettings] = useState(false);
  const [chat, setChat] = useState(false);
  useEffect(() => {
    try {
      // Hydrate consent from browser storage after the server render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCookies(!localStorage.getItem("globy-cookie-choice"));
    } catch {}
  }, []);
  const choose = (value: string) => {
    try {
      localStorage.setItem("globy-cookie-choice", value);
    } catch {}
    setCookies(false);
  };
  return (
    <>
      {cookies && (
        <aside className="clone-cookie" aria-labelledby="cookie-title">
          <h2 id="cookie-title">Choose your cookies</h2>
          <p>
            Guest drafts and preferences use browser storage. Signing in uses
            an essential session cookie. No advertising trackers are connected.
          </p>
          <p>
            Read our <Link href="/cookie-policy">Cookie Policy</Link>.
          </p>
          {settings && (
            <p className="clone-cookie-settings">
              Essential storage keeps your choices on this device. Optional
              analytics and advertising are disabled.
            </p>
          )}
          <button className="primary" onClick={() => choose("accepted")}>
            Accept all
          </button>
          <button className="primary" onClick={() => choose("essential")}>
            Reject optional
          </button>
          <button
            className="outline-button"
            aria-expanded={settings}
            onClick={() => setSettings(!settings)}
          >
            Settings
          </button>
        </aside>
      )}
      {chat && (
        <aside className="clone-chat-panel" aria-label="Help panel">
          <div>
            <h2>How can we help?</h2>
            <button aria-label="Close help" onClick={() => setChat(false)}>
              <Icon name="close" size={18} />
            </button>
          </div>
          <p>Find the next step for your sourcing or logistics plans.</p>
          {[
            ["Search products", "/b2bmarket"],
            ["Create a sourcing request", "/rfqs/add-rfq"],
            ["Explore logistics tools", "/logistics-promo"],
            ["Visit the help center", "/help-center"],
          ].map(([title, href]) => (
            <Link href={href} key={href} onClick={() => setChat(false)}>
              {title}
              <Icon name="chevron" size={15} />
            </Link>
          ))}
        </aside>
      )}
      <button
        className="clone-chat-button"
        aria-label={chat ? "Close help" : "Open help"}
        aria-expanded={chat}
        onClick={() => setChat(!chat)}
      >
        <Icon name={chat ? "close" : "mail"} size={24} />
      </button>
    </>
  );
}
