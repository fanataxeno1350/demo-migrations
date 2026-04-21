import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section wrapper
  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);
  section.appendChild(sectionHeader);

  // Slides container
  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');
  const container = document.createElement('div');
  container.classList.add('container');
  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [imageCell, altTextCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slides');
    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // The altTextCell contains plain text, so .textContent.trim() is correct.
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        imageWrap.appendChild(optimizedPic);
      }
    }
    wrap.appendChild(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');
    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    title.textContent = titleCell.textContent.trim();
    contentSectionHeader.appendChild(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell.textContent.trim();
    contentSectionHeader.appendChild(description);

    // ctaLinkCell is of type=aem-content, so we must read the href from the <a> tag.
    const ctaLinkAnchor = ctaLinkCell.querySelector('a');
    if (ctaLinkAnchor) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = ctaLinkAnchor.href; // Correctly reading href from the anchor
      ctaAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
      ctaAnchor.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, ctaAnchor);
      contentSectionHeader.appendChild(ctaAnchor);
    }

    contentWrap.appendChild(contentSectionHeader);
    wrap.appendChild(contentWrap);
    slide.appendChild(wrap);
    gridLayout.appendChild(slide);

    moveInstrumentation(row, slide);
  });

  container.appendChild(gridLayout);
  positionRelative.appendChild(container);
  section.appendChild(positionRelative);

  block.replaceWith(section);
}
