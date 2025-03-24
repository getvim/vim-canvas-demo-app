import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaWithAdornmentProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  prefixAdornment?: string;
}

export const TextareaWithAdornment = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithAdornmentProps
>(({ className, prefixAdornment, value, ...props }) => {
  return (
    <div className="relative">
      <div className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background bg-secondary overflow-hidden flex-wrap">
        {prefixAdornment && (
          <div className="text-sm opacity-80 pointer-events-none inline-block whitespace-pre-wrap">
            {prefixAdornment}
          </div>
        )}
        <textarea
          className={cn(
            "flex-1 bg-transparent border-none outline-none pl-[3px] resize-none min-w-[25px] \
          flex w-full rounded-md border-0 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 \
          min-h-full",
            className
          )}
          {...props}
        />
      </div>
    </div>
  );
});

TextareaWithAdornment.displayName = "TextareaWithAdornment";
