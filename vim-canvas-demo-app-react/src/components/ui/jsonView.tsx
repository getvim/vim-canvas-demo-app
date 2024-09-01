import UIWJsonView from "@uiw/react-json-view";

export const JSONView = (props: React.ComponentProps<typeof UIWJsonView>) => {
  return (
    <UIWJsonView
      className="overflow-auto"
      highlightUpdates
      shortenTextAfterLength={10}
      {...props}
    />
  );
};
