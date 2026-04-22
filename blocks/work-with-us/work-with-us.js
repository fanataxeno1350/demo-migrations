import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...slideRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(titleRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // The titleRow contains a single div cell, so access its text content directly.
  heading.textContent = titleRow.children[0].textContent.trim();
  sectionHeader.appendChild(heading);

  block.innerHTML = '';
  block.classList.add('section', 'pb-0');
  block.prepend(sectionHeader);

  // Slides Container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [
      imageCell,
      imageAltCell,
      imageTitleCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const imageWrapDiv = document.createElement('div');
      imageWrapDiv.classList.add('image-wrap');

      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell?.textContent.trim() || img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapDiv.appendChild(optimizedPic);
      }
      wrapDiv.appendChild(imageWrapDiv);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = headingCell?.textContent.trim() || '';
    contentSectionHeader.appendChild(slideHeading);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    description.textContent = descriptionCell?.textContent.trim() || '';
    contentSectionHeader.appendChild(description);

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('btn', 'btn-primary', 'stretched-link');
      ctaAnchor.href = ctaLink.href; // Read href from the anchor tag
      ctaAnchor.textContent = ctaLabelCell?.textContent.trim() || '';
      contentSectionHeader.appendChild(ctaAnchor);
    }

    contentWrapDiv.appendChild(contentSectionHeader);
    wrapDiv.appendChild(contentWrapDiv);
    slideDiv.appendChild(wrapDiv);
    gridLayoutDiv.appendChild(slideDiv);
  });

  containerDiv.appendChild(gridLayoutDiv);
  positionRelativeDiv.appendChild(containerDiv);
  block.appendChild(positionRelativeDiv);
}
