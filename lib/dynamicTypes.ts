// Define the rich text content structure
export interface TextNode {
	type: "text";
	text: string;
}

export interface ParagraphBlock {
	type: "paragraph";
	children: (TextNode | InlineNode)[];
	key?: string; // Optional key property
}

export interface HeadingBlock {
	type: "heading";
	level: 1 | 2 | 3 | 4 | 5 | 6;
	children: (TextNode | InlineNode)[];
	key?: string; // Optional key property
}

export interface ListBlock {
	type: "list";
	ordered: boolean;
	children: ListItemNode[];
	key?: string; // Optional key property
}

export interface ListItemNode {
	type: "list-item";
	children: (TextNode | InlineNode)[];
	key?: string; // Optional key property
}

export interface ImageBlock {
	type: "image";
	src: string; // URL of the image
	alt: string; // Alternative text for accessibility
	caption?: string; // Optional caption for the image
	title?: string; // Optional title for the image
	width?: number; // Optional width of the image
	height?: number; // Optional height of the image
	key?: string; // Optional key property for React rendering
	url: string;
	name: string;
	alternativeText: string;
}

export type InlineNode = TextNode | LinkNode;

// Define the type for blocks that can contain children
export type ContentBlock =
	| ParagraphBlock
	| HeadingBlock
	| ListBlock
	| ImageBlock
	| ListItemNode
	| TextSectionComponent; // Add the new component type

export interface RichTextContent {
	type: "doc";
	blocks: ContentBlock[];
}

interface IContentBlock {
	id: number;
	type: string;
	content: any; // Specify this according to your content structure
}

export interface IDynamicZones {
	images: IImage[];
	videos: IVideoItem[];
	comments: IComment[];
}

export interface IContentType {
	title: string;
	blocks: IContentBlock[];
	dynamicZones?: IDynamicZones;
}

export interface IComment {
	// __component: 'comments.comments';
	id: number;
	name: string;
	comment: string;
}

export interface IVideoItem {
	// __component: 'videos.videos';
	id: number;
	name: string;
	video_embed_code: string;
}

export type IImage = {
	id: number;
	name: string;
	url: string;
	height: number;
	width: number;
	caption?: string;
	alternativeText?: string;
};

export interface LinkNode {
	type: "link";
	url: string;
	children: TextNode[];
}

export interface TextSectionComponent {
	__component: "content.ck-editor";
	id: number;
	content: Array<ParagraphBlock | HeadingBlock | ListBlock | ImageBlock>; // Include other node types as needed
}
