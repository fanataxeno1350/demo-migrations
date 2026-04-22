import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqItemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // CHECK 0 FIX: Replaced headingRow.children[0] with content detection
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim() !== '');
  if (headingCell) {
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeader.appendChild(heading);
  container.appendChild(sectionHeader);

  // Accordion Div
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');

  const ul = document.createElement('ul');

  faqItemRows.forEach((row, index) => {
    // CHECK 0 FIX: Destructuring is fine here as per BlockJson, it's a fixed-field item model
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }
    moveInstrumentation(row, li);

    const h2 = document.createElement('h2');
    // CHECK 1.5: question is text, textContent is correct
    h2.textContent = questionCell?.textContent.trim();
    // CHECK 2: Added data-once attribute as per ORIGINAL HTML for consistency, though not strictly functional
    h2.setAttribute('data-once', 'faqsAccordion');
    li.appendChild(h2);

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show'); // Show content for the first active item
    }
    // CHECK 1.5: Answer is richtext, innerHTML is correct
    accoContentDiv.innerHTML = answerCell?.innerHTML;
    li.appendChild(accoContentDiv);

    h2.addEventListener('click', () => {
      const currentlyActive = ul.querySelector('li.active');
      const currentlyOpenContent = ul.querySelector('.acco-content-div.show');

      // If there's an active item and it's not the one just clicked, deactivate it
      if (currentlyActive && currentlyActive !== li) {
        currentlyActive.classList.remove('active');
        currentlyOpenContent?.classList.remove('show');
      }

      // Toggle the clicked item's active state and content visibility
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    ul.appendChild(li);
  });

  accoDiv.appendChild(ul);
  container.appendChild(accoDiv);

  block.innerHTML = ''; // Clear original block content
  block.classList.add('section', 'faqs-section'); // Add section classes to the block itself
  block.appendChild(container);

  // Image optimization (if any images were present, though not in this specific model)
  // This part is generic and safe to keep even if no images are expected in this block type.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
