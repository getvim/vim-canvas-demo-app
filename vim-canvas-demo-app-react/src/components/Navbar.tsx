import { useVimOsContext } from "@/hooks/useVimOsContext";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useAppConfig } from "../hooks/useAppConfig";
import { useCallback, useState } from "react";
import { Hub } from "vim-os-js-browser/types";
import { cn } from "@/lib/utils";
import { LayoutFull } from "@/assets/layoutFull";
import { LayoutLarge } from "@/assets/layoutLarge";
import { LayoutSmall } from "@/assets/layoutSmall";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface NavBarProps {
  themeColor?: string;
}

export const Navbar: React.FC<NavBarProps> = ({ themeColor }) => {
  const { setJsonMode } = useAppConfig();
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
    <div
      className="px-2 pl-4 py-2 bg-accent flex justify-between items-center space-x-2"
      style={{ backgroundColor: themeColor }}
    >
      <div>
        <h2 className="text-sm">Vim Canvas</h2>
        <h2 className="text-sm font-bold">Demo</h2>
      </div>
      <div
        className={cn("flex items-center h-full", {
          "space-x-1": smallMode,
        })}
      >
        <div className="flex items-center space-x-1">
          <Label className="text-xs" htmlFor="json-mode">
            JSON
          </Label>
          <Switch id="json-mode" onCheckedChange={setJsonMode} />
        </div>
        {!smallMode && (
          <Separator
            orientation={"vertical"}
            className="mx-1 min-h-[20px] bg-foreground"
          />
        )}
        <div className="flex items-center">
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("EXTRA_LARGE")}
          >
            <LayoutFull
              fill={appSize !== "EXTRA_LARGE" ? "#099484" : undefined}
              className="group-hover:mix-blend-normal"
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("LARGE")}
          >
            <LayoutLarge
              fill={appSize !== "LARGE" ? "#099484" : undefined}
              className="group-hover:mix-blend-normal"
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="p-1 h-fit hover:bg-green-100/60 group"
            onClick={() => handleAppSizeChange("CLASSIC")}
          >
            <LayoutSmall
              fill={appSize !== "CLASSIC" ? "#099484" : undefined}
              className="group-hover:mix-blend-normal"
            />
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-fit hover:bg-green-100/60"
              >
                <Cross2Icon onClick={handleAppClose} />
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
