import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export const EntitySectionTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return <h2 className={cn("my-3 text-sm font-bold", className)}>{title}</h2>;
};

export const EntitySectionContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={cn("mb-2 px-2", className)}>{children}</div>
);

export const EntityFieldContent = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={cn("mb-4", className)}>{children}</div>
);

export const EntityFieldTitle = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return <h3 className={cn("text-xs mt-2 mb-1 font-bold", className)}>{title}</h3>;
};

export const EntityFieldReadonlyText = ({
  text,
  className,
}: {
  text?: string | number;
  className?: string;
}) => {
  return (
    <div className="mt-2 min-w-0">
      <p className={cn("font-normal text-xs", className)}>
        {(text ?? "") === "" ? "--" : text}
      </p>
    </div>
  );
};

export const EntityFieldReadonlyList = ({
  list,
  className,
}: {
  list?: Array<{ code?: string; description?: string }>;
  className?: string;
}) => {
  return !list || list.length === 0 ? (
    <div className="mt-2">
      <p className={cn("font-normal text-xs")}>--</p>
    </div>
  ) : (
    <ul className={cn("mb-2", className)}>
      {list?.map(({ code, description }, index) => (
        <li key={index} className="flex">
          <p className="font-bold w-20 text-xs">{code ?? "--"}</p>
          <p className="font-normal text-xs">- {description ?? "--"}</p>
        </li>
      ))}
    </ul>
  );
};
