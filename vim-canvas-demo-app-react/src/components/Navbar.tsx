import layoutFullSvg from "@/assets/layout-full.svg";
import layoutNoramlSvg from "@/assets/layout-normal.svg";
import layoutSmallSvg from "@/assets/layout-sm.svg";
import downloadSvg from "@/assets/download.svg";
import sdkSvg from "@/assets/sdk.svg";
import { useVimOsContext } from "@/hooks/useVimOsContext";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useAppConfig } from "../hooks/useAppConfig";
import { useState } from "react";
import { Hub } from "vim-os-js-browser/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const Navbar = () => {
  const { setJsonMode } = useAppConfig();
  const vimOs = useVimOsContext();

  const [appSize, setAppSize] = useState<Hub.ApplicationSize>("CLASSIC");

  const handleAppSizeChange = (size: Hub.ApplicationSize) => {
    setAppSize(size);
    vimOs.hub.setDynamicAppSize(size);
  };

  return (
    <div className="px-2 pl-4 py-2 bg-accent flex justify-between items-center space-x-2">
      <div>
        <h2 className="text-sm">Vim Canvas</h2>
        <h2 className="text-sm font-bold">Demo</h2>
      </div>
      <div className="flex items-center h-full">
        <div className="flex items-center space-x-1">
          <Label className="text-xs" htmlFor="json-mode">
            JSON
          </Label>
          <Switch id="json-mode" onCheckedChange={setJsonMode} />
        </div>
        <Separator
          orientation={"vertical"}
          className="mx-1 min-h-[20px] bg-foreground"
        />
        <Button
          size="sm"
          variant="ghost"
          className="p-1 h-fit hover:bg-green-100/60 group"
          onClick={() => handleAppSizeChange("EXTRA_LARGE")}
        >
          <img
            src={layoutFullSvg}
            alt="Layout full"
            className={cn("group-hover:mix-blend-normal", {
              "mix-blend-color": appSize !== "EXTRA_LARGE",
            })}
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1 h-fit hover:bg-green-100/60 group"
          onClick={() => handleAppSizeChange("LARGE")}
        >
          <img
            src={layoutNoramlSvg}
            alt="Layout normal"
            className={cn("group-hover:mix-blend-normal", {
              "mix-blend-color": appSize !== "LARGE",
            })}
          />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="p-1 h-fit hover:bg-green-100/60 group"
          onClick={() => handleAppSizeChange("CLASSIC")}
        >
          <img
            src={layoutSmallSvg}
            alt="Layout small"
            className={cn("group-hover:mix-blend-normal", {
              "mix-blend-color": appSize !== "CLASSIC",
            })}
          />
        </Button>

        <Separator
          orientation={"vertical"}
          className="mx-1 min-h-[20px] bg-foreground"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="p-1 h-fit hover:bg-green-100/60"
            >
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem className="p-0 w-full">
              <a
                href="https://github.com/getvim/vim-canvas-demo-app"
                className="w-full"
                target="_blank"
              >
                <Button
                  className="w-full flex justify-start space-x-2 hover:bg-[rgb(242,255,253)]"
                  variant={"link"}
                >
                  <img src={downloadSvg} />
                  <span>Download code</span>
                </Button>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 w-full">
              <a href="https://docs.getvim.com/" target="_blank" className="w-full">
                <Button
                  className="w-full flex justify-start space-x-2 hover:bg-[rgb(242,255,253)]"
                  variant={"link"}
                >
                  <img src={sdkSvg} />
                  <span>SDK Documentation</span>
                </Button>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
