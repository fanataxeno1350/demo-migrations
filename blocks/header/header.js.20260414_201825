import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    logoLinkLabelRow,
    year80LogoRow,
    year80LogoLinkRow,
    year80LogoLinkLabelRow,
    ...navItemRows
  ] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'solid'); // nav-up is a scroll state class, do not add initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
  } else {
    logoLink.textContent = logoLinkLabelRow.textContent.trim();
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  moveInstrumentation(logoLinkLabelRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  navItemRows.forEach((row) => {
    const cells = [...row.children];
    // Use content detection for cells based on BlockJson types
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() === row.children[0].textContent.trim());
    const linkCell = cells.find(cell => cell.querySelector('a') && cell.textContent.trim() === row.children[1].textContent.trim());
    const linkLabelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() === row.children[2].textContent.trim());
    const subLinksCell = cells.find(cell => cell.innerHTML.includes('<p>') || cell.innerHTML.includes('<ul>'));

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const subList = subLinksCell?.querySelector('ul');
    const hasSubChild = subList || (subLinksCell && subLinksCell.textContent.trim()); // Check for actual content or ul
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = linkLabelCell?.textContent.trim() || labelCell.textContent.trim();
    anchor.setAttribute('itemprop', 'url');
    li.setAttribute('itemprop', 'name');

    if (hasSubChild) {
      li.classList.add('has-child', 'hover-red');
      li.append(anchor);

      const span = document.createElement('span');
      // This SVG is hardcoded in the original HTML, but not provided in the model.
      // We will create a generic arrow icon.
      const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgIcon.setAttribute('viewBox', '0 0 24 24');
      svgIcon.setAttribute('fill', 'currentColor');
      svgIcon.setAttribute('width', '1em');
      svgIcon.setAttribute('height', '1em');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z');
      svgIcon.append(path);
      span.append(svgIcon);
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      centerDiv.append(subNavWrap);

      if (subList) {
        subNavWrap.append(subList);
        // Transform nested lists if any
        function transformNestedLists(rootUl) {
          rootUl.querySelectorAll('li').forEach(itemLi => {
            const nested = itemLi.querySelector(':scope > ul');
            if (nested) {
              nested.remove();
              const subWrap = document.createElement('div');
              subWrap.classList.add('has-sub-child');
              subWrap.append(nested);
              itemLi.append(subWrap);

              const trigger = itemLi.querySelector(':scope > a') || itemLi;
              trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                itemLi.classList.toggle('active');
                subWrap.classList.toggle('active');
              });
            }
          });
        }
        transformNestedLists(subList);

        // Toggle mega menu on click
        li.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          megaMenu.classList.toggle('active');
        });
      } else if (subLinksCell && subLinksCell.textContent.trim()) {
        // If it's rich text but not a UL, treat as a simple content block
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-div');
        leftDiv.innerHTML = subLinksCell.innerHTML; // Preserve rich text formatting
        centerDiv.prepend(leftDiv);

        // If there's rich text content, the parent li should also toggle the mega menu
        li.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          megaMenu.classList.toggle('active');
        });
      }
      li.append(megaMenu);
    } else {
      li.append(anchor);
    }
    navUl.append(li);
  });

  // Icon Nav (Mobile and Desktop)
  const createIconNav = (isMobile) => {
    const iconNav = document.createElement('div');
    iconNav.classList.add('icon-nav', isMobile ? 'mobile-menus-icon' : 'desktop-menus-icon');
    const iconUl = document.createElement('ul');

    // Contact Us
    const contactLi = document.createElement('li');
    contactLi.classList.add('mail');
    const contactLink = document.createElement('a');
    contactLink.href = 'https://www.mahindra.com/contact-us';
    if (isMobile) {
      contactLink.textContent = 'Contact Us';
    } else {
      const contactImg = document.createElement('img');
      contactImg.alt = 'svg file';
      contactImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776176653641.svg+xml'; // Example path, should come from model if possible
      contactLink.append(contactImg);
    }
    contactLi.append(contactLink);
    iconUl.append(contactLi);

    // Search
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    const searchLink = document.createElement('a');
    searchLink.href = '#';
    const searchIcon1 = document.createElement('img');
    searchIcon1.alt = 'svg file';
    searchIcon1.src = '/content/dam/aemigrate/uploaded-folder/image/1776176653201.svg+xml';
    const searchIcon2 = document.createElement('img');
    searchIcon2.alt = 'svg file';
    searchIcon2.src = '/content/dam/aemigrate/uploaded-folder/image/1776176653349.svg+xml';
    searchLink.append(searchIcon1, searchIcon2);
    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.textContent = ' Search';
      searchLink.append(searchSpan);
    }
    searchLi.append(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776176653454.svg+xml';
    searchIconDiv.append(searchIconImg);
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = 'Submit';
    const submitIcon = document.createElement('img');
    submitIcon.alt = 'svg file';
    submitIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776176653588.svg+xml';
    submitButton.append(submitLabel, submitIcon);
    searchInputWrap.append(searchIconDiv, searchInput, submitButton);
    searchForm.append(searchInputWrap);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Initial state
    // Add swiper structure if needed, but EDS doesn't load swiper JS.
    searchForm.append(searchResultBox);

    searchWrapInner.append(searchForm);

    const createSuggestions = (label, keywords) => {
      const suggestionsWrap = document.createElement('div');
      suggestionsWrap.classList.add('search-suggestions-wrap');
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.textContent = label;
      const tokensWrap = document.createElement('div');
      tokensWrap.classList.add('tokens-wrap');
      const keywordsUl = document.createElement('ul');
      keywords.forEach(keyword => {
        const keywordLi = document.createElement('li');
        keywordLi.textContent = keyword;
        keywordsUl.append(keywordLi);
      });
      tokensWrap.append(keywordsUl);
      suggestionsWrap.append(labelDiv, tokensWrap);
      return suggestionsWrap;
    };

    searchWrapInner.append(
      createSuggestions('Popular Keywords:', ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali']),
      createSuggestions('Recommended for you:', ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines']),
    );
    searchLi.append(searchScreenWrap);
    iconUl.append(searchLi);
    iconNav.append(iconUl);

    // Search toggle behavior
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('show'); // Use 'show' class for visibility
    });
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
      }
    });

    return iconNav;
  };

  nav.append(createIconNav(true)); // Mobile icon nav
  nav.append(createIconNav(false)); // Desktop icon nav

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const foundYear80LogoLink = year80LogoLinkRow.querySelector('a');
  if (foundYear80LogoLink) {
    year80LogoLink.href = foundYear80LogoLink.href;
  }
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
  } else {
    year80LogoLink.textContent = year80LogoLinkLabelRow.textContent.trim();
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkLabelRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  // Hamburger click behavior
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Add no-scroll to body
  });

  block.textContent = '';
  block.append(header);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
