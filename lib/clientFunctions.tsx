"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useVisibility } from "@/lib/VisibilityContext";
import { useNavigationContext } from "@/lib/navigationContext"; // Adjust the path as needed
import {
	RichTextContent,
	ContentBlock,
	TextNode,
	ListBlock,
	ListItemNode,
	HeadingBlock,
	FormStateParams,
} from "@/lib/types";

export const validateInput = (
	type:
		| "mailing_list"
		| "last_name"
		| "email"
		| "first_name"
		| "postcode"
		| "display_name"
		| "comment",
	value: string,
): string | null => {
	const regex = /^[a-zA-Z]+$/;
	// const regexComment = /^[^<>]$/;
	const postcodeRegex = /^([A-Z]{1,2}[0-9]{1,2}[A-Z]?)\s?[0-9][A-Z]{2}$/i; // Case-insensitive
	switch (type) {
		case "postcode":
			return postcodeRegex.test(value) || value === ""
				? null
				: "Only UK postcode permitted";
		case "first_name":
		case "last_name":
			if (!value.length) {
				return "Field must not be empty";
			}
			if (value.length > 20) {
				return "Too many characters";
			}
			if (!regex.test(value)) {
				return "Only letters and spaces are allowed";
			}
			return null;
		case "email": // Validate email format
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
				? null
				: "incorrect format";
			// case "comment":
			// if (!regexComment.test(value)) {
			// 	return "No script tags are allowed";
			// }
			if (value.length > 300) {
				return "Maximum 300 characters";
			}
		default:
			return null;
	}
};

export function formatDate(
	date: Date | undefined | null,
	abbrMonth: boolean = false,
	abbrYear: boolean = false,
	incDay: boolean = false,
): string {
	if (!date) {
		return "Invalid Date";
	}

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const month = abbrMonth
		? monthNames[date.getMonth()].substring(0, 3)
		: monthNames[date.getMonth()];
	const day = incDay ? `${dayNames[date.getDay()]}${" "}` : "";

	const year = abbrYear
		? "'" + (date.getFullYear() % 100).toString().padStart(2, "0")
		: date.getFullYear().toString();

	return `${day}${date.getDate()} ${month} ${year}`;
}

export function useWindowListener(eventType: string, listener: any) {
	useEffect(() => {
		window.addEventListener(eventType, listener);
		return () => {
			window.removeEventListener(eventType, listener);
		};
	}, [eventType, listener]);
}

export function add(x: number, y: number) {
	return x + y;
}

export const useHandleDomClick = (id: string) => {
	const { setVisible, setString } = useVisibility();
	const { closeSubmenu } = useNavigationContext(); // For submenu logic if needed
	const ref = useRef<HTMLDivElement>(null);

	// Memoize the handleDomClick function
	const handleDomClick = useCallback(
		(event: MouseEvent) => {
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect();
				const isInDialog =
					rect.top <= event.clientY &&
					event.clientY <= rect.top + rect.height &&
					rect.left <= event.clientX &&
					event.clientX <= rect.left + rect.width;

				if (
					(event.target instanceof HTMLElement &&
						event.target.dataset.id === id &&
						!isInDialog) ||
					(event.target instanceof HTMLElement &&
						event.target.dataset.link === "link")
				) {
					setVisible(false); // Hide the modal
					setString(""); // Clear any relevant string or data
					closeSubmenu(); // Close the submenu if needed
				}
			}
		},
		[id, setVisible, setString, closeSubmenu], // Dependencies
	);

	// Effect to handle adding/removing event listener
	useEffect(() => {
		window.addEventListener("click", handleDomClick);
		return () => {
			window.removeEventListener("click", handleDomClick);
		};
	}, [handleDomClick]);

	return ref;
};

export function strReverse(str: string) {
	let leng = str.length;
	let word = "";
	for (leng; leng > 0; leng--) {
		word += str[leng - 1];
	}
	return word;
}

// Define the renderTextNode function
function renderTextNode(node: TextNode): string {
	return node.text; // Directly return the text from the node
}

