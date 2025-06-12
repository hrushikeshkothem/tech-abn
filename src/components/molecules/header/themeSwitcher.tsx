import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/utils/themeProvider";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div
      className="mx-2 w-[24px] h-[24px] p-0 cursor-pointer lg:rounded-full bg-transparent"
      onClick={() => {
        setTheme(theme == "dark" ? "light" : "dark");
      }}
    >
      {theme == "dark" ? <SunIcon size={24} /> : <MoonIcon size={22} />}
    </div>
  );
};

export default ThemeSwitcher;
