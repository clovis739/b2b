"use client";
import Link from "next/link";
import { useWorkspace } from "../../hooks/use-workspace";
export default function WorkspaceStatus() {
  const { account, ready, status, error, retry, sessionExpired } =
    useWorkspace();
  return (
    <div className={`workspace-status ${error ? "has-error" : ""}`}>
      <span role="status">{status}</span>
      {account ? (
        <Link href="/workspace/settings">
          {account.name} · {account.role}
        </Link>
      ) : (
        ready && (
          <Link href="/auth/sign-in">Sign in to save across devices</Link>
        )
      )}
      {error && (
        <>
          <span role="alert">{error}</span>
          <button type="button" className="text-button" onClick={retry}>
            Retry
          </button>
        </>
      )}
      {sessionExpired && (
        <Link href="/auth/sign-in">Sign in again to save your changes</Link>
      )}
    </div>
  );
}
