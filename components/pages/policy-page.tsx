"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";

import { Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function PolicyPage({ entry }: { entry: PageEntry }) {
  const {} = usePageController();
  return (
    <>
      <Intro
        entry={entry}
        description="Information about this independent development preview."
      />
      <article className="content-panel reading-panel">
        <p className="notice form-note">
          This is original demo information, not Vantora’s legal policy. It must
          be reviewed and replaced with the operator’s policies before
          production use.
        </p>
        {(entry.key === "privacy"
          ? [
              [
                "What this preview stores",
                "Guest product IDs, drafts and profile names are stored in browser local storage. Registered accounts store email, display name, buyer/supplier role, salted password hashes, expiring sessions and private workspace drafts in the server database. Forms do not deliver messages to suppliers.",
              ],
              [
                "Images and external links",
                "Images are served locally. Following an external link takes you to a separate service with its own policies.",
              ],
              [
                "Managing your data",
                "You can remove draft entries in the workspace. Signed-in changes sync to your account. Workspace settings can clear guest browser data or sign out of an account. Account deletion and email recovery require further implementation before public launch.",
              ],
            ]
          : entry.key === "cookies"
            ? [
                [
                  "Browser storage",
                  "Guest saved products and drafts use local storage. Signing in sets a necessary HttpOnly session cookie that expires after seven days; it is marked Secure when served over HTTPS. No advertising or analytics cookies are included in the application code.",
                ],
                [
                  "Your choices",
                  "Use Workspace settings to clear locally stored demo data. Browser settings can also remove this site’s storage.",
                ],
              ]
            : [
                [
                  "Development preview",
                  "This application is an independent local marketplace build. Listings, supplier badges, prices and event information are illustrative.",
                ],
                [
                  "No live commercial service",
                  "Accounts can register and sign in to store private drafts. No purchase, freight booking, supplier communication or public listing publication is completed through this preview.",
                ],
                [
                  "Before production",
                  "The operator must provide real business information, reviewed terms, a privacy policy and the necessary service integrations before launching a live platform.",
                ],
              ]
        ).map(([t, p]) => (
          <section key={t}>
            <h2>{t}</h2>
            <p>{p}</p>
          </section>
        ))}
        <Link href="/workspace/settings" className="outline-button">
          Manage local data
        </Link>
      </article>
    </>
  );
}
