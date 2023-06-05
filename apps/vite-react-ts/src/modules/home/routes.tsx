import { useState } from "react";
import { Button, cn } from "ui";
import { SparklesIcon } from "lucide-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { cva } from "class-variance-authority";

import * as Demo from "./components/demo";
import { ButtonTheme } from "~/providers/theme";

export const HomeRoute = () => {
  return (
    <div className={cn("h-full min-h-screen bg-background text-foreground")}>
      <header className="container mx-auto py-4 flex justify-between">
        <div className="flex gap-2 items-center">
          <SparklesIcon />
          <h1 className="font-bold">Syncer</h1>
        </div>
        <div className="flex gap-4 items-center">
          <ButtonTheme />
          <Button variant={"outline"} size="sm">
            Login
          </Button>
        </div>
      </header>
      <main className="container mx-auto flex flex-col">
        <h1 className="text-5xl font-bold">{t.title}</h1>
        <p className="text-2xl font-light text-muted-foreground mt-2">
          {t.description}
        </p>

        <div className="mt-4 mb-6">
          <Button variant={"secondary"} className="w-fit">
            {t.cta}
          </Button>
        </div>

        <DemoDashboard />
      </main>
    </div>
  );
};

const DemoDashboard = () => {
  const [demo, setDemo] = useState<"files" | "rooms">("files");
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="w-full border rounded-lg">
        <div className="flex justify-between w-full p-3">
          <div className="flex items-center gap-8">
            <Demo.TeamSwitcher />
            <div className="flex items-center gap-6">
              <button
                onClick={() => setDemo("files")}
                className={demoNav({ active: demo === "files" })}
              >
                {t["demo-nav"].files}
              </button>
              <button
                onClick={() => setDemo("rooms")}
                className={demoNav({ active: demo === "rooms" })}
              >
                {t["demo-nav"].rooms}
              </button>
            </div>
          </div>
          <Demo.UserNav />
        </div>
        <div className="p-3 h-[40em] flex">
          {demo === "files" && <Demo.Files />}
        </div>
      </div>
    </ErrorBoundary>
  );
};

const demoNav = cva(
  "text-sm font-medium transition-colors hover:text-primary",
  {
    variants: {
      active: {
        false: "text-muted-foreground",
      },
    },
    defaultVariants: {
      active: true,
    },
  }
);

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      role="alert"
      className="border-destructive bg-destructive/10 p-3 rounded-lg"
    >
      <p className="font-bold text-2xl text-destructive">
        Something went wrong:
      </p>
      <pre className="p-3 border-destructive border rounded py-2 my-4">
        {error.message}
      </pre>
      <Button variant={"destructive"} onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
};

const t = {
  title: "Syncing made easy.",
  description:
    "Syncer is a tool that allows you to sync your files across multiple devices.",
  cta: "Get Started",
  "demo-nav": {
    files: "Files",
    rooms: "Rooms",
  },
};
