import { Button } from "./ui/button";
import downloadSvg from "@/assets/download.svg";
import sdkSvg from "@/assets/sdk.svg";

interface FooterProps {
  themeColor?: string;
}

// make theme color brighter without adding opacity
function brightenHexToRgb(hexColor: string): string {
  // Remove the # if present
  hexColor = hexColor.replace("#", "");

  // Parse the hex color to RGB
  let r = parseInt(hexColor.substring(0, 2), 16);
  let g = parseInt(hexColor.substring(2, 4), 16);
  let b = parseInt(hexColor.substring(4, 6), 16);

  // Increase each component's brightness
  r = Math.round(r + (255 - r) * 0.75);
  g = Math.round(g + (255 - g) * 0.75);
  b = Math.round(b + (255 - b) * 0.75);

  // Return as RGB format
  return `rgb(${r}, ${g}, ${b})`;
}

export const Footer: React.FC<FooterProps> = ({ themeColor }) => {
  const backgroundColor = themeColor ? brightenHexToRgb(themeColor) : "#BFFFEF";
  return (
    <div
      className="flex justify-center fixed items-center bg-[#BFFFEF] bottom-0 w-full h-[30px]"
      style={{ backgroundColor }}
    >
      <a
        href="https://github.com/getvim/vim-canvas-demo-app"
        className="w-full"
        target="_blank"
      >
        <Button
          className="w-full flex justify-start space-x-2"
          variant={"link"}
        >
          <img src={downloadSvg} />
          <span className="text-xs">View code</span>
        </Button>
      </a>
      <a href="https://docs.getvim.com/" target="_blank" className="w-full">
        <Button
          className="w-full flex justify-start space-x-2"
          variant={"link"}
        >
          <img src={sdkSvg} />
          <span className="text-xs">SDK Documentation</span>
        </Button>
      </a>
    </div>
  );
};
