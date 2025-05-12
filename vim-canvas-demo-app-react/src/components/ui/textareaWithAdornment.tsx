import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaWithAdornmentProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  prefixAdornment?: string;
  editMode?: boolean;
}

export const TextareaWithAdornment = React.forwardRef<
  HTMLTextAreaElement,
  TextareaWithAdornmentProps
>(({ className, prefixAdornment, editMode, value, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-col w-full rounded-md border border-input px-3 py-2 text-sm overflow-hidden",
          className,
          { "pb-8": editMode }
        )}
      >
        {prefixAdornment && (
          <div className="pb-2 mb-2 border-b border-input text-xs opacity-50 pointer-events-none inline-block whitespace-pre-wrap">
            {prefixAdornment}
          </div>
        )}
        <textarea
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              (
                ref as React.MutableRefObject<HTMLTextAreaElement | null>
              ).current = node;
            }
          }}
          className={cn(
            "bg-transparent border-none outline-none pl-[3px] resize-none w-full text-xs ring-offset-background placeholder:text-muted-foreground disabled:cursor-text placeholder:opacity-50 placeholder:font-semibold overflow-hidden cursor-text",
            className
          )}
          onInput={handleInput}
          value={value}
          {...props}
        />
      </div>
    </div>
  );
});

TextareaWithAdornment.displayName = "TextareaWithAdornment";
