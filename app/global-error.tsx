"use client";
import StatusPage from "@/components/status/status-page";
import Link from "next/link";
import "./status.css";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body className="http-status-document">
        <title>Something went wrong | Vantora</title>
        <meta name="robots" content="noindex" />
        <Link className="http-status-brand" href="/">
          Vantora
        </Link>
        <StatusPage code={500} retry={retry} standalone />
      </body>
    </html>
  );
}
