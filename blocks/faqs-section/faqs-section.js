import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...faqRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'faqs-section');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  // Heading
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  // Use children[0] for consistency, though firstElementChild works here
  moveInstrumentation(headingRow.children[0], heading);
  heading.textContent = headingRow.children[0].textContent.trim();
  sectionHeader.append(heading);
  container.append(sectionHeader);

  // FAQs Accordion
  const accoDiv = document.createElement('div');
  accoDiv.classList.add('acco-div');
  const ul = document.createElement('ul');

  faqRows.forEach((row, index) => {
    const [questionCell, answerCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('aos-init', 'aos-animate');
    li.setAttribute('data-aos', 'fade-up');
    if (index === 0) {
      li.classList.add('active'); // First item is active by default
    }
    moveInstrumentation(row, li);

    const h2 = document.createElement('h2');
    h2.setAttribute('data-once', 'faqsAccordion');
    moveInstrumentation(questionCell, h2);
    h2.textContent = questionCell.textContent.trim();

    const accoContentDiv = document.createElement('div');
    accoContentDiv.classList.add('acco-content-div');
    if (index === 0) {
      accoContentDiv.classList.add('show');
    }
    moveInstrumentation(answerCell, accoContentDiv);
    accoContentDiv.innerHTML = answerCell.innerHTML;

    h2.addEventListener('click', () => {
      // Close all other open accordions
      ul.querySelectorAll('li.active').forEach((activeLi) => {
        if (activeLi !== li) {
          activeLi.classList.remove('active');
          activeLi.querySelector('.acco-content-div').classList.remove('show');
        }
      });

      // Toggle current accordion
      li.classList.toggle('active');
      accoContentDiv.classList.toggle('show');
    });

    li.append(h2, accoContentDiv);
    ul.append(li);
  });

  accoDiv.append(ul);
  container.append(accoDiv);
  section.append(container);

  block.textContent = '';
  block.append(section);
}
