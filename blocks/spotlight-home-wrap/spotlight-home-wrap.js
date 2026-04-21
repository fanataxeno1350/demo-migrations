import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slides = [];
  const quickLinks = [];

  allRows.forEach((row) => {
    if (row.children.length === 7) {
      // This is a spotlight-slide item
      slides.push(row);
    } else if (row.children.length === 2) {
      // This is a quick-link-item
      quickLinks.push(row);
    }
  });

  // Create the main slider container
  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('id', `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`);
  swiperWrapper.setAttribute('aria-live', 'off');

  slides.forEach((row, index) => {
    const [imageCell, altTextCell, headingCell, subheadingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slides.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ media: '(max-width: 576px)', width: '400' }, { media: '(max-width: 799px)', width: '800' }, { width: '1920' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    if (subheadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadingCell.textContent.trim();
      contentDiv.append(small);
    }

    if (headingCell.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = headingCell.textContent.trim();
      contentDiv.append(h2);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.innerHTML = descriptionCell.textContent.trim();
      p.append(strong);
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLabelCell.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.classList.add('btn', 'btn-primary');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabelCell.textContent.trim();
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
    moveInstrumentation(row, swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Add navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', swiperWrapper.id);
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776767281020.svg+xml'; // Corrected SVG path from ORIGINAL HTML
  prevButton.append(prevImg);
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', swiperWrapper.id);
  const nextImg = document.createElement('img');
  nextImg.alt = 'svg file';
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776767281020.svg+xml'; // Corrected SVG path from ORIGINAL HTML
  nextButton.append(nextImg);
  beamSlider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  // Quick Links section
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  quickLinks.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    ul.append(li);
    moveInstrumentation(row, li);
  });

  container.append(ul);
  quickLinksParentDiv.append(container);

  block.innerHTML = '';
  block.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  block.append(beamSlider, quickLinksParentDiv);

  // Initialize Swiper (simplified for EDS, full Swiper logic not included)
  let currentIndex = 0;
  const slidesArray = [...swiperWrapper.children];

  const updateSlider = () => {
    // Ensure slidesArray is not empty to prevent errors
    if (slidesArray.length === 0) return;

    // Calculate offset based on the width of the first slide
    // This assumes all slides have the same width, which is typical for a slider
    const slideWidth = slidesArray[0].offsetWidth;
    const offset = -currentIndex * slideWidth;
    swiperWrapper.style.transform = `translate3d(${offset}px, 0px, 0px)`;

    slidesArray.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-fully-visible');
      } else {
        slide.classList.remove('swiper-slide-active', 'swiper-slide-fully-visible');
      }
      if (i === currentIndex - 1) {
        slide.classList.add('swiper-slide-prev');
      } else {
        slide.classList.remove('swiper-slide-prev');
      }
      if (i === currentIndex + 1) {
        slide.classList.add('swiper-slide-next');
      } else {
        slide.classList.remove('swiper-slide-next');
      }
    });

    // Update pagination bullets
    pagination.innerHTML = '';
    slidesArray.forEach((_, i) => {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      pagination.append(bullet);
    });
  };

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slidesArray.length - 1;
    updateSlider();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < slidesArray.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
  });

  // Initial update and add a resize listener to recalculate slide width
  updateSlider();
  window.addEventListener('resize', updateSlider);
}
