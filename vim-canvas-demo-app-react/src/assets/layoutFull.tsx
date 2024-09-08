import { cn } from "@/lib/utils";

export const LayoutFull = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    className={cn(className)}
    width="16"
    height="12"
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.625 1.875C0.625 1.25368 1.12868 0.75 1.75 0.75H13.9375C14.5588 0.75 15.0625 1.25368 15.0625 1.875V10.625C15.0625 11.2463 14.5588 11.75 13.9375 11.75H1.75C1.12868 11.75 0.625 11.2463 0.625 10.625V1.875ZM1.75 1.75C1.68096 1.75 1.625 1.80596 1.625 1.875V10.625C1.625 10.694 1.68096 10.75 1.75 10.75H13.9375C14.0065 10.75 14.0625 10.694 14.0625 10.625V1.875C14.0625 1.80596 14.0065 1.75 13.9375 1.75H1.75Z"
      fill={fill ?? "#001C36"}
    />
  </svg>
);
