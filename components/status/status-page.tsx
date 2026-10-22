"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  House,
  LifeBuoy,
  RefreshCw,
  ShieldAlert,
  ServerCrash,
  Search,
} from "lucide-react";
import { getHttpStatus } from "@/lib/http-status";
import PageMotion from "@/components/motion/page-motion";

export default function StatusPage({
  code,
  preview = false,
  retry,
  standalone = false,
}: {
  code: number;
  preview?: boolean;
  retry?: () => void;
  standalone?: boolean;
}) {
  const status = getHttpStatus(code);
  const StatusIcon =
    code === 404 ? Search : code < 500 ? ShieldAlert : ServerCrash;
  const signIn = code === 401 || code === 403;
  const content = (
    <main className="container http-status-page" data-status-code={code}>
      <div className="http-status-panel">
        <div className="http-status-art" aria-hidden="true">
          <span className="http-status-orbit" />
          <span className="http-status-code">{code}</span>
          <span className="http-status-icon">
            <StatusIcon size={34} strokeWidth={1.5} />
          </span>
        </div>
        <div className="http-status-copy page-intro">
          <span className="page-kicker">{status.name}</span>
          <h1>{status.title}</h1>
          <p>{status.description}</p>
          <div className="button-row">
            {retry ? (
              <button className="primary" onClick={retry}>
                <RefreshCw size={17} /> Try again
              </button>
            ) : (
              <Link className="primary" href={signIn ? "/auth/sign-in" : "/"}>
                {signIn ? "Sign in" : "Back to home"}
                <ArrowRight size={17} />
              </Link>
            )}
            <Link className="outline-button" href="/b2bmarket">
              Explore marketplace <ArrowRight size={17} />
            </Link>
          </div>
          <div className="http-status-help">
            <LifeBuoy size={18} />
            <span>
              Need a hand? <Link href="/contact-us">Contact our team</Link>
            </span>
          </div>
          {preview && (
            <p className="http-status-preview">
              Design preview · HTTP {code}
              <br />
              Preview of the recovery screen. Your account and data are
              unchanged.
            </p>
          )}
        </div>
      </div>
      <nav className="http-status-links" aria-label="Helpful destinations">
        <Link href="/">
          <House size={18} /> Home <ArrowRight size={15} />
        </Link>
        <Link href="/help-center">
          <LifeBuoy size={18} /> Help center <ArrowRight size={15} />
        </Link>
        {preview && (
          <Link href="/status">
            <ArrowLeft size={18} /> All status pages
          </Link>
        )}
      </nav>
    </main>
  );
  return standalone ? content : <PageMotion>{content}</PageMotion>;
}
