import React from 'react';

interface SidebarButton {
  icon: React.ReactNode;
  onClick: () => void;
  title: string;
}

interface SidebarProps {
  buttons: SidebarButton[];
}

export const Sidebar: React.FC<SidebarProps> = ({ buttons }) => {
  return (
    <div className="w-16 flex flex-col items-center space-y-4 sticky top-0 h-screen pt-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          onClick={button.onClick}
          title={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};