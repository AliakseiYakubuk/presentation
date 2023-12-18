import { Home } from './components/Home';
import { SecondaryView } from './components/SecondaryView';
import { Fallback } from './components/Fallback';
import './style.css';

const app = async () => {
  const home = await Home.init();
  const fallback = new Fallback();
  const skills = new SecondaryView({
    viewElementId: 'skills_view',
    backgroundElementId: 'skills_image',
    contentElementId: 'skills_list',
    backgroundActiveClass: 'skills_image_visible',
    contentActiveClass: 'skills_list_visible',
  });
  const about = new SecondaryView({
    viewElementId: 'about_view',
    backgroundElementId: 'about_image',
    contentElementId: 'about_content',
    backgroundActiveClass: 'about_image_visible',
    contentActiveClass: 'about_content_visible',
  });
  console.log('!!!!!!');
  if (fallback.isIE()) {
    console.log('isIE');
    fallback.renderIEView();
  } else {
    console.log('is not ie');
    home.listenClickCopyEmail('aliaksei.yakubuk@gmail.com');
    home.listenScreenResize();
    about.listenIntersection();
    skills.listenIntersection();
  }
};

app();
