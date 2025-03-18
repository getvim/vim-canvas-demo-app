import { useVimOsContext } from "@/hooks/useVimOsContext";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
// import { Separator } from "./ui/separator";
import { useCallback, useState } from "react";
import { Hub } from "vim-os-js-browser/types";
import { cn } from "@/lib/utils";
import { LayoutFull } from "@/assets/layoutFull";
import { LayoutLarge } from "@/assets/layoutLarge";
import { LayoutSmall } from "@/assets/layoutSmall";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import scribeLogo from "@/assets/ScribeAI_SS1H.png"

export const Navbar = () => {
  const vimOs = useVimOsContext();

  const [appSize, setAppSize] = useState<Hub.ApplicationSize>("CLASSIC");

  const handleAppSizeChange = (size: Hub.ApplicationSize) => {
    setAppSize(size);
    vimOs.hub.setDynamicAppSize(size);
  };

  const handleAppClose = useCallback(() => {
    vimOs.hub.closeApp();
  }, [vimOs.hub]);

  const smallMode = appSize === "CLASSIC";

  return (
    <div className="px-2 pl-4 py-2 bg-scribe-blue flex justify-between items-center space-x-2">
      <div>
        {/* <h2 className="text-sm text-scribe-white">ScribeAI</h2> */}
        <img src={scribeLogo} alt="ScribeAI Logo" className="w-36"/>
      </div>
      <div
        className={cn("flex items-center h-full", {
          "space-x-1": smallMode,
        })}
      >
        <div className="flex items-center">
          <Button
            size="lg"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("EXTRA_LARGE")}
          >
            <LayoutFull
              fill={appSize !== "EXTRA_LARGE" ? "#000000" : "#04E38E"}
              className="w-6 h-6 group-hover:mix-blend-normal"
            />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("LARGE")}
          >
            <LayoutLarge
              fill={appSize !== "LARGE" ? "#000000" : "#04E38E"}
              className="w-6 h-6 group-hover:mix-blend-normal"
            />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("CLASSIC")}
          >
            <LayoutSmall
              fill={appSize !== "CLASSIC" ? "#000000" : "#04E38E"}
              className="w-6 h-6 group-hover:mix-blend-normal"
            />
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
              size="lg"
              variant="ghost"
              className="p-1 h-fit hover:bg-green-100/60"
              >
                <Cross2Icon className="w-6 h-6" onClick={handleAppClose}/>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground">
              <p>Close app</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};