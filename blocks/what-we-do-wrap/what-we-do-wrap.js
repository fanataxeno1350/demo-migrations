import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  // Create the main section wrapper
  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  // Create the header section
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.textContent.trim() || '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  headerContainer.appendChild(sectionHeader);
  section.appendChild(headerContainer);

  // Create the business verticals section
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  // Mobile view (Flickity slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');

  let currentMobileSlideGroup = document.createElement('div');
  currentMobileSlideGroup.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlideGroup.appendChild(currentMobileRow);
  mobileSlider.appendChild(currentMobileSlideGroup); // Append initial group to slider

  itemRows.forEach((row, index) => {
    const [imageCell, imageAltCell, imageTitleCell, iconCell, titleCell, linkCell] = [...row.children];

    // --- Common item creation logic ---
    const createItemElement = (sourceRow, itemIndex) => {
      const col = document.createElement('div');
      col.classList.add('col', 'aos-init', 'aos-animate');
      // Apply delay based on index for desktop view, mimicking original HTML
      const delayIndex = itemIndex % 3; // 0, 1, 2, 0, 1, 2...
      const delays = [100, 400, 700];
      col.setAttribute('data-aos', 'fade-up');
      col.setAttribute('data-aos-delay', delays[delayIndex]);

      const wrap = document.createElement('div');
      wrap.classList.add('wrap');

      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim() || img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageDiv.appendChild(optimizedPic);
        }
      }
      wrap.appendChild(imageDiv);

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      titleDiv.textContent = titleCell.textContent.trim();
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        if (iconImg) {
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
          moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
          titleDiv.appendChild(optimizedIcon);
        }
      }
      wrap.appendChild(titleDiv);

      const link = document.createElement('a');
      link.classList.add('stretched-link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      }
      wrap.appendChild(link);
      moveInstrumentation(sourceRow, wrap); // Instrumentation for the whole item row
      col.appendChild(wrap);
      return col;
    };

    // Append to desktop view
    const desktopItem = createItemElement(row, index);
    desktopRow.appendChild(desktopItem);

    // Append to mobile view (3 items per slide)
    if (currentMobileRow.children.length >= 3) {
      currentMobileSlideGroup = document.createElement('div');
      currentMobileSlideGroup.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlideGroup.appendChild(currentMobileRow);
      mobileSlider.appendChild(currentMobileSlideGroup);
    }
    const mobileItem = createItemElement(row, index); // Create a new item for mobile
    currentMobileRow.appendChild(mobileItem);
  });

  desktopContainer.appendChild(desktopRow);
  ourBusinessVerticals.appendChild(desktopContainer);

  mobileContainer.appendChild(mobileSlider);
  ourBusinessVerticals.appendChild(mobileContainer);

  section.appendChild(ourBusinessVerticals);

  block.replaceWith(section);

  // Initialize Flickity after elements are in DOM
  // Note: Flickity is a third-party library. In a real scenario, you'd ensure it's loaded
  // and then initialize it. For EDS, we only output the HTML structure and data-attributes.
  // The actual JS initialization would happen in a separate script.
}
