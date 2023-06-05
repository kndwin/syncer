import { useRef } from "react";
import {
  Layout,
  Model,
  TabNode,
  IJsonModel,
  Actions,
  IJsonTabNode,
} from "flexlayout-react";
import "./docker.css";
import { TiptapEditor } from "./editor";
import { create } from "zustand";
import { FileIcon } from "lucide-react";

var json: IJsonModel = {
  global: {
    enableEdgeDock: false,
    tabSetEnableMaximize: false,
    tabClassName:
      "flex text-muted-foreground gap-2 py-1 rounded bg-muted gap-2 text-sm my-1",
    splitterSize: 1,
    splitterExtra: 4,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [],
  },
};

const initialModel = Model.fromJson(json);

type UseDockStoreProps = {
  model: Model;
  layoutRef: React.MutableRefObject<Layout> | null;
  setLayoutRef: (layoutRef: React.MutableRefObject<Layout>) => void;
  addTab: (tab: IJsonTabNode) => void;
};

export const useDockStore = create<UseDockStoreProps>((set, get) => ({
  model: initialModel,
  layoutRef: null,
  setLayoutRef: (layoutRef) => set(() => ({ layoutRef })),
  addTab: (tab) => {
    const { layoutRef, model } = get();
    // @ts-expect-error: tabIds is not in the type definition
    if (layoutRef?.current.tabIds.find((id) => id === tab.id)) {
      model.doAction(Actions.selectTab(tab.id as string));
    } else {
      layoutRef?.current.addTabToActiveTabSet(tab);
    }
  },
}));

const factory = (node: TabNode) => {
  let component = node.getComponent();
  if (component === "file") {
    return (
      <div className="p-3 bg-background h-full text-foreground">
        <TiptapEditor key={node?.getId()} defaultValue={node?.getName()} />
      </div>
    );
  }
  return null;
};

export const Docker = () => {
  const layoutRef = useRef<Layout | null>(null);
  const setLayoutRef = useDockStore((state) => state.setLayoutRef);
  const model = useDockStore((state) => state.model);
  setLayoutRef(layoutRef as React.MutableRefObject<Layout>);

  return (
    <Layout
      ref={layoutRef}
      realtimeResize={true}
      model={model}
      factory={factory}
      onTabSetPlaceHolder={EmptyTabs}
    />
  );
};

const EmptyTabs = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="flex items-center justify-center p-2 rounded-full bg-secondary">
      <FileIcon />
    </div>
    <div className="text-foreground font-bold">No tabs open</div>
    <div className="text-muted-foreground text-sm">
      Open a file to get started
    </div>
  </div>
);
