import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(headingRow.firstElementChild, heading); // Instrumentation from the actual content cell
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow.firstElementChild, description); // Instrumentation from the actual content cell
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(description);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.appendChild(sectionHeader);

  // Our Business Verticals
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');

  const mobileFlickityViewport = document.createElement('div');
  mobileFlickityViewport.classList.add('flickity-viewport');
  mobileFlickityViewport.style.height = '0px'; // Will be adjusted by Flickity JS
  mobileFlickityViewport.style.touchAction = 'pan-y';
  const mobileFlickitySlider = document.createElement('div');
  mobileFlickitySlider.classList.add('flickity-slider');
  mobileFlickitySlider.style.left = '0px';

  const mobileSlides = [];
  const itemsPerSlide = 3;
  let currentSlide;
  let currentSlideRow;

  businessVerticalRows.forEach((row, i) => {
    // Destructure cells based on BLOCK JSON model
    const [imageCell, imageAltCell, imageTitleCell, titleCell, iconCell, linkCell, ariaLabelCell] = [...row.children];

    // Desktop item
    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(i % 3) * 300 + 100}`); // Staggered delay
    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.appendChild(optimizedPic);
    }
    wrap.appendChild(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const iconImg = iconCell.querySelector('img');
    if (iconImg) {
      const iconOptimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconImg, iconOptimizedPic.querySelector('img'));
      titleDiv.appendChild(iconOptimizedPic);
    }
    wrap.appendChild(titleDiv);

    const linkEl = document.createElement('a');
    linkEl.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href; // Read href from the <a> tag
    }
    linkEl.setAttribute('aria-label', ariaLabelCell.textContent.trim());
    moveInstrumentation(linkCell, linkEl);
    wrap.appendChild(linkEl);

    col.appendChild(wrap);
    desktopRow.appendChild(col);

    // Mobile slider item
    if (i % itemsPerSlide === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (i === 0) {
        currentSlide.classList.add('is-selected');
      } else {
        currentSlide.setAttribute('aria-hidden', 'true');
      }
      currentSlide.style.position = 'absolute';
      currentSlide.style.left = '0px'; // Flickity will manage this
      mobileSlides.push(currentSlide);

      currentSlideRow = document.createElement('div');
      currentSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.appendChild(currentSlideRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    moveInstrumentation(row, mobileCol); // Move instrumentation from original row to the mobile col
    mobileCol.appendChild(wrap.cloneNode(true)); // Clone the wrap for mobile
    currentSlideRow.appendChild(mobileCol);
  });

  desktopContainer.appendChild(desktopRow);
  ourBusinessVerticals.appendChild(desktopContainer);

  mobileSlides.forEach((slide) => mobileFlickitySlider.appendChild(slide));
  mobileFlickityViewport.appendChild(mobileFlickitySlider);
  mobileSlider.appendChild(mobileFlickityViewport);

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  mobileSlides.forEach((_, i) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    pageDots.appendChild(dot);
  });
  mobileSlider.appendChild(pageDots);

  mobileContainer.appendChild(mobileSlider);
  ourBusinessVerticals.appendChild(mobileContainer);

  block.textContent = ''; // Clear original block content
  block.classList.add('section'); // Add section class to the block itself
  block.appendChild(containerDiv);
  block.appendChild(ourBusinessVerticals);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
