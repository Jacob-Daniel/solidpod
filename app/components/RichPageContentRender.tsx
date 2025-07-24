import React from "react";
import {
	ContentBlock,
	IImage,
	IContentType,
	RichTextContent,
	InlineNode,
	TextNode,
	LinkNode,
	ListItemNode,
} from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default function RichContentRenderer({
	blocks,
	className = "",
}: {
	blocks: RichTextContent;
	className?: string;
}) {
	if (!blocks || !Array.isArray(blocks)) {
		return <div>No content available</div>;
	}

	function isTextNode(node: InlineNode): node is TextNode {
		return node.type === "text";
	}

	function isLinkNode(node: InlineNode): node is LinkNode {
		return node.type === "link";
	}
	// const b = blocks[0]
	return (
		<>
			{blocks.map((block, index) => {
				switch (block.type) {
					case "paragraph": {
						return (
							<p className="mb-3 text-base" key={block.key || index}>
								{block.children.map((child: InlineNode, childIndex: number) => {
									if (isTextNode(child)) {
										// Render plain text
										return child.text;
									} else if (isLinkNode(child)) {
										// Check if child contains a nested structure for links
										const linkText = child.children?.[0]?.text || "Link";
										const href = child.url || "#"; // Default to '#' if no href is found
										return (
											<Link
												key={childIndex}
												href={href}
												rel="noopener noreferrer"
												className="text-orange-700 underline"
											>
												{linkText}
											</Link>
										);
									} else {
										return (
											<span key={childIndex} className="unsupported-node">
												Unsupported Inline Node
											</span>
										);
									}
								})}
							</p>
						);
					}

					case "heading": {
						return (
							<h2
								className="text-md font-sans font-bold md:text-lg first-letter:capitalize md:leading-8 xl:mb-3"
								key={block.key || index}
							>
								{block.children.map((child: TextNode, childIndex: number) =>
									child.type === "text" ? (
										child.text
									) : (
										<span key={childIndex}>Unsupported Inline Node</span>
									),
								)}
							</h2>
						);
					}

					case "image": {
						return (
							<figure key={block.key || index}>
								{block.url && (
									<Image
										src={block.url}
										alt={block.alternativeText || block.name}
										width={block.width}
										height={block.height}
									/>
								)}
								{block.caption && <figcaption>{block.caption}</figcaption>}
							</figure>
						);
					}

					case "list": {
						const ListTag = block.ordered ? "ol" : "ul";
						return (
							<ListTag
								className="list-disc ms-5 leading-6 mb-4"
								key={block.key || index}
							>
								{block.children.map((item: ListItemNode, itemIndex: number) => (
									<li key={item.key || itemIndex} className="text-base">
										{item.children.map((child, childIndex) =>
											child.type === "text" ? (
												child.text
											) : (
												<span key={childIndex}>Unsupported Inline Node</span>
											),
										)}
									</li>
								))}
							</ListTag>
						);
					}

					default:
						return (
							<div
								key={block.key || index}
								style={{ border: "1px solid red", padding: "10px" }}
							>
								<strong>Unknown Block:</strong>
								<pre>{JSON.stringify(block, null, 2)}</pre>
							</div>
						);
				}
			})}
		</>
	);
}
