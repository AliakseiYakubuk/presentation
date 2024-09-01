import { Home } from './components/Home';

const app = async () => {
  const home = await Home.init();

  home.defineHeightVariable();
  home.listenClickCopyEmail('aliaksei.yakubuk@gmail.com');
  home.listenScreenResize();
};

app();
