import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  block.classList.add('section', 'grey-bg');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(description);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageCell, linkCell, linkLabelCell, textCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    // Image
    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      cardImage.append(picture);
    }
    cardWrapper.append(cardImage);

    // Text Content
    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = textCell.innerHTML; // Rich text content
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    link.append(cardWrapper);
    cardsWrapper.append(link);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  block.textContent = '';
  block.append(sectionHeader, performanceDriven);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
