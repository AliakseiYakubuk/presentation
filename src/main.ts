import { Home } from './components/Home';
import { About } from './components/About';
import { Skills } from './components/Skills';
import './style.scss';

const app = async () => {
  const home = await Home.init();
  const skills = new Skills();
  const about = new About();

  home.listenClickCopyEmail('aliaksei.yakubuk@gmail.com');
  home.listenScreenResize();
  about.listenIntersection();
  skills.listenIntersection();
};

app();
