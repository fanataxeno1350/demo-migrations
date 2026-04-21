import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');
  moveInstrumentation(block, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  section.appendChild(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Destructure cells as per EDS BLOCK STRUCTURE for fixed-field item models
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    
    // Read href from the 'aem-content' linkCell
    const linkElement = linkCell.querySelector('a');
    if (linkElement) {
      cardLink.href = linkElement.href;
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    
    // Read image from the 'reference' imageCell
    const imageElement = imageCell.querySelector('picture');
    if (imageElement) {
      const img = imageElement.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(imageElement, optimizedPic.querySelector('img'));
        cardImageDiv.appendChild(optimizedPic);
      }
    }
    cardWrapper.appendChild(cardImageDiv);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('desc');
    
    // Read description from the 'text' descriptionCell
    if (descriptionCell) {
      cardDescription.innerHTML = descriptionCell.textContent.trim(); // Use textContent for plain text cells
    }
    cardBox.appendChild(cardDescription);
    cardWrapper.appendChild(cardBox);
    cardLink.appendChild(cardWrapper);
    cardsContainer.appendChild(cardLink);
  });

  container.appendChild(cardsContainer);
  performanceDriven.appendChild(container);
  section.appendChild(performanceDriven);

  block.replaceWith(section);
}
