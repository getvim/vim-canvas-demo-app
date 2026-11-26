export const Loading = ({ label = "Loading..." }: { label?: string }) => {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </span>
  );
};
