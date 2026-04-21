import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate'); // aos classes from original HTML
    // Add data-aos attributes from original HTML
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      // Add target="_blank" if it's an external link, based on original HTML
      if (foundLink.getAttribute('target') === '_blank') {
        cardWrap.setAttribute('target', '_blank');
      }
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Extract sources from the original picture element
        const sources = [...picture.querySelectorAll('source')].map((source) => {
          const media = source.getAttribute('media');
          const srcset = source.getAttribute('srcset');
          return { media, srcset };
        });

        // Create optimized picture with responsive sources and alt text
        const optimizedPic = createOptimizedPicture(
          img.src,
          altTextCell.textContent.trim(), // Use altTextCell for alt text
          false,
          [{ width: '750' }], // Default width for img
          sources, // Pass extracted sources
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell.innerHTML;

    cardTextDiv.append(descP);
    cardWrap.append(cardImageDiv, cardTextDiv);
    moveInstrumentation(row, cardWrap); // Move instrumentation from row to cardWrap
    colDiv.append(cardWrap);
    gridContainer.append(colDiv);
  });

  block.innerHTML = ''; // Clear the original block content
  block.append(gridContainer);
}
