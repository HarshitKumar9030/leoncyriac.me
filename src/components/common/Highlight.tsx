import React from "react";
import Link from "next/link";

type HighlightProps = {
  children: React.ReactNode;
  href?: string;
};

const Highlight: React.FC<HighlightProps> = ({ children, href }) => {
  const baseStyles =
    "text-neutral-700 dark:text-neutral-300 underline underline-offset-[5px] cursor-pointer font-bold hover:dark:text-white hover:text-neutral-950 duration-300 transition-all";

  if (href) {
    return (
      <Link href={href} passHref>
        <span className={baseStyles}>{children}</span>
      </Link>
    );
  }

  return <span className={baseStyles}>{children}</span>;
};

export default Highlight;
