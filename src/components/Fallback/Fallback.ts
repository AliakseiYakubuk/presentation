import { View } from '../View';

class Fallback extends View {
  public isIE() {
    return (/MSIE/i).test(navigator.userAgent);
  }

  public renderIEView() {
    const container = document.getElementById('container');
    const elements = document.getElementsByClassName('view');

    for (const element of elements) {
      element.classList.add('fallback', 'ie_hidden');
    }

    if (container) {
      const node = document.createElement('div');
      node.classList.add('view', 'fallback', 'ie');
      node.innerHTML = 'Internet Explorer is not supported<br/> I am very sorry about that ;)';
      container.appendChild(node);
    }
  }
}

export default Fallback;
