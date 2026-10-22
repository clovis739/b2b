import { ReactNode } from "react";
import SiteHeader from "../components/layout/site-header";
import { Suspense } from "react";
import SiteMotion from "../components/motion/site-motion";
import SiteFooter from "../components/layout/site-footer";
import Assistance from "../components/layout/assistance";
import { WorkspaceProvider } from "../hooks/use-workspace";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <a href="#page-content" className="skip-link">
        Skip to main content
      </a>
      <SiteHeader />
      <div id="page-content" className="site-page">
        {children}
      </div>
      <SiteFooter />
      <Assistance />
      <Suspense fallback={null}><SiteMotion /></Suspense>
    </WorkspaceProvider>
  );
}
