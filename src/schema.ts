const url = `https://${process.env.VITE_APP_MAIN_DOMAIN}/`;

const parseJSON = (input: unknown) => {
	try {
		return JSON.parse(input as string);
	} catch {
		return;
	}
};

export const schema = JSON.stringify({
	"@context": "https://schema.org",
	"@type": "ProfilePage",
	"@id": `${url}#profilepage`,
	url: url,
	name: `${process.env.VITE_NAME} — Profile`,
	description: `Professional profile of ${process.env.VITE_NAME}, a software engineer specializing in web development`,
	mainEntity: {
		"@type": "Person",
		"@id": url,
		name: process.env.VITE_NAME,
		url: url,
		jobTitle: process.env.VITE_JOB,
		description: process.env.VITE_DESCRIPTION,
		email: `mailto:${process.env.VITE_EMAIL}`,
		sameAs: parseJSON(process.env.VITE_PROFILE_LINKS),
		knowsAbout: parseJSON(process.env.VITE_SKILLS),
	},
	speakable: {
		"@type": "SpeakableSpecification",
		cssSelector: [".speakable"],
	},
});
