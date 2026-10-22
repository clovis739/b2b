"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { PageEntry } from "../../app/route-map";
import { Icon, Modal } from "../../app/ui";
import { usePageController } from "../../hooks/use-page-controller";
import WorkspaceStatus from "./workspace-status";
export default function PageFrame({
  entry,
  children,
}: {
  entry: PageEntry;
  children: ReactNode;
}) {
  const {
    notice,
    setNotice,
    modal,
    setModal,
    form,
    setSaved,
    setDrafts,
    setProfile,
    account,
  } = usePageController();
  return (
    <main className="container site-content" data-page-kind={entry.kind}>
      <div className="site-breadcrumbs">
        <Link href="/">Home</Link>
        <Icon name="chevron" size={11} />
        <Link href="/site-map">Explore</Link>
        <Icon name="chevron" size={11} />
        <span>{entry.title}</span>
      </div>
      {entry.kind !== "landed" && entry.kind !== "load" && <WorkspaceStatus />}
      {notice && (
        <div className="page-notice" role="status">
          <Icon name="check" size={18} />
          <span>{notice}</span>
          <button aria-label="Dismiss message" onClick={() => setNotice("")}>
            <Icon name="close" size={17} />
          </button>
        </div>
      )}
      {children}
      {modal && (
        <Modal
          title={
            entry.kind === "workspace"
              ? "Clear local demo data?"
              : "Start a conversation"
          }
          onClose={() => setModal(false)}
        >
          {entry.kind === "workspace" && !account ? (
            <div className="inquiry-form">
              <p className="muted">
                This removes saved products, drafts and your profile from this
                browser.
              </p>
              <button
                className="primary"
                onClick={() => {
                  try {
                    [
                      "globy-site-saved",
                      "globy-site-drafts",
                      "globy-profile",
                      "globy-saved",
                      "globy-inquiries",
                    ].forEach((k) => localStorage.removeItem(k));
                  } catch {}
                  setSaved([]);
                  setDrafts([]);
                  setProfile("");
                  setModal(false);
                  setNotice("Local demo data cleared.");
                }}
              >
                Clear demo data
              </button>
              <button
                className="outline-button"
                onClick={() => setModal(false)}
              >
                Keep my data
              </button>
            </div>
          ) : (
            form("inquiry", "Save your inquiry")
          )}
        </Modal>
      )}
    </main>
  );
}
