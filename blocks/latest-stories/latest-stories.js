import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...storyRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-offset', '100');
  heading.setAttribute('data-aos-duration', '650');
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides');

  storyRows.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, linkLabelCell, dateCell] = [...row.children];

    const slide = document.createElement('div');
    slide.classList.add('slide'); // Corrected class name from 'slides' to 'slide'
    moveInstrumentation(row, slide);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrap.append(optimizedPic);
    }
    wrap.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const category = document.createElement('div');
    category.classList.add('category');
    category.textContent = categoryCell.textContent.trim();
    contentWrap.append(category);

    const text = document.createElement('div');
    text.classList.add('text');
    text.textContent = textCell.textContent.trim();
    contentWrap.append(text);

    const link = document.createElement('a');
    link.classList.add('btn', 'btn-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = linkLabelCell.textContent.trim();
    contentWrap.append(link);

    const date = document.createElement('div');
    date.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date cell contains a parsable date string
    time.textContent = dateCell.textContent.trim();
    date.append(time);
    contentWrap.append(date);

    wrap.append(contentWrap);
    slide.append(wrap);
    slidesContainer.append(slide);
  });

  flickitySliderWrap.append(slidesContainer);
  container.append(flickitySliderWrap);

  block.textContent = '';
  block.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  block.append(sectionHeader);
  block.append(container);
}
