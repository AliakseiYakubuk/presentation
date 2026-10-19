import { Home } from "./components/Home";

const app = async () => {
	const home = await Home.init();

	home.listenClickCopyEmail("aliaksei.yakubuk@gmail.com");

	home.listenScreenResize();

	home.listenScroll();

	home.animateBackground();
};

app();
