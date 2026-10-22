"use client";
import {
  createContext,
  useContext,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import InquiryForm from "../components/forms/inquiry-form";
import { PageEntry } from "../app/route-map";
import { SiteProduct } from "../app/site-data";
import { Icon } from "../app/ui";
import { ProductCard } from "../components/shared/presentation";
import { useWorkspace } from "./use-workspace";
function useController(entry: PageEntry) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const workspace = useWorkspace();
  const { saved, setSaved, drafts, setDrafts, profile, ready } = workspace;
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (entry.path.endsWith("/search"))
      // Read browser URL state after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(new URLSearchParams(window.location.search).get("q") || "");
  }, [entry.path]);
  const toggle = (id: string) => {
    if (!ready) {
      setNotice("Your workspace is still loading. Please try again.");
      return;
    }
    setSaved((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  };
  const save = (e: FormEvent<HTMLFormElement>, type: string = entry.kind) => {
    e.preventDefault();
    if (!ready) {
      setNotice("Wait for your workspace to load before saving.");
      return;
    }
    const form = e.currentTarget;
    const fields = Object.fromEntries(
      [...new FormData(form)].map(([k, v]) => [k, String(v)]),
    );
    delete fields.password;
    setDrafts((old) => [
      {
        id: Date.now() * 1000 + Math.floor(Math.random() * 1000),
        title: fields.subject || fields.product || entry.title,
        type,
        fields,
      },
      ...old,
    ]);
    setNotice(
      workspace.account
        ? "Draft added. Account sync status is shown above. Nothing has been sent to a supplier."
        : "Draft saved in your workspace on this device. Nothing has been sent externally.",
    );
    form.reset();
  };
  const grid = (list: SiteProduct[]) => (
    <div className="site-product-grid">
      {list.map((p) => (
        <ProductCard key={p.id} p={p} saved={saved} toggle={toggle} />
      ))}
    </div>
  );
  const searchBar = (placeholder = "Search...") => (
    <div className="filter-search">
      <Icon name="search" size={18} />
      <input
        aria-label={placeholder}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />
      {query && (
        <button aria-label="Clear search" onClick={() => setQuery("")}>
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
  const form = (type: string, title: string) => (
    <InquiryForm
      type={type}
      title={title}
      profile={profile}
      onSubmit={save}
      contextTitle={entry.title}
      contextPath={entry.path}
    />
  );

  return {
    ...workspace,
    router,
    query,
    setQuery,
    country,
    setCountry,
    sort,
    setSort,
    page,
    setPage,
    saved,
    setSaved,
    drafts,
    setDrafts,
    notice,
    setNotice,
    modal,
    setModal,
    profile,
    toggle,
    save,
    grid,
    searchBar,
    form,
  };
}
const PageContext = createContext<ReturnType<typeof useController> | null>(
  null,
);
export function PageProvider({
  entry,
  children,
}: {
  entry: PageEntry;
  children: ReactNode;
}) {
  const value = useController(entry);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}
export function usePageController() {
  const value = useContext(PageContext);
  if (!value) throw new Error("PageProvider is required");
  return value;
}
