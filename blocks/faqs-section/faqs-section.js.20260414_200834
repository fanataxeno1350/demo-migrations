import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // Use content detection for the heading cell
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  if (headingCell) {
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
  }
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(row, li);

    const questionHeading = document.createElement('h2');
    questionHeading.textContent = questionCell.textContent.trim();
    questionHeading.setAttribute('data-once', 'faqsAccordion'); // Add data-once attribute

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    accoContentDiv.innerHTML = answerCell.innerHTML;

    // First item is active by default
    if (index === 0) {
      li.classList.add('active');
      accoContentDiv.classList.add('show');
    }

    // Add event listener for accordion functionality
    questionHeading.addEventListener('click', () => {
      const currentActive = ul.querySelector('li.active');
      if (currentActive && currentActive !== li) {
        currentActive.classList.remove('active');
        currentActive.querySelector('.acco-content-div').classList.remove('show');
      }
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(questionHeading, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
