import {
	RichTextContent,
	ContentBlock,
	IContentType,
} from "@/lib/dynamicTypes";

import { CreateBasketResponse } from "@/lib/userTypes";

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
	basket: CreateBasketResponse | null;
	orderId: string | null;
	user: User;
}

export interface User {
	documentId: string;
	jwt: string;
	username: string;
	name?: string | null;
	email?: string | null;
	petition?: Petition;
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

export type Prices = {
	[type: string]: number;
};

export type IPrices = {
	data: Array<{
		documentId: string;
		type: string;
		price: number;
	}>;
};

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

export interface ContentGallery {
	__component: "content.gallery";
	id: number;
	images: Media[];
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
	place: Place;
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

export interface SectionGallery {
	id: number;
	heading: string;
	sub_heading: string;
	bg_colour: string;
	gallery: {
		id: number;
		heading?: string;
		description?: string;
		media: Media[];
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

export interface EventPage extends BaseDoc {
	sections: Section[];
	sidebar: Sidebar[];
	seo: SEO;
}

export interface Page extends BaseDoc, SEO {
	title: string;
	slug: string;
	banner?: Banner;
	sections: Section[];
	sidebar: SidebarComponent[];
	seo: SEO;
}

export type SidebarComponent =
	| PetitionStats
	| FormSection
	| HeadingComponent
	| NavigationComponent;

export interface HomePage extends BaseDoc {
	sections: Section[];
}

export type Section =
	| Banner
	| PlacesSection
	| TabsSection
	| FeaturedSection
	| FeaturedEventSection
	| VolunteerSection
	| LayoutTextSection
	| PersonSection
	| FormSection
	| LayoutCalendar
	| ContentGallery
	| InfoCardSection
	| Sidebar;

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

export interface PlacesSection {
	__component: "layout.places-section";
	id: number;
	heading: string;
	content: RichTextContent;
	bg_colour: string;
	places: { place: Place[] };
}

export interface PersonSection {
	__component: "layout.people-section";
	id: number;
	bg_colour: string;
	people: Person[];
}

export interface FeaturedSection {
	__component: "layout.featured";
	id: number;
	heading: string;
	content: RichTextContent;
	number_of_events: number;
	bg_colour: string;
}

export interface FeaturedEventSection {
	__component: "layout.featured-events-section";
	id: number;
	heading: string;
	content: RichTextContent;
	number_of_events: number;
	bg_colour: string;
}

export interface VolunteerSection {
	__component: "layout.volunteer-section";
	id: number;
	heading: string;
	text: string;
	slug: string;
	bg_colour: string;
	calendar_enabled: true;
	banner: ImageVersion[];
}

/* ---------- People & Organisations ---------- */
export interface Person {
	name: string;
	tel: string;
	role: string;
	email: string;
	image: Media;
	bio: LayoutTextSection;
	organisation: Organisation;
	place: Place;
}

export interface Organisation extends BaseDoc {
	name: string;
	slug: string;
	summary: string;
	external_website_url: string;
	logo: Media;
	people: Person[];
	manages_places: Place[];
	social_media?: {
		id: number;
		social: SocialMedia[];
	};
}

export interface SocialMedia {
	id: number;
	url: string;
	icon: string;
	handle: string;
	platform: string;
	is_active: boolean;
}

/* ---------- Places & Events ---------- */
export interface Place {
	id: number;
	name: string;
	summary: string;
	slug: string;
	calendar_enabled: true;
	image: Media;
	geo: Geo;
	address: Address;
	managing_organisation: Organisation;
	events: Event[];
	people: Person[];
}

export interface IEvent {
	data: Event[];
}
export interface Event extends BaseDoc {
	title: string;
	slug: string;
	locale?: string | null;
	summary: string;
	content: RichTextContent;
	start_date: string;
	end_date: string;
	price: number;
	image: Media;
	location: Place;
	people?: Person;
}

export interface Petition extends BaseDoc, PetitionMeta {
	title: string;
	slug: string;
	demand: RichTextContent;
	reason: RichTextContent;
	image: Media;
	signatures: Signature[];
	status: string;
}

export interface UploadPetition {
	title: string;
	slug?: string;
	demand: RichTextContent;
	reason: RichTextContent;
	image: number;
	end_date: string;
	targetCount: number;
	tags?: string[];
	createdByUser?: string;
	target: string;
	ward?: string;
	borough?: string;
}

export interface PetitionMeta {
	end_date: string;
	signaturesCount: number;
	targetCount: number;
	tags: string[];
	createdByUser: string;
	target: string;
	ward?: string;
	borough?: string;
}

// subHeading?: string;
// heading?: string;
// bgColour?: string;
// ctaLabel?: boolean;
// ctaLink?: boolean;
// totalSignatures: number;
// targetCount?: number;
// startDate?: string;
// endDate?: string;
// showProgressBar?: boolean;
// showTimeLeft?: boolean;
// showTargetCount?: boolean;

export interface Signature extends BaseDoc {
	first_name: string;
	last_name: string;
	comment: string;
	anonymize: boolean;
	user: User;
	petition: Petition;
}

export interface PetitionStats {
	__component: "content.petition-stats";
	subHeading?: string;
	heading?: string;
	bgColour?: string;
	ctaLabel?: boolean;
	ctaLink?: boolean;
	signaturesCount: number;
	targetCount?: number;
	startDate?: string;
	endDate?: string;
	showProgressBar?: boolean;
	showTimeLeft?: boolean;
	showTargetCount?: boolean;
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

export type NavigationComponent = {
	__component: "layout.navigation";
	id: number;
	navigation_menu: {
		id: number;
		documentId: string;
		title: string;
		type: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		navigation_items: MenuItem[];
	};
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
	label: string;
	slug: string;
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

export type CategoryApiResponse = {
	data: MenuItem[];
};

/* ---------- Misc ---------- */
export interface Geo {
	longitude: number;
	latitude: number;
	what3words: string;
}

export type Address = {
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	postcode: string;
	town: string;
	geo_locaiton: Geo;
};

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
	offset: string; // e.g., "5%" or "100%"
	color: string; // e.g., "#FFB74D"
	opacity: number; // Value between 0 and 1
}

export type Footer = {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	bg_colour: string;
	column_one: FooterComponent[];
	column_two: FooterComponent[];
	column_three: FooterComponent[];
	column_four: FooterComponent[];
	map: Geo;
	meta: Record<string, unknown>;
};

export type FooterComponent =
	| HeadingComponent
	| PlaceComponent
	| NavigationComponent
	| SocialMediaComponent;

export type HeadingComponent = {
	__component: "content.heading";
	id: number;
	heading: string;
};

export type PlaceComponent = {
	__component: "layout.place";
	id: number;
	heading: string;
	place: Place;
};

export type ContactComponent = {
	__component: "organisation.contact";

	id: number;
	heading: string;
	organisation: Organisation;
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

export type SocialMediaComponent = {
	__component: "layout.social-platforms";
	id: number;
	heading: string | null;
	organisation: Organisation;
};

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

/*Membership*/

export interface CreateMembership {
	first_name: string;
	last_name: string;
	email: string;
	postcode: string;
	mailing_list: boolean;
}

export type CreateMembershipResponseAction =
	| CreateMebershipeErrorResponse
	| Member;

export interface CreateMebershipeErrorResponse {
	error: {
		status: number;
		name: string;
		message: string;
		details: { field: string; code: string };
	};
}

export interface Member extends BaseDoc {
	first_name: string;
	last_name: string;
	email: string;
	mailing_list: boolean;
	postcode: string;
}

export interface CreatePetition {
	title: string;
	demand: string;
	ward: string;
	decision_maker: string;
	image: string;
	reason: string;
	user?: string;
}

//Signature

export interface CreateSignature {
	first_name: string;
	last_name: string;
	email: string;
	postcode: string;
	mailing_list: boolean;
	comment?: string;
	display_name?: boolean;
	user?: string;
	petition: {connect:{documentId: string}};
}

export type CreateResponseAction =
	| CreateErrorResponse
	| CreateSignature
	| CreatePetition
	| UploadPetition;

export interface CreateErrorResponse {
	error: {
		status: number;
		name: string;
		message: string;
		details: { field: string; code: string };
	};
}

//functions

export type FormStateParams = {
	human: string | null;
	count: number;
	setCount: React.Dispatch<React.SetStateAction<number>>;
	setHumanError: React.Dispatch<React.SetStateAction<boolean>>;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
	formRef: React.RefObject<HTMLFormElement | null>;
	r: string;
};

// Map

export interface ILeaflet {
	loadingstate: boolean;
	activestate: boolean;
	buttextstate: string;
	displaystate: string;
	height: string;
}

export interface IEvent extends BaseDoc {
	title: string;
	start_date: string;
	end_date: string;
	price: string;
	summary: string;
	content: RichTextContent;
	image: Media;
	location: Place;
	// cat_id: number;
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
