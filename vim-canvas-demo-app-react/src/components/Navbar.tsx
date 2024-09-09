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
import { LayoutFull } from "@/assets/layoutFull";
import { LayoutLarge } from "@/assets/layoutLarge";
import { LayoutSmall } from "@/assets/layoutSmall";

export const Navbar = () => {
  const { setJsonMode } = useAppConfig();
  const vimOs = useVimOsContext();

  const [appSize, setAppSize] = useState<Hub.ApplicationSize>("CLASSIC");

  const handleAppSizeChange = (size: Hub.ApplicationSize) => {
    setAppSize(size);
    vimOs.hub.setDynamicAppSize(size);
  };

  const smallMode = appSize === "CLASSIC";

  return (
    <div className="px-2 pl-4 py-2 bg-accent flex justify-between items-center space-x-2">
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

        {!smallMode && (
          <>
            <Separator
              orientation={"vertical"}
              className="mx-1 min-h-[20px] bg-foreground"
            />
            <div className="flex items-center">
              <a
                href="https://github.com/getvim/vim-canvas-demo-app"
                target="_blank"
              >
                <Button
                  className="w-full p-1 h-fit flex justify-start hover:bg-green-100/60"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <img src={downloadSvg} />
                </Button>
              </a>
              <a href="https://docs.getvim.com/" target="_blank">
                <Button
                  className="w-full p-1 h-fit flex justify-start hover:bg-green-100/60"
                  variant={"ghost"}
                  size={"icon"}
                >
                  <img src={sdkSvg} />
                </Button>
              </a>
            </div>
          </>
        )}
        {smallMode && (
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
                    <span>View code</span>
                  </Button>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 w-full">
                <a
                  href="https://docs.getvim.com/"
                  target="_blank"
                  className="w-full"
                >
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
        )}
      </div>
    </div>
  );
};
