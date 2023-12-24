import { Presentation } from '../Presentation';

class Skills extends Presentation {
  constructor() {
    super({
      viewElementId: 'skills_view',
      backgroundElementId: 'skills_image',
      contentElementId: 'skills_list',
      backgroundActiveClass: 'skills_image_visible',
      contentActiveClass: 'skills_list_visible',
    });
  }
}

export default Skills;
