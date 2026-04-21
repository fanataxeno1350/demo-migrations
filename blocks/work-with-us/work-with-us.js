import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [imageCell, altCell, titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altCell.textContent.trim(), false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapDiv.append(optimizedPic);
        optimizedPic.querySelector('img').classList.add('img-fluid');
      }
    }
    wrapDiv.append(imageWrapDiv);

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const title = document.createElement('h3');
    title.classList.add('heading', 'font-regular');
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
    contentSectionHeader.append(title);

    const description = document.createElement('p');
    description.classList.add('text-size-body');
    moveInstrumentation(descriptionCell, description);
    description.textContent = descriptionCell.textContent.trim();
    contentSectionHeader.append(description);

    const ctaLinkAnchor = ctaLinkCell.querySelector('a'); // Get the anchor element
    if (ctaLinkAnchor) {
      const button = document.createElement('a');
      button.classList.add('btn', 'btn-primary', 'stretched-link');
      button.href = ctaLinkAnchor.href; // Read href from the anchor element
      moveInstrumentation(ctaLinkAnchor, button);
      button.textContent = ctaLabelCell.textContent.trim();
      contentSectionHeader.append(button);
    }

    contentWrapDiv.append(contentSectionHeader);
    wrapDiv.append(contentWrapDiv);
    slideDiv.append(wrapDiv);
    gridLayoutDiv.append(slideDiv);

    moveInstrumentation(row, slideDiv);
  });

  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);

  block.innerHTML = '';
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.append(sectionHeader);
  block.append(positionRelativeDiv);
}
