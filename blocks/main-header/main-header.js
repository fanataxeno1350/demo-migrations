import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML for <li> elements
    li.classList.add('nav-menu-item', 'list-item');

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML for <a> elements
    if (anchor) {
      anchor.classList.add('nav-menu-link');
    }

    // Normalize label-only nodes
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
      // Add classes from ORIGINAL HTML for <ul> elements
      nested.classList.add('sub-menu');
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are identified by their content type, not fixed index
  const logoRow = children.find(row => row.querySelector('picture') && !row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = children.find(row => row.querySelector('a') && row.previousElementSibling?.querySelector('picture'));
  const year80LogoRow = children.find(row => row.querySelector('picture') && row.classList.contains('year-80-logo')); // Assuming year-80-logo class is added by AEM
  const year80LogoLinkRow = children.find(row => row.querySelector('a') && row.previousElementSibling?.classList.contains('year-80-logo'));

  // Filter out the identified root rows to get itemRows
  const itemRows = children.filter(row =>
    row !== logoRow &&
    row !== logoLinkRow &&
    row !== year80LogoRow &&
    row !== year80LogoLinkRow
  );

  block.innerHTML = '';
  const header = document.createElement('header');
  header.classList.add('main-header'); // Start with neutral classes only

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
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  if (logoRow) moveInstrumentation(logoRow, logoDiv);
  if (logoLinkRow) moveInstrumentation(logoLinkRow, logoLink);
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

  // Item row filtering based on cell count as per BlockJson
  const navigationItems = itemRows.filter((row) => [...row.children].length === 7);
  const pressReleaseItems = itemRows.filter((row) => [...row.children].length === 4);
  const contactLinkItems = itemRows.filter((row) => [...row.children].length === 3);
  const searchSuggestionItems = itemRows.filter((row) => [...row.children].length === 1);

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const iconCell = cells[2];
    const hierarchyCell = cells[3];
    const sectionHeadingCell = cells[4];
    const sectionDescCell = cells[5];
    const sectionSubdescCell = cells[6];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const iconSpan = document.createElement('span');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      iconSpan.append(optimizedIcon);
      li.append(iconSpan);
    }

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = sectionHeadingCell.textContent.trim();
    heading.append(headingLink);
    leftDiv.append(heading);

    const desc = document.createElement('p');
    desc.classList.add('left-div-desc');
    desc.textContent = sectionDescCell.textContent.trim();
    leftDiv.append(desc);

    const subDesc = document.createElement('p');
    subDesc.classList.add('left-div-subdesc');
    subDesc.textContent = sectionSubdescCell.textContent.trim();
    leftDiv.append(subDesc);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      // Apply instrumentation before moving children
      moveInstrumentation(hierarchyCell, hierarchyRoot);
      subNavWrap.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }
    centerDiv.append(subNavWrap);
    li.append(megaMenu);
    navUl.append(li);

    moveInstrumentation(row, li); // Move instrumentation from the original row to the new li
  });

  // Press Release Items (example for newsroom)
  if (pressReleaseItems.length > 0) {
    const newsroomLi = navUl.querySelector('li.has-child a[href*="newsroom"]')?.closest('li');
    if (newsroomLi) {
      const newsroomLeftDiv = newsroomLi.querySelector('.newsroom-left-div');
      if (newsroomLeftDiv) {
        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');

        pressReleaseItems.slice(0, 2).forEach((row) => { // Take first two as per original HTML
          const cells = [...row.children];
          const titleCell = cells[0];
          const linkCell = cells[1];
          const dateCell = cells[2];
          const categoryCell = cells[3];

          const slideDiv = document.createElement('div');
          slideDiv.classList.add('slides');
          const wrapDiv = document.createElement('div');
          wrapDiv.classList.add('wrap');
          slideDiv.append(wrapDiv);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          wrapDiv.append(contentDiv);

          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          contentDiv.append(descDiv);

          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = linkCell.querySelector('a')?.href || '#';
          a.textContent = titleCell.textContent.trim();
          p.append(a);
          descDiv.append(p);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const emDate = document.createElement('em');
          emDate.textContent = dateCell.textContent.trim();
          const emCategory = document.createElement('em');
          emCategory.textContent = categoryCell.textContent.trim();
          dateDiv.append(emDate, emCategory);
          descDiv.append(dateDiv);

          latestPressReleaseDiv.append(slideDiv);
          moveInstrumentation(row, slideDiv);
        });
        newsroomLeftDiv.append(latestPressReleaseDiv);
      }
    }
  }


  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav); // Append to navUl for mobile display

  // Contact Links
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const iconCell = cells[2];

    const li = document.createElement('li');
    li.classList.add('mail'); // Assuming 'mail' is the class from original HTML
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    anchor.textContent = labelCell.textContent.trim();

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      anchor.prepend(optimizedIcon);
    }
    li.append(anchor);
    mobileIconUl.append(li);
    moveInstrumentation(row, li);
  });

  // Search functionality (mobile and desktop)
  const createSearchSection = (isMobile) => {
    const li = document.createElement('li');
    li.classList.add('search');
    const searchToggleLink = document.createElement('a');
    searchToggleLink.href = '#';
    const searchIcon = document.createElement('img');
    searchIcon.alt = 'svg file';
    searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776767280747.svg+xml'; // Example path, replace with actual
    const closeIcon = document.createElement('img');
    closeIcon.alt = 'svg file';
    closeIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776767280787.svg+xml'; // Example path, replace with actual
    searchToggleLink.append(searchIcon, closeIcon);

    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.textContent = ' Search';
      searchToggleLink.append(searchSpan);
      li.classList.add('mobile-search'); // Class from ORIGINAL HTML
    }

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = `search-block-form-${isMobile ? 'mobile' : 'desktop'}`;

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    const searchInputIcon = document.createElement('div');
    searchInputIcon.classList.add('search-icon');
    const searchInputImg = document.createElement('img');
    searchInputImg.alt = 'svg file';
    searchInputImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776767280834.svg+xml'; // Example path
    searchInputIcon.append(searchInputImg);
    searchInputWrap.append(searchInputIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = `searchInput-${isMobile ? 'mobile' : 'desktop'}`;
    searchInput.autocomplete = 'off';
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = ' Submit ';
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776767280876.svg+xml'; // Example path
    submitButton.append(submitLabel, submitImg);
    searchInputWrap.append(submitButton);
    searchForm.append(searchInputWrap);
    searchWrapInner.append(searchForm);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Hidden by default
    searchWrapInner.append(searchResultBox);

    const popularSuggestionsWrap = document.createElement('div');
    popularSuggestionsWrap.classList.add('search-suggestions-wrap'); // Class from ORIGINAL HTML
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = 'Popular Keywords:';
    popularSuggestionsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    const popularUl = document.createElement('ul');
    popularTokensWrap.append(popularUl);
    popularSuggestionsWrap.append(popularTokensWrap);
    searchWrapInner.append(popularSuggestionsWrap);

    const recommendedSuggestionsWrap = document.createElement('div');
    recommendedSuggestionsWrap.classList.add('search-suggestions-wrap'); // Class from ORIGINAL HTML
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedSuggestionsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    const recommendedUl = document.createElement('ul');
    recommendedTokensWrap.append(recommendedUl);
    recommendedSuggestionsWrap.append(recommendedTokensWrap);
    searchWrapInner.append(recommendedSuggestionsWrap);

    // Populate search suggestions
    searchSuggestionItems.forEach((row, index) => {
      const suggestionText = [...row.children][0]?.textContent.trim(); // Access cell by index
      if (suggestionText) {
        const suggestionLi = document.createElement('li');
        suggestionLi.textContent = suggestionText;
        // Distribute suggestions based on model (Popular vs Recommended)
        // Assuming the first 'search-suggestions-popular' items come first, then 'search-suggestions-recommended'
        // This is a heuristic based on the model structure, adjust if needed.
        if (index < 6) { // Heuristic: first 6 are popular, rest are recommended
          popularUl.append(suggestionLi);
        } else {
          recommendedUl.append(suggestionLi);
        }
      }
      moveInstrumentation(row, suggestionLi);
    });

    li.append(searchToggleLink, searchScreenWrap);

    // Event listener for search toggle
    searchToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('show');
      li.classList.toggle('active');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
        li.classList.remove('active');
      }
    });

    return li;
  };

  mobileIconUl.append(createSearchSection(true)); // Mobile search

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav); // Append to nav for desktop display

  // Contact Links for Desktop
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const iconCell = cells[2];

    const li = document.createElement('li');
    li.classList.add('mail');
    const anchor = document.createElement('a');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    // Desktop contact link does not have label text, only icon as per original HTML
    // anchor.textContent = labelCell.textContent.trim(); // Removed as per original HTML

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      anchor.append(optimizedIcon);
    }
    li.append(anchor);
    desktopIconUl.append(li);
    moveInstrumentation(row, li);
  });

  desktopIconUl.append(createSearchSection(false)); // Desktop search

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoAnchor = document.createElement('a');
  year80LogoAnchor.href = year80LogoLinkRow?.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoAnchor.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoAnchor);
  if (year80LogoRow) moveInstrumentation(year80LogoRow, year80LogoDiv);
  if (year80LogoLinkRow) moveInstrumentation(year80LogoLinkRow, year80LogoAnchor);
  wrap.append(year80LogoDiv);

  block.append(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
