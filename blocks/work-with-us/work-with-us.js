import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  // Slides container
  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');
  const container = document.createElement('div');
  container.classList.add('container');

  // Add Flickity attributes for mobile slider
  container.classList.add('flickity-slider-mobile-wrap');
  container.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const cells = [...row.children];

    // Content detection for slide cells
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '' && !cell.querySelector('a'));
    const descriptionCell = cells.find(cell => cell.innerHTML.includes('<p>') || cell.innerHTML.includes('<ul>'));
    const ctaLinkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.startsWith('/content/'));
    const ctaLinkLabelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell !== titleCell && cell !== descriptionCell);

    const slide = document.createElement('div');
    slide.classList.add('slides');
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    // Image
    if (imageCell && imageCell.querySelector('picture')) {
      const imageWrap = document.createElement('div');
      imageWrap.classList.add('image-wrap');
      const picture = imageCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width: 576px)', width: '576' }, { media: '(max-width: 799px)', width: '799' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
      }
      wrap.append(imageWrap);
    }

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    if (titleCell) {
      const title = document.createElement('h3');
      title.classList.add('heading', 'font-regular');
      moveInstrumentation(titleCell, title);
      title.textContent = titleCell.textContent.trim();
      contentSectionHeader.append(title);
    }

    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('text-size-body');
      moveInstrumentation(descriptionCell, description);
      description.innerHTML = descriptionCell.innerHTML;
      contentSectionHeader.append(description);
    }

    if (ctaLinkCell && ctaLinkLabelCell) {
      const ctaLink = document.createElement('a');
      const foundCtaLink = ctaLinkCell.querySelector('a');
      if (foundCtaLink) {
        ctaLink.href = foundCtaLink.href;
      }
      ctaLink.textContent = ctaLinkLabelCell.textContent.trim();
      ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
      moveInstrumentation(ctaLinkCell, ctaLink);
      contentSectionHeader.append(ctaLink);
    }

    contentWrap.append(contentSectionHeader);
    wrap.append(contentWrap);
    slide.append(wrap);
    gridLayout.append(slide);
  });

  container.append(gridLayout);
  positionRelative.append(container);

  block.textContent = '';
  block.classList.add('section', 'work-with-us', 'pb-0');
  block.append(sectionHeader, positionRelative);
}
