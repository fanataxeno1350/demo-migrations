import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading and Description are the first two rows.
  // Model: heading (text), description (text)
  const headingRow = children.find((row) => row.children[0]?.textContent.trim() === 'Heading label text' || row.children[0]?.textContent.trim() === 'What we do');
  const descriptionRow = children.find((row) => row.children[0]?.textContent.trim() === 'Description label text' || row.children[0]?.textContent.trim().startsWith('We bring together diverse'));

  // Heading
  if (headingRow) {
    const headingCell = headingRow.querySelector('div');
    if (headingCell) {
      const heading = document.createElement('h2');
      heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
      heading.textContent = headingCell.textContent.trim();
      moveInstrumentation(headingRow, heading);
      sectionHeader.append(heading);
    }
  }

  // Description
  if (descriptionRow) {
    const descriptionCell = descriptionRow.querySelector('div');
    if (descriptionCell) {
      const description = document.createElement('p');
      description.classList.add('aos-init', 'aos-animate');
      description.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionRow, description);
      sectionHeader.append(description);
    }
  }

  const businessVerticalsWrapper = document.createElement('div');
  businessVerticalsWrapper.classList.add('our-business-verticals');
  section.append(businessVerticalsWrapper);

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  businessVerticalsWrapper.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  businessVerticalsWrapper.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  flickitySlider.append(currentMobileSlide);
  mobileSlides.push(currentMobileSlide);

  let mobileSlideInnerRow = document.createElement('div');
  mobileSlideInnerRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideInnerRow);

  // All rows after heading and description are businessVerticalItems
  const businessVerticalItems = children.filter((row) => row !== headingRow && row !== descriptionRow);

  businessVerticalItems.forEach((row, index) => {
    const cells = [...row.children];

    // Model: image (reference), title (text), icon (reference), link (aem-content)
    const imageCell = cells.find(c => c.querySelector('picture'));
    const titleCell = cells.find(c => c.textContent.trim() && !c.querySelector('picture') && !c.querySelector('a'));
    const iconCell = cells.find(c => c.querySelector('picture') && c !== imageCell);
    const linkCell = cells.find(c => c.querySelector('a'));

    // Desktop item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Stagger delays
    desktopRow.append(desktopCol);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    desktopCol.append(wrap);
    moveInstrumentation(row, wrap);

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
      wrap.append(imageDiv);
    }

    if (titleCell || iconCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      if (titleCell) {
        titleDiv.textContent = titleCell.textContent.trim();
      }
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const iconImg = iconPicture.querySelector('img');
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
          moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
          titleDiv.append(optimizedIcon);
        }
      }
      wrap.append(titleDiv);
    }

    if (linkCell) {
      const anchor = document.createElement('a');
      anchor.classList.add('stretched-link');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      anchor.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
      wrap.append(anchor);
    }

    // Mobile item
    if (mobileSlideInnerRow.children.length >= 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      flickitySlider.append(currentMobileSlide);
      mobileSlides.push(currentMobileSlide);

      mobileSlideInnerRow = document.createElement('div');
      mobileSlideInnerRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileSlideInnerRow);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileSlideInnerRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);
    moveInstrumentation(row, mobileWrap); // Add instrumentation for mobile items

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        imageDiv.append(optimizedPic);
      }
      mobileWrap.append(imageDiv);
    }

    if (titleCell || iconCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      if (titleCell) {
        titleDiv.textContent = titleCell.textContent.trim();
      }
      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const iconImg = iconPicture.querySelector('img');
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
          titleDiv.append(optimizedIcon);
        }
      }
      mobileWrap.append(titleDiv);
    }

    if (linkCell) {
      const anchor = document.createElement('a');
      anchor.classList.add('stretched-link');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      anchor.setAttribute('aria-label', `Learn more about ${titleCell?.textContent.trim() || ''}`);
      mobileWrap.append(anchor);
    }
  });

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
    pageDots.append(dot);
  });
  mobileSlider.append(pageDots);

  block.replaceWith(section);

  // Image optimization
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
