const SOCIAL_SHARE_LINKS = {
  twitter: (url: string, text: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url: string, title: string) =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  whatsapp: (url: string, text: string) =>
    `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  email: (subject: string, body: string) =>
    `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
};

export default function SocialShareLinks({
  url,
  title,
  text,
}: {
  url: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <a
        href={SOCIAL_SHARE_LINKS.twitter(url, text)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg"
      >
        Twitter
      </a>
      <a
        href={SOCIAL_SHARE_LINKS.facebook(url)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#4267B2] text-white px-4 py-2 rounded-lg"
      >
        Facebook
      </a>
      <a
        href={SOCIAL_SHARE_LINKS.whatsapp(url, text)}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white px-4 py-2 rounded-lg"
      >
        WhatsApp
      </a>
    </div>
  );
}
