import Link from "next/link";
import { Icon } from "../../app/ui";
export default function SectionHeading({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="clone-section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link href={href} className="clone-link-button">
          {action || "View all"}
          <Icon name="arrow" size={19} />
        </Link>
      )}
    </div>
  );
}
