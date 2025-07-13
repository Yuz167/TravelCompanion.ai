import React, { Dispatch, SetStateAction } from "react";

const Itinerary = ({
  isSelected,
  isActive,
  title,
  setSelectedItinerary,
  index,
}: {
  isSelected?: boolean;
  isActive?: boolean;
  title: string;
  setSelectedItinerary: Dispatch<SetStateAction<number>>;
  index: number;
}) => {
  return (
    <div
      onClick={() => {
        localStorage.setItem('selectedItinerary', index.toString())
        return window.location.reload()
      }}
      className={`flex cursor-pointer items-center px-3 py-[6px] rounded-[3px] border ${
        isSelected ? "border-amber-500 bg-amber-300/30" : "border-amber-500/50"
      } flex-shrink-0`}
    >
      <span className="tracking-widest mr-2 text-sm text-black font-medium">
        {title}
      </span>
      {isActive && (
        <span className="px-2 py-[2px] bg-green-700/80 text-gray-300/80 text-[11px] rounded-[3px] font-semibold">
          ACTIVE
        </span>
      )}
    </div>
  );
};

export default Itinerary;
