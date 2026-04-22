import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block already has 'purpose-led-grid' from AEM.
  // The original HTML shows 'row', 'g-4', 'pt-3' directly on the block element.
  // So, we add these classes to the block itself.
  block.classList.add('row', 'g-4', 'pt-3');

  // The block structure indicates that the direct children of the 'purpose-led-grid' block
  // are the item rows for the 'cards' container field.
  // We iterate over these item rows.
  [...block.children].forEach((row) => {
    // Destructure the cells based on the 'purpose-led-card' model definition.
    // The order is fixed: image, imageAlt, cardLink, cardLinkLabel, description.
    const [imageCell, imageAltCell, cardLinkCell, cardLinkLabelCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    // Move instrumentation from the original row to the new colDiv.
    moveInstrumentation(row, colDiv);
    // Add classes and attributes from the original HTML's col-md-6 div.
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    // Get the original link from the 'cardLinkCell' (type=aem-content).
    const originalLink = cardLinkCell.querySelector('a');
    if (originalLink) {
      cardLink.href = originalLink.href;
      // Original HTML has target="_blank" for these links.
      cardLink.target = '_blank';
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    // Get the picture element from the 'imageCell' (type=reference).
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Create an optimized picture using the img src and imageAltCell content.
        // The imageAltCell is type=text, so we read its textContent.
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));

        // Handle source elements for responsive images, copying them from the original picture.
        const sources = picture.querySelectorAll('source');
        sources.forEach(source => {
          const newSource = document.createElement('source');
          newSource.media = source.media;
          newSource.srcset = source.srcset;
          // Prepend new sources to the optimized picture to maintain order.
          optimizedPic.prepend(newSource);
        });

        // Add 'img-fluid' class to the img inside the optimized picture.
        optimizedPic.querySelector('img').classList.add('img-fluid');
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    // The 'descriptionCell' is type=richtext, so we use innerHTML to preserve formatting.
    descP.innerHTML = descriptionCell.innerHTML;

    cardTextDiv.append(descP);
    cardLink.append(cardImageDiv, cardTextDiv);
    colDiv.append(cardLink);

    // Append the constructed column div to the block.
    // The block itself is the container with 'row g-4 pt-3' classes.
    block.append(colDiv);
  });
}
