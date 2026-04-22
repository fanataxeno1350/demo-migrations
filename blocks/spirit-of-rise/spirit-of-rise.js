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
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  // Content detection for heading
  const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
  if (headingCell) {
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  description.classList.add('aos-init', 'aos-animate');
  // Content detection for description
  const descriptionCellContent = [...descriptionRow.children].find((cell) => cell.textContent.trim());
  if (descriptionCellContent) {
    moveInstrumentation(descriptionCellContent, description);
    description.textContent = descriptionCellContent.textContent.trim();
  }
  sectionHeader.appendChild(description);

  section.appendChild(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.appendChild(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.appendChild(cardsWrapper);

  cardRows.forEach((row) => {
    // Correctly destructure cells for fixed-field item model
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.appendChild(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The original HTML does not have a source with media="(max-width: 576px)" for the main image.
        // createOptimizedPicture should reflect the actual sources if they exist in the original picture element.
        // For simplicity, keeping the single width for now as per original JS, but noting this for future.
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        cardImage.appendChild(optimizedPic);
      }
    }
    cardWrapper.appendChild(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    const desc = document.createElement('p');
    desc.classList.add('desc');
    // For richtext, innerHTML is correct
    desc.innerHTML = descriptionCell.innerHTML;
    homeBoxCard.appendChild(desc);
    cardWrapper.appendChild(homeBoxCard);

    cardsWrapper.appendChild(cardLink);
  });

  section.appendChild(performanceDriven);
  block.replaceWith(section);
}
