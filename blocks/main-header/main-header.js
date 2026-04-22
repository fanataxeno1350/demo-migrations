import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Added class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
    // Apply classes to nested <li> elements if they exist in the original HTML structure
    if (li.parentElement.classList.contains('sub-nav-wrap') || li.parentElement.classList.contains('has-sub-child')) {
      li.classList.add('top-level-li'); // Example class from ORIGINAL HTML
      if (li.querySelector('.has-sub-child')) {
        li.classList.add('first-level-li'); // Example class from ORIGINAL HTML
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logoLink, year80Logo, year80LogoLink
  const logoRow = children.find((row) => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = children.find((row) => row.querySelector('a') && row.previousElementSibling?.querySelector('picture') === logoRow?.querySelector('picture'));
  const year80LogoRow = children.find((row) => row.querySelector('picture') && row.nextElementSibling?.querySelector('a') && row.querySelector('picture') !== logoRow?.querySelector('picture'));
  const year80LogoLinkRow = children.find((row) => row.querySelector('a') && row.previousElementSibling?.querySelector('picture') === year80LogoRow?.querySelector('picture'));

  const itemRows = children.filter(
    (row) =>
      row !== logoRow && row !== logoLinkRow && row !== year80LogoRow && row !== year80LogoLinkRow,
  );

  // Create main header structure
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');

  const headerWrap = document.createElement('div');
  headerWrap.classList.add('wrap');

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '#';
  }
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      logoLink.appendChild(optimizedPic);
    }
  }
  if (logoRow) moveInstrumentation(logoRow, logoLink);
  logoDiv.appendChild(logoLink);

  // Hamburger menu
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.appendChild(document.createElement('li'));
  }
  hamburgerDiv.appendChild(hamburgerUl);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');

  // Separate item rows by type
  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3); // Not used in current rendering logic, but kept for completeness
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      iconCell,
      hierarchyCell,
      megaMenuHeadingCell,
      megaMenuDescCell,
      megaMenuSubDescCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    li.appendChild(anchor);

    const iconSpan = document.createElement('span');
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconSpan.appendChild(optimizedPic);
      }
    }
    li.appendChild(iconSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = megaMenuHeadingCell.textContent.trim();
    heading.appendChild(headingAnchor);
    leftDiv.appendChild(heading);

    const desc = document.createElement('p');
    desc.classList.add('left-div-desc');
    desc.textContent = megaMenuDescCell.textContent.trim();
    leftDiv.appendChild(desc);

    const subDesc = document.createElement('p');
    subDesc.classList.add('left-div-subdesc');
    subDesc.textContent = megaMenuSubDescCell.textContent.trim();
    leftDiv.appendChild(subDesc);

    centerDiv.appendChild(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    if (labelCell.textContent.trim().toLowerCase() === 'who we are') {
      subNavWrap.classList.add('about-us-sub-nav');
    } else if (labelCell.textContent.trim().toLowerCase() === 'what we do') {
      subNavWrap.classList.add('what-we-do');
    } else if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
      subNavWrap.classList.add('element-block');
    } else if (labelCell.textContent.trim().toLowerCase() === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');

      const slidesDiv = document.createElement('div');
      slidesDiv.classList.add('slides');
      const slidesWrap = document.createElement('div');
      slidesWrap.classList.add('wrap');

      pressReleaseItems.forEach((prRow) => {
        const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...prRow.children];

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        const prP = document.createElement('p');
        const prAnchor = document.createElement('a');
        const foundPrLink = prLinkCell.querySelector('a');
        if (foundPrLink) {
          prAnchor.href = foundPrLink.href;
        } else {
          prAnchor.href = '#';
        }
        prAnchor.textContent = prTitleCell.textContent.trim();
        moveInstrumentation(prLinkCell, prAnchor);
        prP.appendChild(prAnchor);
        descDiv.appendChild(prP);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = prDateCell.textContent.trim();
        dateDiv.appendChild(dateEm);
        const categoryEm = document.createElement('em');
        categoryEm.textContent = prCategoryCell.textContent.trim();
        dateDiv.appendChild(categoryEm);
        descDiv.appendChild(dateDiv);
        contentDiv.appendChild(descDiv);
        slidesWrap.appendChild(contentDiv);
      });
      slidesDiv.appendChild(slidesWrap);
      latestPressReleaseDiv.appendChild(slidesDiv);
      leftDiv.appendChild(latestPressReleaseDiv);
    } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
      leftDiv.classList.add('career-left-div');
      subNavWrap.classList.add('careers-div');
    }

    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
    moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      // Apply classes to nested elements from ORIGINAL HTML
      hierarchyRoot.querySelectorAll('li').forEach(liElement => {
        liElement.classList.add('top-level-li'); // Example class from ORIGINAL HTML
        if (liElement.querySelector('ul')) {
          liElement.classList.add('first-level-li'); // Example class from ORIGINAL HTML
        }
      });
      hierarchyRoot.querySelectorAll('a').forEach(aElement => {
        // Add any specific classes for anchors if needed from ORIGINAL HTML
      });
      subNavWrap.appendChild(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }
    centerDiv.appendChild(subNavWrap);
    megaMenuWrap.appendChild(centerDiv);
    megaMenu.appendChild(megaMenuWrap);
    li.appendChild(megaMenu);

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
    });

    navUl.appendChild(li);
  });

  nav.appendChild(navUl);

  // Icon Navigation (mobile and desktop)
  const createIconNav = (isMobile) => {
    const iconNavDiv = document.createElement('div');
    iconNavDiv.classList.add('icon-nav');
    if (isMobile) {
      iconNavDiv.classList.add('mobile-menus-icon');
    } else {
      iconNavDiv.classList.add('desktop-menus-icon');
    }

    const iconNavUl = document.createElement('ul');

    // Contact Us link
    const mailLi = document.createElement('li');
    mailLi.classList.add('mail');
    const mailLink = document.createElement('a');
    mailLink.href = 'https://www.mahindra.com/contact-us';
    if (isMobile) {
      mailLink.textContent = 'Contact Us';
    } else {
      const mailIcon = document.createElement('img');
      mailIcon.alt = 'svg file';
      // Use a placeholder or retrieve from block if available
      mailIcon.src = '/icons/mail.svg'; // Placeholder
      mailLink.appendChild(mailIcon);
    }
    mailLi.appendChild(mailLink);
    iconNavUl.appendChild(mailLi);

    // Search functionality
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.setAttribute('data-once', 'search-stop-propagation');

    const searchIcon1 = document.createElement('img');
    searchIcon1.alt = 'svg file';
    searchIcon1.src = '/icons/search.svg'; // Placeholder
    searchLink.appendChild(searchIcon1);

    const searchIcon2 = document.createElement('img');
    searchIcon2.alt = 'svg file';
    searchIcon2.src = '/icons/close.svg'; // Placeholder
    searchLink.appendChild(searchIcon2);

    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      searchLink.appendChild(searchSpan);
    }
    searchLi.appendChild(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation');

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/icons/search.svg'; // Placeholder
    searchIconDiv.appendChild(searchIconImg);
    searchInputWrap.appendChild(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchInputWrap.appendChild(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitLabel.textContent = ' Submit ';
    submitButton.appendChild(submitLabel);
    const submitIcon = document.createElement('img');
    submitIcon.alt = 'svg file';
    submitIcon.src = '/icons/arrow-right.svg'; // Placeholder
    submitButton.appendChild(submitIcon);
    searchInputWrap.appendChild(submitButton);
    searchForm.appendChild(searchInputWrap);

    // Add dummy search result and suggestions
    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.appendChild(searchResultBox);

    const searchSuggestionsWrap1 = document.createElement('div');
    searchSuggestionsWrap1.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
    const label1 = document.createElement('div');
    label1.classList.add('label');
    label1.setAttribute('data-once', 'search-stop-propagation');
    label1.textContent = 'Popular Keywords:';
    searchSuggestionsWrap1.appendChild(label1);
    const tokensWrap1 = document.createElement('div');
    tokensWrap1.classList.add('tokens-wrap');
    tokensWrap1.setAttribute('data-once', 'search-stop-propagation');
    const ul1 = document.createElement('ul');
    ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = text;
      ul1.appendChild(li);
    });
    tokensWrap1.appendChild(ul1);
    searchSuggestionsWrap1.appendChild(tokensWrap1);
    searchWrapInner.appendChild(searchSuggestionsWrap1);

    const searchSuggestionsWrap2 = document.createElement('div');
    searchSuggestionsWrap2.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
    const label2 = document.createElement('div');
    label2.classList.add('label');
    label2.setAttribute('data-once', 'search-stop-propagation');
    label2.textContent = 'Recommended for you:';
    searchSuggestionsWrap2.appendChild(label2);
    const tokensWrap2 = document.createElement('div');
    tokensWrap2.classList.add('tokens-wrap');
    tokensWrap2.setAttribute('data-once', 'search-stop-propagation');
    const ul2 = document.createElement('ul');
    ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = text;
      ul2.appendChild(li);
    });
    tokensWrap2.appendChild(ul2);
    searchSuggestionsWrap2.appendChild(tokensWrap2);
    searchWrapInner.appendChild(searchSuggestionsWrap2);

    searchScreenWrap.appendChild(searchForm);
    searchScreenWrap.appendChild(searchWrapInner);
    searchLi.appendChild(searchScreenWrap);
    iconNavUl.appendChild(searchLi);

    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      searchLi.classList.toggle('active');
    });

    iconNavDiv.appendChild(iconNavUl); // Append the ul to the div
    return iconNavDiv;
  };

  const mobileIconNav = createIconNav(true);
  navUl.appendChild(mobileIconNav);

  const desktopIconNav = createIconNav(false);
  nav.appendChild(desktopIconNav);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const foundYear80LogoLink = year80LogoLinkRow?.querySelector('a');
  if (foundYear80LogoLink) {
    year80LogoLink.href = foundYear80LogoLink.href;
  } else {
    year80LogoLink.href = '#';
  }
  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      year80LogoLink.appendChild(optimizedPic);
    }
  }
  if (year80LogoRow) moveInstrumentation(year80LogoRow, year80LogoLink);
  year80LogoDiv.appendChild(year80LogoLink);

  // Append all to headerWrap
  headerWrap.appendChild(logoDiv);
  headerWrap.appendChild(hamburgerDiv);
  headerWrap.appendChild(nav);
  headerWrap.appendChild(year80LogoDiv);
  headerContainer.appendChild(headerWrap);

  block.innerHTML = '';
  block.appendChild(headerContainer);

  // Add event listener for hamburger menu
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });
}
