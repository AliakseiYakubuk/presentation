import { Presentation } from '../Presentation';

class About extends Presentation {
  constructor() {
    super({
      viewElementId: 'about_view',
      backgroundElementId: 'about_image',
      contentElementId: 'about_content',
      backgroundActiveClass: 'about_image_visible',
      contentActiveClass: 'about_content_visible',
    });
  }
}

export default About;
