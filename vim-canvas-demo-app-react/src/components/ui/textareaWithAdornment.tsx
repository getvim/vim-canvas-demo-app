import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaWithAdornmentProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  prefixAdornment?: string;
}

const TextareaWithAdornment = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithAdornmentProps
>(({ className, prefixAdornment, value, ...props }) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-secondary",
          "overflow-hidden"
        )}
      >
        {prefixAdornment && (
          <div className="text-sm opacity-80 pointer-events-none inline-block whitespace-pre-wrap">
            {prefixAdornment}
          </div>
        )}
        <textarea
          className={cn(
            "flex-1 bg-transparent border-none outline-none p-0 resize-none \
          flex w-full rounded-md border border-input py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          // ref={mergedRef}
          style={{
            minHeight: "100%",
            width: "100%",
          }}
          {...props}
        />
      </div>
    </div>
  );
});

TextareaWithAdornment.displayName = "TextareaWithAdornment";

export { TextareaWithAdornment };
