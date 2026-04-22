import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [quickLinksRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('id', `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`);
  swiperWrapper.setAttribute('aria-live', 'off');
  beamSlider.append(swiperWrapper);

  slideRows.forEach((row, index) => {
    // This destructuring is correct as per the EDS Block Structure for spotlight-slide item rows.
    const [imageCell, altTextCell, smallCell, headingCell, descriptionCell, ctaLinkCell, ctaLinkLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    swiperSlide.append(slideBgImg);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ media: '(max-width: 576px)', width: '400' }, { media: '(max-width: 799px)', width: '800' }, { width: '1920' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContent);

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');
    mobContent.append(content);

    const smallHeading = document.createElement('small');
    smallHeading.style.fontWeight = 'bold';
    smallHeading.textContent = smallCell.textContent.trim();
    content.append(smallHeading);

    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-medium', 'font-size-tb');
    heading.textContent = headingCell.textContent.trim();
    content.append(heading);

    if (descriptionCell.innerHTML.trim()) {
      const description = document.createElement('p');
      description.innerHTML = descriptionCell.innerHTML;
      content.append(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLinkLabelCell.textContent.trim()) {
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn', 'btn-primary');
      ctaButton.href = ctaLink.href;
      ctaButton.textContent = ctaLinkLabelCell.textContent.trim();
      content.append(ctaButton);
    }

    swiperWrapper.append(swiperSlide);
  });

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', swiperWrapper.id);
  const prevImg = document.createElement('img');
  prevImg.alt = 'svg file';
  // Note: The original HTML uses a hardcoded SVG path. We need to create a placeholder or use an actual icon.
  // For now, we'll use a placeholder. In a real scenario, this SVG would be an authored asset.
  prevImg.src = '/icons/arrow-left.svg'; // Placeholder, replace with actual authored SVG path if available in model
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
  // Note: The original HTML uses a hardcoded SVG path. We need to create a placeholder or use an actual icon.
  // For now, we'll use a placeholder. In a real scenario, this SVG would be an authored asset.
  nextImg.src = '/icons/arrow-right.svg'; // Placeholder, replace with actual authored SVG path if available in model
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
  section.append(quickLinksParentDiv);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');
  quickLinksParentDiv.append(container);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  container.append(quickLinksUl);

  // Move content from quickLinksRow into the new ul
  // The quickLinksRow is block.children[0] and contains a single cell.
  // The BlockJson indicates 'quickLinks' is a richtext field.
  const quickLinksCell = quickLinksRow.firstElementChild;
  if (quickLinksCell) {
    const authoredUl = quickLinksCell.querySelector('ul');
    if (authoredUl) {
      // Move instrumentation from the original row to the new ul if it exists
      moveInstrumentation(quickLinksRow, quickLinksUl);
      // Append children from the authored UL to the new quickLinksUl
      while (authoredUl.firstChild) {
        const li = authoredUl.firstChild;
        if (li.nodeType === Node.ELEMENT_NODE && li.tagName === 'LI') {
          const anchor = li.querySelector('a');
          if (anchor) {
            anchor.classList.add('with-full-underline');
          }
        }
        quickLinksUl.append(li);
      }
    } else {
      // If no UL, just append the content as is, maybe it's just text or paragraphs
      moveInstrumentation(quickLinksRow, quickLinksUl);
      while (quickLinksCell.firstChild) {
        quickLinksUl.append(quickLinksCell.firstChild);
      }
    }
  }

  block.textContent = '';
  block.append(section);

  // Add event listeners for swiper navigation
  // Note: The actual Swiper library initialization would typically happen after the DOM is ready,
  // often in a separate script or a dynamic import. These listeners are placeholders for
  // potential custom navigation logic if Swiper isn't used, or to trigger Swiper's methods.
  // Assuming a Swiper instance will be available globally or passed.
  // For a real Swiper integration, you'd import Swiper and initialize it here.
  // Example:
  // import Swiper from 'swiper';
  // import { Navigation, Pagination } from 'swiper/modules';
  // Swiper.use([Navigation, Pagination]);
  // const mySwiper = new Swiper(beamSlider, {
  //   // Swiper parameters
  //   navigation: {
  //     nextEl: nextButton,
  //     prevEl: prevButton,
  //   },
  //   pagination: {
  //     el: swiperPagination,
  //     clickable: true,
  //   },
  // });

  // Placeholder event listeners if Swiper is not dynamically loaded or for custom behavior
  prevButton.addEventListener('click', () => {
    // Trigger previous slide logic, e.g., mySwiper.slidePrev();
    console.log('Previous slide clicked');
  });

  nextButton.addEventListener('click', () => {
    // Trigger next slide logic, e.g., mySwiper.slideNext();
    console.log('Next slide clicked');
  });
}
