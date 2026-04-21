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
  // Use content detection for heading cell
  const headingCell = [...headingRow.children].find(cell => cell.textContent.trim());
  if (headingCell && headingCell.textContent.trim()) {
    const sectionHeader = document.createElement('div');
    sectionHeader.classList.add('section-header', 'text-center');
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.textContent = headingCell.textContent.trim();
    sectionHeader.append(heading);
    container.append(sectionHeader);
  }

  // FAQs Accordion
  if (faqRows.length > 0) {
    const accoDiv = document.createElement('div');
    accoDiv.classList.add('acco-div');
    const ul = document.createElement('ul');

    faqRows.forEach((row, index) => {
      // Destructuring is correct here as per BlockJson model for faq-item
      const [questionCell, answerCell] = [...row.children];

      const li = document.createElement('li');
      li.classList.add('aos-init', 'aos-animate');
      li.setAttribute('data-aos', 'fade-up');
      if (index === 0) {
        li.classList.add('active'); // First item is active by default
      }

      const h2 = document.createElement('h2');
      h2.textContent = questionCell.textContent.trim();
      h2.setAttribute('data-once', 'faqsAccordion'); // Copy attribute from original HTML
      li.append(h2);

      const accoContentDiv = document.createElement('div');
      accoContentDiv.classList.add('acco-content-div');
      if (index === 0) {
        accoContentDiv.classList.add('show'); // First item content is shown by default
      }
      // Use innerHTML for richtext field 'answer'
      accoContentDiv.innerHTML = answerCell.innerHTML;
      li.append(accoContentDiv);

      moveInstrumentation(row, li); // Move instrumentation from original row to new li
      ul.append(li);

      // Add click listener for accordion behavior
      h2.addEventListener('click', () => {
        const isActive = li.classList.contains('active');

        // Close all other open accordions
        ul.querySelectorAll('li.active').forEach((activeLi) => {
          if (activeLi !== li) {
            activeLi.classList.remove('active');
            activeLi.querySelector('.acco-content-div').classList.remove('show');
          }
        });

        // Toggle current accordion
        li.classList.toggle('active', !isActive);
        accoContentDiv.classList.toggle('show', !isActive);
      });
    });

    accoDiv.append(ul);
    container.append(accoDiv);
  }

  section.append(container);
  block.replaceWith(section);

  // Image optimization (if any images were present in richtext)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
