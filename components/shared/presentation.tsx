"use client";
import Image from "next/image";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { SiteProduct, productPath } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { useWorkspace } from "../../hooks/use-workspace";
export function Photo({
  name,
  alt = "",
  className = "",
}: {
  name: string;
  alt?: string;
  className?: string;
}) {
  return (
    <div className={`site-photo ${className}`}>
      <Image
        src={`/images/${name}.jpg`}
        alt={alt}
        fill
        sizes="(max-width:700px) 100vw, 50vw"
      />
    </div>
  );
}
export function Intro({
  entry,
  description,
}: {
  entry: PageEntry;
  description?: string;
}) {
  return (
    <div className="page-intro">
      <span className="page-kicker">CONNECTED OPPORTUNITIES · VANTORA</span>
      <h1>{entry.title}</h1>
      <p>
        {description ||
          "Discover new possibilities for your business, wherever trade takes you."}
      </p>
    </div>
  );
}
export function ProductCard({
  p,
  saved,
  toggle,
}: {
  p: SiteProduct;
  saved: string[];
  toggle: (id: string) => void;
}) {
  const { ready } = useWorkspace();
  return (
    <article className="site-product">
      <div className="site-product-image">
        <Link href={productPath(p)}>
          <Photo name={p.image} alt={p.name} />
        </Link>
        <button
          disabled={!ready}
          aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
          aria-pressed={saved.includes(p.id)}
          className={`favorite ${saved.includes(p.id) ? "is-saved" : ""}`}
          onClick={() => toggle(p.id)}
        >
          <Icon name="heart" size={18} />
        </button>
        <span className="sample-pill">Sample listing</span>
      </div>
      <div className="site-product-body">
        <span className="product-card-category">{p.category.replaceAll("-", " ")}</span>
        <small>
          {p.flag} {p.country}
        </small>
        <h3>
          <Link href={productPath(p)}>{p.name}</Link>
        </h3>
        <div className="product-card-price"><strong>
          {p.price ? `US$ ${p.price.toLocaleString()}` : "Price upon request"}
        </strong>
        {p.price && <span className="unit"> / {p.unit}</span>}</div>
        <p>
          Min. order: {p.min} {p.unit.toLowerCase()}s
        </p>
        <Link
          className="supplier-name"
          href={`/b2bmarket/supplier-listing/${p.supplierSlug}`}
        >
          {p.supplier}
          <Icon name="chevron" size={12} />
        </Link>
        <Link className="contact-button" href={`${productPath(p)}#inquiry`}>
          <Icon name="mail" size={15} />
          Contact supplier
          <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}
