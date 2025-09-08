import { useState } from "react";

const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-800"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
};

export default CopyLinkButton;
