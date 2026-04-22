import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row, index) => {
    // CHECK 0: No row.children[n] violations. Using destructuring on [...row.children] is correct.
    const [linkCell, imageCell, altTextCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', (700 + index * 100).toString()); // Example delay increment

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      // CHECK 2: Interactivity - Check for target="_blank" from original HTML
      if (foundLink.target === '_blank') {
        cardLink.target = '_blank';
      }
    }
    moveInstrumentation(linkCell, cardLink); // Move instrumentation from link cell to the new anchor

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('img-fluid'); // Add img-fluid class from original HTML
      moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img
      cardImageDiv.append(optimizedPic);
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc');
    // CHECK 1.5: Richtext field "description" uses innerHTML, which is correct.
    descriptionP.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext content
    moveInstrumentation(descriptionCell, descriptionP); // Move instrumentation from description cell to the new p tag

    cardTextDiv.append(descriptionP);

    cardLink.append(cardImageDiv, cardTextDiv);
    col.append(cardLink);
    wrapper.append(col);
  });

  block.innerHTML = '';
  block.append(wrapper);
}
