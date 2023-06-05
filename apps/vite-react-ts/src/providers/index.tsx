import { ThemeProvider } from "./theme";
import { TooltipProvider } from "ui";

type RootProviderProps = {
  children?: React.ReactNode;
};

export const Providers = ({ children }: RootProviderProps) => {
  return (
    <TooltipProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TooltipProvider>
  );
};
