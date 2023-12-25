import { Presentation } from '../Presentation';
import photo from '../../assets/about.webp';

class About extends Presentation {
  private loadImage() {
    const element = document.getElementById('about_image') as HTMLImageElement;
    const img = document.getElementById('photo') as HTMLImageElement;

    if (img && element) {
      img.onload = () => element.classList.add('ready');
      img.src = photo;
    }
  }

  constructor() {
    super({
      viewElementId: 'about_view',
      backgroundElementId: 'about_image',
      contentElementId: 'about_content',
      backgroundActiveClass: 'about_image_visible',
      contentActiveClass: 'about_content_visible',
    });

    this.loadImage();
  }
}

export default About;
