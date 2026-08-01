import { useLocation } from "@tanstack/react-router";
import { useModalStore } from "./documentation.store";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { Button } from "../shared/components/Button";

export const Documentation = () => {
  const visible = useModalStore((state) => state.visible);
  const setVisible = useModalStore((state) => state.setVisible);

  const location = useLocation();

  const [markdowns, setMarkdowns] = useState<string>();

  const fetchMarkdowns = async () => {
    const markdown = await fetch("/markdowns" + location.pathname + ".md").then(
      (res) => res.text(),
    );

    setMarkdowns(markdown);

    console.log(markdown);
  };

  useEffect(() => {
    fetchMarkdowns();
  }, [location.pathname]);

  if (!visible || location.pathname === "/") return "";

  return (
    <div className="bg-black text-white absolute w-full h-full z-10 top-0 left-0 opacity-90 p-8 flex flex-col">
      <div className="prose h-[80vh]">
        <Markdown>{markdowns}</Markdown>
      </div>
      <div className="flex-1">
        <Button onClick={() => setVisible(false)}>Close Documentation</Button>
      </div>
    </div>
  );
};
