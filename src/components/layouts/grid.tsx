import type { ReactNode } from "react";

const GridLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-4 w-full px-8 pt-8 pb-8`}
    >
      {children}
    </div>
  );
};

export default GridLayout;
