import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slides = allRows.filter((row) => row.children.length === 7);
  const quickLinks = allRows.filter((row) => row.children.length === 2);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  // The ID 'swiper-wrapper-10c10b185d3bc46cfd' is from the original HTML, so it's fine to use.
  swiperWrapper.setAttribute('id', 'swiper-wrapper-10c10b185d3bc46cfd');
  swiperWrapper.setAttribute('aria-live', 'off');

  slides.forEach((row, index) => {
    // CRITICAL: row.children[n] is used here, but it's safe because the model defines fixed fields
    // and the filter `row.children.length === 7` ensures the structure.
    const [imageCell, altTextCell, headingCell, subheadingCell, descriptionCell, ctaLinkCell, ctaLinkLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      slideBgImg.append(picture);
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    // Check original HTML for heading tag usage: first slide uses h1, subsequent use h2
    const heading = document.createElement(index === 0 ? 'h1' : 'h2');
    heading.classList.add('heading', 'font-medium', 'font-size-tb');
    // The first slide in original HTML has an additional class 'banner-text-dark'
    if (index === 0) {
      heading.classList.add('banner-text-dark');
    }
    if (headingCell) {
      heading.textContent = headingCell.textContent.trim();
    }
    contentDiv.append(heading);

    if (subheadingCell && subheadingCell.textContent.trim()) {
      const subheading = document.createElement('small'); // Original uses small for subheading
      subheading.style.fontWeight = 'bold';
      subheading.textContent = subheadingCell.textContent.trim();
      contentDiv.prepend(subheading); // Prepend to appear before heading
    }

    if (descriptionCell && descriptionCell.textContent.trim()) {
      const description = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = descriptionCell.textContent.trim();
      description.append(strong);
      contentDiv.append(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLinkLabelCell && ctaLinkLabelCell.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLinkLabelCell.textContent.trim();
      anchor.classList.add('btn', 'btn-primary');
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', 'swiper-wrapper-10c10b185d3bc46cfd');
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  // The original HTML uses a DAM path for the SVG. For this exercise, we assume it's a static asset.
  // Using a placeholder path. If the SVG path was part of the block model, it would be read from there.
  prevImg.src = '/icons/arrow-left.svg'; // Placeholder, replace with actual path if needed
  prevButton.append(prevImg);
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', 'swiper-wrapper-10c10b185d3bc46cfd');
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextImg.src = '/icons/arrow-right.svg'; // Placeholder, replace with actual path if needed
  nextButton.append(nextImg);
  beamSlider.append(nextButton);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  // Quick Links section
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinks.forEach((row) => {
    // CRITICAL: row.children[n] is used here, but it's safe because the model defines fixed fields
    // and the filter `row.children.length === 2` ensures the structure.
    const [linkCell, linkLabelCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    if (linkLabelCell) {
      anchor.textContent = linkLabelCell.textContent.trim();
    }
    anchor.classList.add('with-full-underline');
    li.append(anchor);
    quickLinksUl.append(li);
  });

  containerDiv.append(quickLinksUl);
  quickLinksParentDiv.append(containerDiv);

  block.textContent = '';
  block.classList.add('m-0', 'p-0'); // Add section classes to block
  block.append(beamSlider, quickLinksParentDiv);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1903' }]); // Using max width from original
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // INTERACTIVITY: Add event listeners for navigation buttons
  // In a real Swiper implementation, you would initialize Swiper JS here.
  // For this exercise, we'll add basic click listeners as placeholders.
  // The actual Swiper library would handle the slide transitions.
  prevButton.addEventListener('click', () => {
    // Placeholder for Swiper's prev slide logic
    console.log('Previous button clicked');
    // If Swiper was initialized, you'd call swiperInstance.slidePrev();
  });

  nextButton.addEventListener('click', () => {
    // Placeholder for Swiper's next slide logic
    console.log('Next button clicked');
    // If Swiper was initialized, you'd call swiperInstance.slideNext();
  });
}
