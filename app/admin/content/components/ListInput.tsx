"use client";

import { useEffect, useState } from "react";
import { parseList } from "../utils";

export default function ListInput({
  value,
  placeholder,
  onCommit,
}: {
  value?: string[];
  placeholder: string;
  onCommit: (next: string[]) => void;
}) {
  const [text, setText] = useState("");

  useEffect(() => {
    setText((value ?? []).join(", "));
  }, [value]);

  return (
    <input
      className="w-full rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-primary)] px-4 py-2 text-sm"
      placeholder={placeholder}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => onCommit(parseList(text))}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onCommit(parseList(text));
        }
      }}
    />
  );
}
