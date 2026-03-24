"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "swift" }: CodeBlockProps) {
  return (
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{
        margin: 0,
        borderRadius: "0.6rem",
        border: "1px solid #1f2937",
        background: "#0b1220",
        fontSize: "13px",
        lineHeight: 1.7,
        padding: "1rem",
      }}
      showLineNumbers
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  );
}
