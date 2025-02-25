import React, { ReactNode } from "react";
import vimLogo from "../assets/vim-logo.svg";
import settingsLogo from "../assets/cog.svg";

// SidebarItem Component
interface SidebarItemProps {
  children: ReactNode;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  isActive = false,
}) => {
  return (
    <div
      className={`w-16 h-16 flex items-center justify-center border-b border-gray-200 ${
        isActive ? "bg-[#0075A0] text-white" : ""
      }`}
    >
      {children}
    </div>
  );
};

// ListItem Component
interface ListItemProps {
  icon: ReactNode;
  appColor?: string;
}

const ListItem: React.FC<ListItemProps> = ({ icon, appColor }) => {
  return (
    <div className="bg-white rounded-md p-4 mb-4 flex items-center justify-between">
      <span style={{ color: appColor }} className="text-xl">
        {icon}
      </span>
      <span className="text-gray-400">▼</span>
    </div>
  );
};

interface VimConnectPreviewProps {
  appColor?: string;
}

export const VimConnectPreview: React.FC<VimConnectPreviewProps> = ({
  appColor,
}) => {
  return (
    <div className="relative w-80">
      <div className="border-2 border-gray-800 rounded-3xl overflow-hidden h-128 w-full relative bg-gray-100">
        <div className="absolute top-4 right-4 cursor-pointer">
          <span className="text-lg">×</span>
        </div>

        <div
          style={{ backgroundColor: appColor }}
          className="h-16 w-full"
        ></div>

        <div className="absolute top-16 left-0 bottom-0 w-16 bg-white border-r border-gray-200">
          <div className="flex flex-col items-center">
            <SidebarItem>
              <img src={vimLogo} className="w-[25px] h-[25px]" />
            </SidebarItem>

            <SidebarItem isActive={true}>
              <div>
                <div>DE</div>
                <div>MO</div>
              </div>
            </SidebarItem>

            <SidebarItem>
              <img src={settingsLogo} className="w-[25px] h-[25px]" />
            </SidebarItem>
          </div>
        </div>

        <div className="ml-16 mt-16 bg-gray-100 h-full p-4">
          <ListItem icon="👤" appColor={appColor} />
          <ListItem icon="👥" appColor={appColor} />
          <ListItem icon="📄" appColor={appColor} />
        </div>

        <div
          className="absolute bottom-0 left-16 right-0 h-12"
          style={{ backgroundColor: `${appColor}20` }}
        ></div>
      </div>
    </div>
  );
};
