import { type ReactElement } from "react";

const SectionHeader = ({
  title,
  btnText,
  btnLink,
  className,
  children,
}: {
  title: string;
  btnText: string;
  btnLink: string;
  className?: string;
  children?: ReactElement;
}) => {
  return (
    <div className={`flex justify-between px-8` + className}>
      <p className="text-xl font-semibold mt-8">{title}</p>
      {children}
      <a
        href={btnLink}
        className={`${
          btnLink == "#" ? "!hidden" : "!flex"
        }text-md cursor-pointer font-semibold mt-8 text-gray-400`}
      >
        {btnText}
      </a>
    </div>
  );
};

export default SectionHeader;
