import React from "react";

interface CustomCardProps {
  title: string;
  Icon: React.ReactNode;
  value: string | number;
  description: string;
}

function CustomCard({ title, Icon, value, description }: CustomCardProps) {
  return (
    <div className="flex-1 bg-white shadow border p-3 flex flex-col justify-between min-w-[350px]">
      <div className="flex items-start justify-between">
        <span className="text-md font-medium text-gray-800">{title}</span>
        {Icon}
      </div>
      <div className="mt-2 text-lg font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-400">{description}</div>
    </div>
  );
}

export default CustomCard;
