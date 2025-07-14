import { SocialMediaComponent } from "@/lib/types";
import {
	TiSocialFacebook,
	TiSocialLinkedin,
	TiSocialInstagram,
} from "react-icons/ti";
import { RiTwitterXLine } from "react-icons/ri";

export default function CompanySocial({
	socialPlatforms,
	styles,
}: {
	socialPlatforms: SocialMediaComponent;
	styles: string;
}) {
	const iconMap: { [key: string]: any } = {
		facebook: TiSocialFacebook,
		linkedin: TiSocialLinkedin,
		instagram: TiSocialInstagram,
		x: RiTwitterXLine,
	};
	const {
		organisation: { social_media: social },
	} = socialPlatforms;
	return (
		<div className={styles}>
			{social &&
				social.social instanceof Array &&
				social.social.map((socialItem, i: number) => {
					const iconName = socialItem.platform.toLowerCase(); // Assuming 'name' holds the social platform name
					const IconComponent = iconMap[iconName] || TiSocialFacebook; // Default to Visa if icon is not found
					return (
						<a
							key={i}
							target="_blank"
							href={socialItem.url}
							rel="noopener noreferrer"
							className="text-white"
						>
							<IconComponent size={32} className="h-7 w-7 text-white" />
						</a>
					);
				})}
		</div>
	);
}
