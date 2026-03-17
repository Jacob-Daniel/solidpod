import { RichTextContent } from "@/lib/dynamicTypes";

import { Icon } from "next/dist/lib/metadata/types/metadata-types";

export * from "./dynamicTypes";

export interface StrapiResponse<T> {
	data: T;
	meta?: any;
}

interface BaseDoc {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface Session {
	jwt: string;
	orderId: string | null;
	user: User;
}

export interface User extends BaseDoc {
	jwt: string;
	username: string;
	name?: string | null;
	email?: string | null;
}

export interface SessionUser {
	documentId: string;
	jwt: string;
	username: string;
	name?: string | null;
	email?: string | null;
}

/* ---------- Shared API Types ---------- */
export interface IApiResponse<T> {
	data: T;
}

export interface IParams {
	id: string;
	term: string;
	tech: string;
	subcat: string;
}

/* ---------- Media ---------- */
export interface FormatDetails {
	ext: string;
	url: string;
	webp?: string;
	hash: string;
	mime: string;
	name: string;
	path: string | null;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface Formats {
	small: FormatDetails;
	thumbnail: FormatDetails;
	large: FormatDetails;
	medium: FormatDetails;
}

export interface Media extends BaseDoc {
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: Formats;
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: Record<string, any> | null;
}

export interface Images {
	data: ImageEntity[];
}

export interface ImageEntity extends BaseDoc {
	name: string;
	alternativeText: string;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		small: {
			ext: string;
			url: string;
			hash: string;
			mime: string;
			name: string;
			path: string;
			size: number;
			width: number;
			height: number;
			sizeInBytes: number;
		};
	};
	hash: string;
	ext: string;
	mime: string;
	size: string;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: Record<string, any> | null;
}

export type IImage = {
	height: number;
	width: number;
	url: string;
	documentId?: string;
	[key: string]: any;
};

/* ---------- File Collections ---------- */
export interface Files extends BaseDoc {
	name: string;
	pathId: number;
	files: Media[];
}

/* ---------- UI & Component Props ---------- */
export type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

export interface SubmitButtonProps {
	buttonText: string;
	pending?: boolean;
	bg: string;
	onClick?: (res: boolean) => void;
}

export interface IButton {
	isActive: boolean;
	title: string;
	onShow?: () => void;
}

export interface IPanel {
	isActive: boolean;
	classes: string;
	children: React.ReactNode;
}

/* ---------- Validation ---------- */
export interface ValidationError {
	status: number;
	message: string;
	details?: {
		errors: {
			path: string[];
			message: string;
			name: string;
		}[];
	};
}

/* ---------- Layout & Visual Components ---------- */
export interface Banner {
	__component?: "layout.banner";
	id: number;
	heading: string;
	sub_heading: string;
	bg_colour?: string;
	text: string;
	slug?: string;
	image_versions: ImageVersion[];
}

export interface ImageVersion {
	id: number;
	version: "mobile" | "desktop";
	image: {
		url: string;
		width: number;
		height: number;
		formats: Formats;
	};
}

export interface LayoutTextSection {
	__component: "content.content";
	id: number;
	content: RichTextContent;
	anchor?: string;
}

export interface LayoutCalendar {
	__component: "layout.calendar";
	id: number;
	heading: string;
	bg_colour: string;
}

export interface LayoutSidebar {
	__component: "layout.sidebar";
	id: number;
	heading: string;
	RichTextContent: RichTextContent;
}

export interface Sidebar {
	__component: "layout.sidebar";
	id: number;
	heading: string;
	share: { message: string };
}

export interface TabsSection {
	__component: "layout.info-tab-section" | "layout.mixed-content-tab-section";
	id: number;
	bg_colour: string;
	icon_colour: string;
	heading?: string;
	tabs: TabItem[];
}

export type InfoCard = {
	id: number;
	heading: string;
	text: string;
	icon: string;
	slug: MenuItem;
};

export type InfoCardSection = {
	__component: "layout.info-card-section";
	id: number;
	info_card: InfoCard[];
};

export interface TabItem {
	id: number;
	heading: string;
	sub_heading?: string;
	text: string;
	icon: string;
}

export interface IconTabContent {
	icon: string;
	id: number;
	text: string;
}

export interface TabContent {
	id: number;
	type: "article" | "image" | "video";
	videos: Video[];
	images: Media[];
	article: RichTextContent;
}

export interface Video {
	id: number;
	title: string;
	video: {
		url: string;
		provider: "youtube" | "vimeo"; // Add more providers if needed
		privacyHash: string;
		providerUid: string;
	};
}

export interface SectionWelcome {
	id: number;
	bg_colour: string;
	welcome_options: WelcomeOptions[];
}

export type WelcomeOptions = {
	id: number;
	heading: string;
	sub_heading: string;
	icon: string;
	menu_category: MenuCategory;
};

/* ---------- Page & Section Types ---------- */

export interface Page extends BaseDoc, SEO {
	title: string;
	slug: string;
	banner: Banner;
	sections: Section[];
	sidebar: SidebarComponent[];
	seo: SEO;
}

export type SidebarComponent =
	| FormSection
	| HeadingComponent
	| LayoutSidebar
	| NavigationComponent;

export interface HomePage extends BaseDoc {
	sections: Section[];
}

export type Section =
	| Banner
	| TabsSection
	| FeaturedSection
	| LayoutTextSection
	| FormSection
	| InfoCardSection
	| ButtonSection
	| ContentHeading
	| Sidebar;

export interface ButtonSection extends Button {
	__component: "elements.button";
}

export interface ContentHeading {
	__component: "content.heading";
	id: number;
	heading: string;
}

export interface Button {
	id: string;
	target: string;
	label: string;
	icon: string;
	hash: string;
	ariaLabel: string;
	bg_colour: string;
}

export interface FormSection {
	__component: "form.form-section";
	id: number;
	heading: string;
	bg_colour: string;
	form_field: FormFields;
}

export interface FormFields {
	label: string;
	name: string;
	type:
		| "text"
		| "email"
		| "boolean"
		| "textarea"
		| "select"
		| "hidden"
		| "date"
		| "number"
		| "file"; // Assuming your enumeration values
	required: boolean;
	mailing_list: boolean;
	minLength?: number;
	maxLength?: number;
}

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectField {
	name: string;
	select_options: SelectOption[];
}

export interface FeaturedSection {
	__component: "layout.featured";
	id: number;
	heading: string;
	content: RichTextContent;
	number_of_events: number;
	bg_colour: string;
}

export interface SocialMedia {
	id: number;
	url: string;
	icon: string;
	handle: string;
	platform: string;
	is_active: boolean;
}

export interface Category extends BaseDoc {
	name: string;
	slug: string;
	description: string;
	banner: Banner;
	tags: Tags;
	parent: Category;
	icon: Icon;
	resources?: string[];
	image: IImage;
}

/* ---------- Metadata ---------- */

export interface Meta {
	pagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
}

export interface SEO {
	seoTitle: string;
	seoDescription: string;
	seo_key_words: string;
	seo_price_range?: string;
	seo_category?: string;
	seo_classification?: string;
}

export interface SharedSEO {
	metaTitle?: string;
	metaDescription?: string;
	metaImage?: {
		id: number;
		url: string;
		alternativeText?: string;
		caption?: string;
		width?: number;
		height?: number;
		mime?: string;
	};
	keywords?: string;
	structuredData?: Record<string, any>; // or a more specific JSON-LD object
	metaSocial?: {
		socialNetwork: "Facebook" | "Twitter" | "LinkedIn" | string;
		title?: string;
		description?: string;
		image?: {
			id: number;
			url: string;
		};
	}[];
	ogUrl: string;
	ogImage: IImage;
	ogDescription?: string;
	metaRobots?: string;
	canonicalURL?: string;
}

/* ---------- Navigation ---------- */

interface NavigationMenu extends BaseDoc {
	title: string;
	type: string;
	navigation_items: MenuItem[];
}

export type NavigationComponent = {
	__component: "layout.navigation";
	id: number;
	navigation_menu: NavigationMenu;
};

export interface IMenu {
	navigation_items: MenuItem;
}

export interface INavigationItems extends BaseDoc {
	title: string;
	type: string;
	navigation_items: MenuItem[];
}

export interface MenuItem {
	id: number;
	url: string;
	label: string;
	slug: string;
	server_slug: string;
	target: "_self" | "_blank";
	active: boolean;
	order: number;
	is_parent: boolean;
	parent: MenuItem | null;
	children: MenuItem[];
	fragment?: string;
	is_button: boolean;
}
export type SiteConfig = BaseDoc & {
	tagline: string;
	title: string;
	logo: IImage;
	petitionLimit: number;
	SEO: SharedSEO;
	social_media: SocialMedia[];
};

export type MenuCategory = BaseDoc & {
	description: string;
	slug: string;
	name: string;
};

export type Tags = BaseDoc & {
	slug: string;
	name: string;
};

export type CategoryApiResponse = {
	data: MenuItem[];
};

/* ---------- Misc ---------- */
export interface Geo {
	longitude: number;
	latitude: number;
	what3words: string;
}

export interface CertLogos {
	id: number;
	name: string;
	label: string;
	logo: Media;
}

export interface IThemeColours {
	day_available: string;
	day_low: string;
	day_full: string;
	day_past: string;
	day_closed: string;
}

export interface General {
	title: string;
	slug: string;
	website: string;
	tagline: string;
	image?: IImage;
}

export interface SVG {
	className?: string;
	viewBox?: string;
	path: string;
	gradientId?: string;
	gradientColors?: GradientStop[];
	preserveAspectRatio?: string;
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	strokeOpacity?: number;
}

export interface GradientStop {
	offset: string;
	color: string;
	opacity: number;
}

export interface Footer extends BaseDoc {
	id: number;
	bg_colour: string;
	column_one: FooterComponent[];
	column_two: FooterComponent[];
	column_three: FooterComponent[];
	column_four: FooterComponent[];
	map: Geo;
	meta: Record<string, unknown>;
}

export type FooterComponent = HeadingComponent | NavigationComponent;

export type HeadingComponent = {
	__component: "content.heading";
	id: number;
	heading: string;
};

export interface ImageFormat {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	size: number;
	width: number;
	height: number;
	sizeInBytes?: number;
}

export interface GradientStop {
	offset: string;
	color: string;
	opacity: number;
}

export interface Intro {
	description: string;
	name: string;
	image: IImage;
	icon: string;
}

export interface Share {
	classes: string;
	id: number;
	slug: string;
	title: string;
	cat: string;
	imagepath: string;
}

export type FileUploadResponse = Media;

export type CreateResponseAction = any;
