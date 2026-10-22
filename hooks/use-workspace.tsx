"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import type { Account } from "../server/accounts";
import { normalizeDrafts, WorkspaceDraft } from "../lib/workspace";

export async function accountRequest(
  path: string,
  data: unknown,
  method = "POST",
) {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok)
    throw new AccountRequestError(
      result.error || "Request failed. Please try again.",
      response.status,
    );
  return result;
}
class AccountRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
function useWorkspaceState() {
  const [account, setAccount] = useState<Account | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<WorkspaceDraft[]>([]);
  const [profile, setProfile] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState("");
  const [status, setStatus] = useState("Loading workspace…");
  const [tick, setTick] = useState(0);
  const revision = useRef(0);
  const persisted = useRef("");
  const busy = useRef(false);
  const blocked = useRef(false);
  const changed = useRef(false);
  const loadSequence = useRef(0);
  const [guestCount, setGuestCount] = useState(0);
  const signature = JSON.stringify({ drafts, saved });

  async function refreshAccount() {
    const sequence = ++loadSequence.current;
    const response = await fetch("/api/workspace", { cache: "no-store" });
    if (!response.ok)
      throw new Error(
        "Could not load your workspace. Retry before making changes.",
      );
    const data = await response.json();
    if (sequence !== loadSequence.current) return;
    setError("");
    let nextDrafts: WorkspaceDraft[] = [];
    let nextSaved: string[] = [];
    let nextProfile = "";
    try {
      const guestDrafts = normalizeDrafts(
        JSON.parse(localStorage.getItem("globy-site-drafts") || "[]"),
      );
      setGuestCount(guestDrafts.length);
      if (!data.user) {
        nextDrafts = guestDrafts;
        const localSaved = JSON.parse(
          localStorage.getItem("globy-site-saved") || "[]",
        );
        nextSaved = Array.isArray(localSaved)
          ? localSaved.filter((s): s is string => typeof s === "string")
          : [];
        nextProfile = localStorage.getItem("globy-profile") || "";
      }
    } catch {
      /* Browser storage may be disabled. Account storage still works. */
    }
    if (data.user) {
      nextDrafts = normalizeDrafts(data.drafts);
      nextSaved = data.saved;
      nextProfile = data.user.name;
    }
    revision.current = data.revision || 0;
    persisted.current = JSON.stringify({
      drafts: nextDrafts,
      saved: nextSaved,
    });
    setLastSaved(persisted.current);
    blocked.current = false;
    changed.current = false;
    setAccount(data.user);
    setSessionExpired(false);
    setDrafts(nextDrafts);
    setSaved(nextSaved);
    setProfile(nextProfile);
    setStatus(
      data.user
        ? "Saved to your account"
        : "Guest workspace · saved on this device",
    );
    setReady(true);
  }
  useEffect(() => {
    // Load the external session and browser workspace after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshAccount().catch((e) => {
      setError(e.message);
      setStatus("Workspace unavailable");
    });
  }, []);
  useEffect(() => {
    if (!ready) return;
    if (!account) {
      try {
        localStorage.setItem("globy-site-saved", JSON.stringify(saved));
        localStorage.setItem("globy-site-drafts", JSON.stringify(drafts));
      } catch {
        // Announce an external storage failure to prevent silent data loss.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setError(
          "Browser storage is unavailable. Download your drafts before leaving.",
        );
      }
      return;
    }
    changed.current = signature !== persisted.current;
    if (!changed.current || busy.current || blocked.current) return;
    const timer = setTimeout(async () => {
      busy.current = true;
      setStatus("Saving to your account…");
      try {
        const result = await accountRequest(
          "/api/workspace",
          { drafts, saved, revision: revision.current },
          "PUT",
        );
        revision.current = result.revision;
        persisted.current = signature;
        setLastSaved(signature);
        setError("");
        setStatus("Saved to your account");
      } catch (e) {
        if (e instanceof AccountRequestError && e.status === 401)
          setSessionExpired(true);
        blocked.current = true;
        setStatus("Changes have not been saved");
        setError(
          e instanceof Error ? e.message : "Could not save your workspace.",
        );
      } finally {
        busy.current = false;
        setTick((n) => n + 1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [account, ready, drafts, saved, signature, tick]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (account && changed.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [account]);
  async function logout() {
    if (busy.current || changed.current)
      throw new Error(
        "Wait for your workspace to finish saving before signing out.",
      );
    await accountRequest("/api/auth/logout", {});
    await refreshAccount();
  }
  async function updateProfile(name: string) {
    if (account) {
      const data = await accountRequest("/api/auth/profile", { name });
      setAccount(data.user);
      setProfile(data.user.name);
    } else {
      localStorage.setItem("globy-profile", name);
      setProfile(name);
    }
  }
  function importGuestDrafts() {
    try {
      const guest = normalizeDrafts(
        JSON.parse(localStorage.getItem("globy-site-drafts") || "[]"),
      );
      setDrafts((old) => [
        ...old,
        ...guest.filter((d) => !old.some((x) => x.id === d.id)),
      ]);
      setGuestCount(0);
    } catch {
      setError("Could not read guest drafts from browser storage.");
    }
  }
  function retry() {
    if (!ready) refreshAccount().catch((e) => setError(e.message));
    else {
      blocked.current = false;
      setError("");
      setTick((n) => n + 1);
    }
  }
  function resumeSession(user: Account) {
    setAccount(user);
    setSessionExpired(false);
    blocked.current = false;
    setError("");
    setTick((n) => n + 1);
  }
  return {
    account,
    sessionExpired,
    resumeSession,
    saved,
    setSaved,
    drafts,
    setDrafts,
    profile,
    setProfile,
    ready,
    error,
    status:
      account &&
      signature !== lastSaved &&
      !error &&
      status !== "Saving to your account…"
        ? "Unsaved changes…"
        : status,
    refreshAccount,
    logout,
    updateProfile,
    retry,
    guestCount,
    importGuestDrafts,
  };
}
const WorkspaceContext = createContext<ReturnType<
  typeof useWorkspaceState
> | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useWorkspaceState();
  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("WorkspaceProvider is required");
  return value;
}
