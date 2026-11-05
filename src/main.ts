import { Home } from "./components/Home";

const app = async () => {
	const home = await Home.init();

	home.listenClickCopyEmail(import.meta.env.VITE_EMAIL);

	home.listenScreenResize();

	home.listenScroll();

	home.animateBackground();
};

app();
