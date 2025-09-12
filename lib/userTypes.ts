interface BaseDoc {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}

export interface IParams {
	id: string;
	term: string;
	tech: string;
	subcat: string;
}

export type PriceType = "car" | "adult" | "child";

export type Prices = {
	[key in PriceType]?: number;
};

export type IPrices = {
	data: Array<{
		id: number;
		documentId: string;
		type: string;
		price: string;
	}>;
};

export interface PriceItem {
	id: number;
	documentId: string;
	type: PriceType;
	price: number;
}

export type PricesData = PriceItem[];

export type Props = {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

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

export type InlineNode = TextNode;

// Define the type for blocks that can contain children
export type ContentBlock =
	| ParagraphBlock
	| HeadingBlock
	| ListBlock
	| ImageBlock
	| ListItemNode; // Add ListItemNode if it should also have children

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

export interface PageResponse {
	data: {
		title: string;
		image: IImage;
		images?: IImage[];
		videos?: IVideoItem[];
		comments?: IComment[];
		contact?: Contact;
		address?: Address;
		social?: Social;
		geo?: Geo;
		directions?: Direction[];
		slug: string;
		content: IContentType; // Dynamic zones including images, videos, comments
	};
}

export interface AboutPageResponse {
	data: {
		title: string;
		image: IImage;
		images: DynamicImage[];
		videos?: IVideoItem[];
		comments?: IComment[];
		slug: string;
		content: IContentType; // Dynamic zones including images, videos, comments
	};
}

export interface PageSection {
	__component: "page-sections.page-section";
	id: number;
	section_heading: string;
	section_text: string;
	section_link: string;
}

export interface MediaSection {
	__component: "images.media";
	id: number;
	media: Media[];
}

export type Section = PageSection | MediaSection | Activities | Features;

export interface HomePageResponse {
	main_heading: string;
	main_text: string;
	section_season: Section[]; // Array of mixed components
	section_activities: Section[]; // Same concept can be applied here
	section_facilities: Section[]; // Array of mixed components
	slug: string;
}

interface ImagesComponent {
	__component: "images.media";
	id: number;
	// Define any other fields from the media component, e.g., url, alternativeText, etc.
	url: string;
	alternativeText: string;
}
export interface DynamicImage {
	id: string;
	image: Media;
}

export interface BookingResponse {
	data: Booking;
}

export interface Booking {
	documentId?: string; // Make id optional
	arrivalDate: string; // ISO date string
	departureDate: string; // ISO date string
	numberOfNights: number;
	numberOfAdults: number;
	numberOfChildren: number;
	numberOfTents: number;
	numberOfVehicles: number;
	note: string;
	status: string;
	title: string;
	price: string;
	user: { data: { documentId: string } };
}

export interface CreateBookingResponse {
	data: Booking; // Use Booking directly as attributes are no longer wrapped
	status: string;
}

export interface BookingAttributes extends BaseDoc {
	title: string;
	arrivalDate: string;
	departureDate: string;
	numberOfAdults: number;
	numberOfChildren: number;
	numberOfTents: number;
	numberOfVehicles: number;
	status: string;
	note: string;
	price: string;
}

export interface Customer {
	documentId?: string; // Make id optional
	username: string;
	email: string;
	mobile: string;
	password: string;
	role: number;
	bookings: string[];
	orders: string[];
}

export interface CreateAccount {
	webId: string;
	password: string;
	email: string;
}

export interface SubmitButtonProps {
	buttonText: string;
	pending?: boolean;
	bg: string | "";
	onClick?: (res: boolean) => void;
}

// Define the IButton type
export interface IButton {
	isActive: boolean;
	title: string;
	onShow?: () => void;
}

// Define the IPanel type
export interface IPanel {
	isActive: boolean;
	classes: string;
	children: React.ReactNode;
}

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

export type CreateAccountResponseAction = {
	data?: Customer | null;
	error?: {
		status: number;
		message: string;
		details?: {
			errors: {
				path: string[];
				message: string;
				name: string;
			}[];
		};
	};
};

export interface BasketData {
	data: {
		sessionId: string | null;
		user: string | null;
		documentId: string | null;
		basketState: BasketState;
		details: BasketDetails;
	};
}

export interface UpdateBasketData {
	data: {
		sessionId: string | null;
		user: string | null;
		details: {
			numberOfNights: number;
			numberOfAdults: number;
			numberOfChildren: number;
			numberOfVehicles: number;
			arrivalDate: string;
			departureDate: string;
			price: string;
			ipAddress?: string;
		};
		basketState: BasketState;
	};
}

export interface BasketDetails {
	price: string;
	ipAddress: string;
	arrivalDate: string;
	departureDate: string;
	numberOfAdults: number;
	numberOfChildren: number;
	numberOfNights: number;
	numberOfVehicles: number;
}

export type BasketState = "active" | "booking" | "paid" | "archived";

export interface BookingDetailsResponse {
	data: BookingDetails;
}
export interface BookingDetails extends BaseDoc {
	title: string;
	note: string;
	booking_price: string;
	start_date: string;
	end_date: string;
	number_of_adults: number;
	number_of_children: number;
	number_of_nights: number;
	number_of_tents: number;
	number_of_vehicles: number;
	// user: { data: { documentId: string } };
}

export interface CreateBasketResponse {
	data: {
		documentId: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		basketState: string;
		details: BasketDetails;
	};
	meta: {};
}

export interface ISeason {
	data: Season[];
}

export interface Season {
	title: string;
	start_date: string;
	end_date: string;
	id: string;
	documentId: string;
	campsite_capacity: CampsiteCapacity;
	pitch_capacity: PitchCapacity;
}

export interface IDay {
	data: Day[];
}

export interface Day {
	id?: number;
	documentId?: string;
	date: string;
	capacity: number;
	closed: boolean;
	day_status: DayStatus;
	number_of_bookings: number;
	pitch_capacity: PitchCapacity;
	campsite_capacity: CampsiteCapacity;
}

export interface CampsiteCapacity {
	id?: number;
	total_pitches: number;
	available_pitches: number;
	number_of_bookings?: number;
}

export type UpdatedDay = {
	day_status: DayStatus;
	number_of_bookings: number;
	campsite_capacity: CampsiteCapacity;
};

export interface PitchCapacity {
	id: number;
	adult_capacity_per_pitch: number;
	child_capacity_per_pitch: number;
	vehicle_capacity_per_pitch: number;
	title: string;
}

export interface DayStatus {
	id?: number;
	day_status: string;
	description?: string;
	icon?: string;
	color?: string;
}

export interface CalandarPickerProps {
	date: Date | undefined;
	setDate: (date: Date | undefined) => void;
	numberOfNights: number;
	arrivalDate: string | null;
	season: Season;
	days: Day[];
	validateNights: ValidateNights;
}

export interface ThemeColours {
	day_available: string;
	day_low: string;
	day_full: string;
	day_past: string;
	day_closed: string;
}
export interface IThemeColours {
	data: ThemeColours;
}
export type ValidateNights = (
	arrivalDate: string,
	numberOfNights: number,
) => boolean;

export interface IOrder {
	bookingId: string;
	userDocumentId: string;
	basketDocumentId: string;
	paymentDetails: IPaymentDetails;
}

export interface IPaymentDetails {
	paymentId: string;
	paymentProvider: string;
	totalAmount: string;
	bookingId: string;
	publishedAt?: string;
}

export interface IOrderResponse {
	documentId: string;
	id: number;
	payment_id: string;
	payment_provider: string;
	payment_status: string;
	total_amount: string;
	email_confirmation_status: string;
	user: Customer;
	booking: BookingDetails;
}

export interface IGAPITokens {
	data: {
		access_token: string;
		refresh_token: string;
		expiry_date: number;
	};
}

export interface IEmailOrderTable {
	booking: BookingDetails;
	customer: Customer;
	paymentId: string;
	address: Address;
	county: string;
	phone: string;
	postcode: string;
}

export interface ICampsiteInfo {
	contact_name: string;
	title: string;
	address: Address;
	email: string;
	facebook_id: string;
	what3words: string;
	longitude: string;
	latitude: string;
	county: string;
	phone: string;
	postcode: string;
	website: string;
	summary_seo: string;
	tagline_seo: string;
	key_words_seo: string;
	credit_cards: CreditCard[];
	image?: IImage;
	slug: string;
	priceRange?: string;
	twitterHandle?: string;
	category?: string;
	classification?: string;
}

export interface IApiResponse<T> {
	data: T;
}

export interface IEmailSettings {
	email_subject: string;
	email_sender_name: string;
	email_body: IParagraph[]; // Updated to handle arrays of paragraphs
	email_footer: IParagraph[]; // Same as email_body, allows multiple paragraphs
}

export interface IParagraph {
	type: "paragraph" | "heading" | "list"; // Expandable to support other block types
	children: ITextNode[]; // Array of text nodes for rich content
}

export interface ITextNode {
	text: string; // Actual text content
	bold?: boolean; // Optional: for bold text
	italic?: boolean; // Optional: for italicized text
	underline?: boolean; // Optional: for underlined text
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

export interface ICampsite {
	contact: Contact;
	address: Address;
	social: Social;
	credit_cards: CreditCard[];
	seo: SEO;
	geolocation: Geo;
	general: General;
	features: Features;
	directions: Direction;
}

export type CreditCard = {
	name: string;
	image: IImage;
};

export interface Geo {
	longitude: number;
	latitude: number;
	what3words: string;
}

export interface SEO {
	seo_description: string;
	seo_key_words: string;
	seo_priceRange?: string;
	seo_category?: string;
	seo_classification?: string;
}

export type Address = {
	address_line_1: string;
	address_line_2: string;
	address_line_3: string;
	postcode: string;
	county: string;
};

export interface Contact {
	name: string;
	phone: string;
	email: string;
}

export interface General {
	title: string;
	slug: string;
	website: string;
	tagline: string;
	image: IImage;
}

export interface Features {
	__component: "campsite-details.features";
	features: {
		title: string;
		description: string;
		icon: string;
		image: IImage;
	};
}

export interface Social {
	url: string;
	title: string;
	icon: string;
}

interface Meta {
	pagination: {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
}

export interface MixedSlideComponent {
	__component: string;
	id: number;
	title: string;
	link: string;
}

export interface ICarousel extends BaseDoc {
	title: string;
	description: string | null;
	autoplay: boolean | null;
	interval: number;
	slides: Slide[];
}

export interface ICarouselResponse {
	data: ICarousel;
	meta: Meta;
}

export interface Slide {
	__component: string;
	id: number;
	title: string;
	description: string;
	link: string;
	media: Media[];
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
	provider_metadata: any | null;
}

export interface Files extends BaseDoc {
	name: string;
	pathId: number;
	files: Media[];
}

export interface Formats {
	small: FormatDetails;
	thumbnail: FormatDetails;
	large: FormatDetails;
	medium: FormatDetails;
}

export interface FormatDetails {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: string | null;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface IActivities {
	data: Activities;
}

export interface Activities {
	__component: "page-sections.activities";
	title: string;
	details: string;
	image: IImage;
	link: string;
	walking_journey_time: number;
	driving_journey_time: number;
	distance_miles: number;
}

export type IVideo = IVideoItem[];

export interface ILazyloadVideoProps {
	videos: IVideoItem;
}

export interface IMediaItem {
	id: number;
	type: "images" | "videos" | "comments";
	caption?: string;
	alternativeText?: string;
	smallURL?: string;
	largeURL?: string;
	video_embed_code?: string;
	comment?: string;
	name?: string;
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
	provider_metadata: any;
}

export type MediaType = "image" | "video" | "comment";

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

export interface IMenu {
	data: {
		menu_item: Menu;
	};
}

export interface Menu {
	id: number;
	title: string;
	slug: string;
	target: string;
	active: boolean;
	order: number;
}

export interface Direction {
	id: number;
	details: string;
	name: string;
	images: Slide;
}

export interface GradientStop {
	offset: string; // e.g., "5%" or "100%"
	color: string; // e.g., "#FFB74D"
	opacity: number; // Value between 0 and 1
}

export interface SVG {
	className?: string; // Optional additional CSS classes
	viewBox?: string; // SVG viewBox attribute, default "0 0 1300 120"
	path: string; // Path "d" attribute, required
	gradientId: string; // ID for the gradient definition, default "customGradient"
	gradientColors: GradientStop[]; // Array of gradient stops, default provided
}

export interface ILeaflet {
	loadingstate: boolean;
	activestate: boolean;
	buttextstate: string;
	displaystate: string;
	height: string;
}
