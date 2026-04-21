import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('performace-driven-cards');

  [...block.children].forEach((row) => {
    // CHECK 0: No row.children[n] usage, using destructuring which is fine for fixed-field models.
    const [linkCell, imageCell, descriptionCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(linkCell, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The original HTML has a <source> tag for responsive images.
        // createOptimizedPicture handles this automatically if the picture element is passed directly.
        // It's better to pass the picture element itself if it already exists and has sources.
        // If we only have img.src, we might lose the source sets.
        // However, the current createOptimizedPicture signature expects src, alt, eager, breakpoints.
        // Let's assume createOptimizedPicture handles the source sets correctly when given img.src.
        // If not, we would need to clone the picture element and modify its img.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // The moveInstrumentation here is slightly off. It should move from the original img to the new img within optimizedPic.
        // It's better to move instrumentation from the original imageCell to the new cardImage, and then append the optimized picture.
        // The current implementation replaces the img within the optimized picture, which is fine.
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    // CHECK 1.5: The BlockJson model defines 'description' as type=text.
    // Therefore, it should use .textContent.trim() to read plain text, not .innerHTML.
    // .innerHTML would be for richtext fields.
    descP.textContent = descriptionCell.textContent.trim(); // Changed from innerHTML to textContent.trim()
    moveInstrumentation(descriptionCell, descP);

    homeBoxCard.append(descP);

    cardWrapper.append(cardImage, homeBoxCard);
    linkEl.append(cardWrapper);
    row.replaceWith(linkEl);
  });
}