// Update the renderContent function
// export function renderContent(content: ContentBlock): string {
// 	if (Array.isArray(content)) {
// 		return content
// 			.map((block) => {
// 				switch (block.type) {
// 					case "paragraph":
// 						return `<p class="mb-3 text-lg">${block.children
// 							.map(renderTextNode)
// 							.join("")}</p>`;
// 					case "heading":
// 						return `<h${(block as HeadingBlock).level}>${(
// 							block as HeadingBlock
// 						).children
// 							.map(renderTextNode)
// 							.join("")}</h${(block as HeadingBlock).level}>`;
// 					case "list":
// 						return `<ul>${(block as ListBlock).children
// 							.map(renderListItem)
// 							.join("")}</ul>`;
// 					case "list-item":
// 						return `<li>${(block as ListItemNode).children
// 							.map(renderTextNode)
// 							.join("")}</li>`;
// 					default:
// 						return "";
// 				}
// 			})
// 			.join("");
// 	} else {
// 		console.warn("Content is not an array or is undefined:", content);
// 		return "";
// 	}
// }

// Utility function to render list items
// function renderListItem(item: ListItemNode): string {
// 	return `<li>${item.children.map(renderTextNode).join("")}</li>`;
// }

// Function to render a content block
// export function renderBlock(block: ContentBlock): string {
// 	switch (block.type) {
// 		case "paragraph":
// 			return `<p>${block.children.map(renderInline).join("")}</p>`;
// 		case "heading":
// 			return `<h${block.level}>${block.children
// 				.map(renderInline)
// 				.join("")}</h${block.level}>`;
// 		case "list":
// 			const listType = block.ordered ? "ol" : "ul";
// 			return `<${listType}>${block.children
// 				.map(renderListItem)
// 				.join("")}</${listType}>`;
// 		default:
// 			return "";
// 	}
// }

// Function to render inline content (text nodes)
export function renderInline(node: TextNode): string {
	return node.text;
}

// Type guard function to check if desc is RichTextContent
export function isRichTextContent(
	desc: string | RichTextContent | ContentBlock,
): desc is RichTextContent {
	if (typeof desc === "object" && desc !== null) {
		if ("type" in desc) {
			if ((desc as RichTextContent).type === "doc") {
				return true;
			}
		}
	}

	return false;
}

export async function humanValidator({
	human,
	count,
	setCount,
	setHumanError,
	setMessage,
	formRef,
	r,
}: FormStateParams) {
	setCount(count + 1);

	if (count >= 3) {
		setMessage("Sorry too many failed attempts...");
		setHumanError(true);
		return false;
	}
	if (human !== r) {
		setMessage(
			`Incorrect Human field checker value. <b>${2 - count}</b> attempts remaining.`,
		);
		setHumanError(true);
		return false;
	} else {
		setHumanError(false);
		setMessage("");
		return true;
	}
}

export function toSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

interface TiptapTextNode {
	type?: string;
	text?: string;
}

interface TiptapBlockNode {
	type: string;
	children?: TiptapTextNode[];
}

export function convertTiptapToStrapi(doc: { content: any[] }): any[] {
	if (!doc || !Array.isArray(doc.content)) return [];

	return doc.content
		.map((block) => {
			// Build base block object
			const baseBlock: any = {
				type: block.type,
				children: (block.content || []).map((child: any) => ({
					type: child.type || "text",
					text: child.text || "",
				})),
			};

			// Add level if heading and attrs.level exists
			if (block.type === "heading" && block.attrs && block.attrs.level) {
				baseBlock.level = block.attrs.level;
			}

			return baseBlock;
		})
		.filter((block) => {
			if (block.type === "paragraph") {
				return block.children.some((child: any) => child.text.trim() !== "");
			}
			return true;
		});
}

export function useScrollSpy(ids: string[], offset = 100) {
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		const handler = () => {
			let closestId = "";
			let closestOffset = Infinity;

			ids.forEach((id) => {
				const el = document.getElementById(id);
				if (el) {
					const rect = el.getBoundingClientRect();
					const diff = Math.abs(rect.top - offset);
					if (rect.top - offset < 0 && diff < closestOffset) {
						closestOffset = diff;
						closestId = id;
					}
				}
			});
			setActiveId(closestId);
		};

		window.addEventListener("scroll", handler, { passive: true });
		handler(); // initial check
		return () => window.removeEventListener("scroll", handler);
	}, [ids, offset]);

	return activeId;
}
