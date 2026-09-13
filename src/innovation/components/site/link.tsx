import type { AnchorHTMLAttributes } from "react";

// Full-page links keep the marketing and sensor dashboard styles independent.
export default function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} />;
}
