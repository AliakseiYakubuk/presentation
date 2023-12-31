import { Slide } from '../Slide';
import smallImage from '../../assets/skills-small.webp';
import largeImage from '../../assets/skills-large.webp';

class Skills extends Slide {
  private getBackgroundSource() {
    return this.isWidthLessThan(1440) ? smallImage : largeImage;
  }

  private loadImage() {
    const element = document.getElementById('skills_image') as HTMLImageElement;

    if (element) {
      const img = new Image();
      img.onload = () => element.classList.add('ready');
      img.src = this.getBackgroundSource();
    }
  }

  constructor() {
    super({
      viewElementId: 'skills_view',
      backgroundElementId: 'skills_image',
      contentElementId: 'skills_list',
      backgroundActiveClass: 'skills_image_visible',
      contentActiveClass: 'skills_list_visible',
    });

    this.loadImage();
  }
}

export default Skills;
