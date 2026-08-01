import { useLocation } from "@tanstack/react-router";
import { useModalStore } from "./documentation.store";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { Button } from "../shared/components/Button";

export const Documentation = () => {
  const visible = useModalStore((state) => state.visible);
  const setVisible = useModalStore((state) => state.setVisible);

  const location = useLocation();

  const [markdown, setMarkdown] = useState<string>();

  const fetchMarkdowns = async () => {
    const newMarkdown = await fetch(
      "/markdowns" + location.pathname + ".md",
    ).then((res) => res.text());

    setMarkdown(newMarkdown);
  };

  useEffect(() => {
    fetchMarkdowns();
  }, [location.pathname]);

  if (!visible || location.pathname === "/") return "";

  // regex to match first sub heading
  const index = markdown?.search(/^## /m);

  const markdowns =
    index !== -1
      ? [markdown?.slice(0, index).trim(), markdown?.slice(index).trim()]
      : [markdown];

  let title = "";
  let content = "";

  if (markdowns?.length === 2) {
    title = markdowns[0] ?? "";
    content = markdowns[1] ?? "";
  }

  return (
    <div className="bg-black text-white absolute w-full h-full z-10 top-0 left-0 opacity-90 p-8 flex flex-col">
      <div className="prose mb-4">
        <Markdown>{title}</Markdown>
      </div>
      <div className="prose w-full max-w-none h-[80vh] columns-2 [column-fill:auto]">
        <Markdown>{content}</Markdown>
      </div>
      <div className="mt-auto">
        <Button onClick={() => setVisible(false)}>Close Documentation</Button>
      </div>
    </div>
  );
};
