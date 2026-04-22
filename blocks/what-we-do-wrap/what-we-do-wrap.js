import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Find heading and description rows using content detection
  const headingRow = rows.find(row => row.querySelector('h2') || (row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().length > 50));
  const descriptionRow = rows.find(row => row !== headingRow && (row.querySelector('p') || (row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().length < 200)));

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow.firstElementChild, heading);
    heading.textContent = headingRow.firstElementChild.textContent.trim();
    sectionHeader.append(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow.firstElementChild, description);
    description.textContent = descriptionRow.firstElementChild.textContent.trim();
    sectionHeader.append(description);
  }

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  containerDiv.append(sectionHeader);

  // Business Verticals
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
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = [];
  const itemsPerMobileSlide = 3;
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let currentMobileSlideRow = document.createElement('div');
  currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(currentMobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  // Filter out heading and description rows to get only item rows
  const itemRows = rows.filter(row => row !== headingRow && row !== descriptionRow);

  itemRows.forEach((row, index) => {
    // Using destructuring as per EDS Block Structure for fixed-field item models
    const [imageCell, titleCell, linkCell, linkLabelCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    // Original HTML has varying delays, replicating a simple pattern for now
    if (index % 3 === 0) col.setAttribute('data-aos-delay', '100');
    else if (index % 3 === 1) col.setAttribute('data-aos-delay', '400');
    else col.setAttribute('data-aos-delay', '700');

    moveInstrumentation(row, col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      imageDiv.append(picture);
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    moveInstrumentation(titleCell, titleDiv);
    titleDiv.innerHTML = titleCell.innerHTML; // Preserve potential nested img for arrow

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      // Use linkLabelCell.textContent.trim() for aria-label as per EDS Block Structure
      link.setAttribute('aria-label', `Learn more about ${linkLabelCell.textContent.trim()}`);
    }
    moveInstrumentation(linkCell, link);
    // Link label is used for aria-label, not textContent for stretched-link

    wrap.append(titleDiv);
    wrap.append(link);
    col.append(wrap);

    desktopRow.append(col);

    // Mobile slider items
    if (currentMobileSlideRow.children.length >= itemsPerMobileSlide) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      currentMobileSlideRow = document.createElement('div');
      currentMobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(currentMobileSlideRow);
      mobileSlides.push(currentMobileSlide);
    }
    const mobileCol = col.cloneNode(true); // Clone the desktop item for mobile
    currentMobileSlideRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach(slide => mobileSlider.append(slide));
  ourBusinessVerticals.append(mobileContainer);

  block.textContent = '';
  block.append(containerDiv);
  block.append(ourBusinessVerticals);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { width: '376' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
