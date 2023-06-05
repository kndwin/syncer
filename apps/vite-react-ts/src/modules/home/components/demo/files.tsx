import { useEffect } from "react";
import { Input } from "ui";
import { Tree, useFileTreeStore } from "./tree";
import { Docker, useDockStore } from "./docker";

export const Files = () => {
  const selectedFile = useFileTreeStore((state) => state.selectedFile);
  const searchTerm = useFileTreeStore((state) => state.searchTerm);
  const setSearchTerm = useFileTreeStore((state) => state.setSearchTerm);

  const isFile = selectedFile?.id && !selectedFile?.children;

  const addTab = useDockStore((state) => state.addTab);

  useEffect(() => {
    isFile && addTab({ ...selectedFile, component: "file" });
  }, [selectedFile]);

  return (
    <div className="flex flex-1 gap-4">
      <div className="flex flex-col gap-4 w-60 relative">
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-xs"
        />
        <Tree />
      </div>
      <div className="flex-1 flex flex-col gap-2 relative border rounded-lg p-3 overflow-hidden">
        <Docker />
      </div>
    </div>
  );
};
