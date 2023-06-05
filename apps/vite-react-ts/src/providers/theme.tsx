import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "ui";
import { SunIcon, MoonIcon, LaptopIcon } from "lucide-react";
import { useEffect } from "react";
import { atom, useAtom } from "jotai";

type ThemeProviderProps = {
  children?: React.ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme] = useAtom(themeAtom);
  useEffect(() => {
    switch (theme) {
      case "light":
        document.body.classList.remove("dark");
        break;
      case "dark":
        document.body.classList.add("dark");
        break;
      case "system":
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }
        break;
    }
  }, [theme]);
  return <>{children}</>;
};

type ThemeOption = "light" | "dark" | "system";
const themeAtom = atom<ThemeOption>("light");

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  return { theme, setTheme };
};

const themeOptions = {
  light: {
    icon: <SunIcon className="w-4 h-4" />,
    label: "Light",
  },
  dark: {
    icon: <MoonIcon className="w-4 h-4" />,
    label: "Dark",
  },
  system: {
    icon: <LaptopIcon className="w-4 h-4" />,
    label: "System",
  },
};

export const ButtonTheme = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{themeOptions[theme].icon}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex gap-2"
        >
          {themeOptions.light.icon}
          {themeOptions.light.label}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex gap-2"
        >
          <MoonIcon className="w-4 h-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex gap-2"
        >
          <LaptopIcon className="w-4 h-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
