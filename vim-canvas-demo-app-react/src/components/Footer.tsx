import { Button } from "./ui/button";
import downloadSvg from "@/assets/download.svg";
import sdkSvg from "@/assets/sdk.svg";

interface FooterProps {
  themeColor?: string;
}

export const Footer: React.FC<FooterProps> = ({ themeColor }) => {
  return (
    <div
      className="flex justify-center fixed items-center bg-[#BFFFEF] bottom-0 w-full h-[30px]"
      style={{ backgroundColor: `${themeColor}80` }}
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
