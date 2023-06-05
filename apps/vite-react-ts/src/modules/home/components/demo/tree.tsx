import { useState, useEffect, useRef, useCallback } from "react";
import { Tree as RATree, NodeRendererProps, CursorProps } from "react-arborist";
import {
  FolderIcon,
  FileIcon,
  ChevronDownIcon,
  MoreHorizontalIcon,
  FilePlus2Icon,
  FolderPlusIcon,
} from "lucide-react";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "ui";
import { create } from "zustand";

const initialData: FileItem[] = [
  { id: "f1", name: "Unread", nodeType: "folder", children: [] },
  { id: "f2", name: "Threads", nodeType: "folder", children: [] },
  {
    id: "3",
    name: "Chat Rooms",
    nodeType: "folder",
    children: [
      { id: "c1", name: "General", nodeType: "md" },
      { id: "c2", name: "Random", nodeType: "md" },
      { id: "c3", name: "Open Source Projects", nodeType: "md" },
    ],
  },
  {
    id: "4",
    name: "Direct Messages",
    nodeType: "folder",
    children: [
      { id: "d1", name: "More Nested", nodeType: "md" },
      { id: "d2", name: "Bob", nodeType: "md" },
      { id: "d3", name: "Charlie", nodeType: "md" },
    ],
  },
];

export const Tree = () => {
  const files = useFileTreeStore((state) => state.files);
  const setSelectedFile = useFileTreeStore((state) => state.setSelectedFile);
  const searchTerm = useFileTreeStore((state) => state.searchTerm);
  const selectedFile = useFileTreeStore((state) => state.selectedFile);

  return (
    <Accordion type="multiple" defaultValue={["files"]}>
      <AccordionItem value="files" className="border-b-0">
        <div className="flex items-center w-full justify-between">
          <AccordionTrigger className="py-2 px-1 hover:no-underline gap-1 w-full">
            <p>Files</p>
          </AccordionTrigger>
          <div className="flex gap-2 mr-2 items-center">
            <Tooltip>
              <TooltipTrigger>
                <FilePlus2Icon className="w-5 h-5 p-1 rounded hover:bg-secondary" />
              </TooltipTrigger>
              <TooltipContent>{`Add File`}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <FolderPlusIcon className="w-5 h-5 p-1 rounded hover:bg-secondary" />
              </TooltipTrigger>
              <TooltipContent>{`Add Folder`}</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <AccordionContent>
          <RATree
            selection={selectedFile?.id}
            rowHeight={32}
            width={240}
            initialData={files}
            children={TreeNode}
            renderCursor={TreeCursor}
            searchTerm={searchTerm}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase()) &&
              node.isLeaf
            }
            onActivate={(node) => {
              setSelectedFile(node.data);
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

type UseFileTreeStoreProps = {
  files: FileItem[];
  addFile: (file: FileItem) => void;
  removeFile: (file: FileItem) => void;
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const useFileTreeStore = create<UseFileTreeStoreProps>((set) => ({
  files: initialData,
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  removeFile: (file) =>
    set((state) => ({ files: state.files.filter((f) => f !== file) })),
  selectedFile: null,
  setSelectedFile: (file) => set(() => ({ selectedFile: file })),
  searchTerm: "",
  setSearchTerm: (term) => set(() => ({ searchTerm: term })),
}));

export type FileItem = {
  id: string;
  name: string;
  children?: FileItem[];
  nodeType: "folder" | "md";
};

const TreeNode = ({ node, style, dragHandle }: NodeRendererProps<FileItem>) => {
  const { ref, hovered } = useHover();

  return (
    <div
      className={cn("flex items-center gap-1 text-sm")}
      style={style}
      ref={dragHandle}
    >
      <div
        className={cn(
          "hover:bg-muted px-2 py-1 rounded flex items-center gap-1 w-full",
          node.isSelected && "bg-muted",
          "[&>svg]:text-muted-foreground [&>svg]:w-4 [&>svg]:h-4"
        )}
        ref={ref}
        draggable
      >
        {node.isLeaf && <FileIcon />}
        {!node.isLeaf && (
          <>
            <button onClick={() => node.isInternal && node.toggle()}>
              <ChevronDownIcon
                className={cn(
                  node.isOpen ? "rotate-0" : "-rotate-90",
                  "text-muted-foreground w-4 h-4 transition-all"
                )}
              />
            </button>
            <FolderIcon />
          </>
        )}
        <div className="text-foreground flex-1 flex items-center gap-2">
          <p>{node.data.name}</p>
          {!node.isOpen && !node.isLeaf && (
            <p className="text-[10px] border bg-background rounded-full w-4 h-4 flex items-center justify-center">
              {node.data.children?.length}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontalIcon
              className={cn(
                "text-muted-foreground h-4 w-4 ml-auto",
                !hovered && "opacity-0"
              )}
            />
          </DropdownMenuTrigger>
          {node.data.nodeType === "folder" && <FolderDropdownContent />}
          {node.data.nodeType === "md" && <FileMdDropdownContent />}
        </DropdownMenu>
      </div>
    </div>
  );
};

const FileMdDropdownContent = () => {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  );
};
const FolderDropdownContent = () => {
  return (
    <DropdownMenuContent>
      <DropdownMenuItem>Add File</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  );
};

const TreeCursor = ({ top, left, indent }: CursorProps) => {
  return (
    <div
      className="absolute h-2 bg-muted"
      style={{
        top: top - 6,
        left: left + 4,
        transform: `translate(${indent}, -100%)`,
        width: `calc(100% - ${indent + 28}px)`,
      }}
    />
  );
};

export function useHover<T extends HTMLElement = HTMLDivElement>() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<T>(null);
  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("mouseenter", onMouseEnter);
      ref.current.addEventListener("mouseleave", onMouseLeave);

      return () => {
        ref.current?.removeEventListener("mouseenter", onMouseEnter);
        ref.current?.removeEventListener("mouseleave", onMouseLeave);
      };
    }

    return undefined;
  }, []);

  return { ref, hovered };
}
