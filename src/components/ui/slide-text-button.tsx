import { cn } from "@/lib/utils";
import Link from "next/link";

type SlideTextButtonProps = {
  label: string;
  className?: string;
} & (
  | { as?: "button"; onClick?: () => void }
  | { as: "link"; href: string; target?: string; rel?: string }
);

export const SlideTextButton = ({
  label,
  className = "",
  ...props
}: SlideTextButtonProps) => {
  const inner = (
    <div className="relative overflow-hidden">
      <p className="opacity-100 group-hover:opacity-25 group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
        {label}
      </p>
      <p className="absolute top-7 left-0 opacity-25 group-hover:opacity-100 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
        {label}
      </p>
    </div>
  );

  const base = cn(
    `group cursor-pointer font-semibold text-white font-gilroy`,
    className,
  );

  if (props.as === "link") {
    const { href, target, rel } = props;
    return (
      <Link href={href} target={target} rel={rel} className={base}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={base} onClick={props.onClick}>
      {inner}
    </button>
  );
};
