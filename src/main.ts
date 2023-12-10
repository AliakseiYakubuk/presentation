// import { About } from './components/About';
import { Home } from './components/Home';
import { SecondaryView } from './components/SecondaryView';
import './style.css';

const home = await Home.init();

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

about.listenIntersection();
skills.listenIntersection();

await home.draw();

// (Skills.init().then((view) => view.draw()));
// (About.init().then((view) => view.draw()));
