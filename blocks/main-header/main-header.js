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
      subWrap.classList.add('has-sub-child'); // From ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // From ORIGINAL HTML
          subWrap.classList.toggle('active'); // From ORIGINAL HTML
        });
      }
    }
    // Apply classes to nested elements if they exist
    if (li.querySelector('ul')) {
      li.classList.add('top-level-li'); // From ORIGINAL HTML
      li.querySelectorAll('ul').forEach(ul => ul.classList.add('has-sub-child')); // From ORIGINAL HTML
      li.querySelectorAll('li').forEach(nestedLi => {
        if (nestedLi.querySelector('ul')) {
          nestedLi.classList.add('first-level-li'); // From ORIGINAL HTML
          nestedLi.querySelectorAll('ul').forEach(innerUl => innerUl.classList.add('has-inner-sub-child')); // From ORIGINAL HTML
        }
      });
    }
  });
}

export default function decorate(block) {
  const [
    mainLogoRow,
    mainLogoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block

  const header = document.createElement('header');
  header.classList.add('main-header'); // Do not add state classes like 'nav-up'
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const mainLogoLink = document.createElement('a');
  mainLogoLink.href = mainLogoLinkRow?.querySelector('a')?.href || '#';
  const mainLogoPicture = mainLogoRow?.querySelector('picture');
  if (mainLogoPicture) {
    const mainLogoImg = mainLogoPicture.querySelector('img');
    const optimizedMainLogo = createOptimizedPicture(
      mainLogoImg.src,
      mainLogoImg.alt,
      false,
      [{ width: '200' }],
    );
    optimizedMainLogo.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(mainLogoPicture, optimizedMainLogo.querySelector('img'));
    mainLogoLink.append(optimizedMainLogo);
  }
  moveInstrumentation(mainLogoRow, mainLogoLink);
  logoDiv.append(mainLogoLink);
  wrap.append(logoDiv);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  nav.append(navUl);

  // Filter item rows based on their structure
  const navigationItems = itemRows.filter((row) => row.children.length === 7 && row.querySelector('ul'));
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3);
  const searchItems = itemRows.filter((row) => row.children.length === 7 && row.querySelector('form') === null); // Exclude search items that have a form in the original HTML
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);


  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      iconCell,
      hierarchyTreeCell,
      headingCell,
      descriptionCell,
      subDescriptionCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const linkAnchor = document.createElement('a');
    linkAnchor.setAttribute('itemprop', 'url');
    linkAnchor.href = linkCell?.querySelector('a')?.href || '#';
    linkAnchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, linkAnchor);
    li.append(linkAnchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      const span = document.createElement('span');
      span.append(optimizedIcon);
      li.append(span);
    }

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = headingCell?.textContent.trim() || '';
    heading.append(headingAnchor);
    leftDiv.append(heading);

    const description = document.createElement('p');
    description.classList.add('left-div-desc');
    description.textContent = descriptionCell?.textContent.trim() || '';
    leftDiv.append(description);

    const subDescription = document.createElement('p');
    subDescription.classList.add('left-div-subdesc');
    subDescription.textContent = subDescriptionCell?.textContent.trim() || '';
    leftDiv.append(subDescription);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    centerDiv.append(subNavWrap);

    const hierarchyRoot = hierarchyTreeCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv);

      // Apply classes to the nested elements
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap-one-link')); // Example class from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liItem => {
        liItem.classList.add('list-item'); // Example class from ORIGINAL HTML
        if (liItem.querySelector('ul')) {
          liItem.classList.add('top-level-li'); // Example class from ORIGINAL HTML
        }
      });
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item')); // Example class from ORIGINAL HTML

      // Move the processed content to the subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap); // Apply the nested list transformation and event listeners
    }

    li.append(megaMenu);
    navUl.append(li);
    moveInstrumentation(row, li);
  });

  // Contact links
  const mobileMenusIcon = document.createElement('div');
  mobileMenusIcon.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  mobileMenusIcon.append(mobileUl);

  contactLinkItems.forEach((row) => {
    const [linkCell, labelCell, iconCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('mail');
    const link = document.createElement('a');
    link.href = linkCell?.querySelector('a')?.href || '#';
    link.textContent = labelCell?.textContent.trim() || '';

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      link.prepend(optimizedIcon);
    }
    li.append(link);
    mobileUl.append(li);
    moveInstrumentation(row, li);
  });

  // Search items
  searchItems.forEach((row) => {
    const [
      iconCell,
      placeholderCell,
      submitLabelCell,
      popularKeywordsLabelCell,
      recommendedForYouLabelCell,
      popularKeywordsCell,
      recommendedKeywordsCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('search');

    const searchTrigger = document.createElement('a');
    searchTrigger.href = '#';

    const searchIconPicture = iconCell?.querySelector('picture');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      searchTrigger.append(optimizedSearchIcon);
      // Assuming there's a second icon for close state, if not, adjust
      const closeIcon = optimizedSearchIcon.cloneNode(true);
      searchTrigger.append(closeIcon);
    }

    const searchSpan = document.createElement('span');
    searchSpan.textContent = ' Search';
    searchTrigger.append(searchSpan);
    li.append(searchTrigger);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    const searchWrap = document.createElement('div');
    searchWrap.classList.add('wrap');
    searchScreenWrap.append(searchWrap);

    const form = document.createElement('form');
    form.action = '/search'; // Example action, adjust if needed
    form.method = 'get';
    form.id = 'search-block-form'; // From ORIGINAL HTML
    searchWrap.append(form);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    form.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      searchIconDiv.append(optimizedSearchIcon);
    }
    searchInputWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = placeholderCell?.textContent.trim() || '';
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = submitLabelCell?.textContent.trim() || 'Submit';
    submitButton.append(submitLabel);
    // Assuming an icon for submit button, if not, remove
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      submitButton.append(optimizedSearchIcon.cloneNode(true));
    }
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none'; // Initially hidden
    form.append(searchResultBox);

    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = popularKeywordsLabelCell?.textContent.trim() || 'Popular Keywords:';
    popularKeywordsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || '';
    popularKeywordsWrap.append(popularTokensWrap);
    searchWrap.append(popularKeywordsWrap);

    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent =
      recommendedForYouLabelCell?.textContent.trim() || 'Recommended for you:';
    recommendedKeywordsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || '';
    recommendedKeywordsWrap.append(recommendedTokensWrap);
    searchWrap.append(recommendedKeywordsWrap);

    li.append(searchScreenWrap);
    mobileUl.append(li);
    moveInstrumentation(row, li);

    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('show');
      li.classList.toggle('active');
    });
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
        li.classList.remove('active');
      }
    });
  });

  navUl.append(mobileMenusIcon);

  // Desktop contact and search icons
  const desktopMenusIcon = document.createElement('div');
  desktopMenusIcon.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  desktopMenusIcon.append(desktopUl);

  // Re-use contactLinkItems for desktop
  contactLinkItems.forEach((row) => {
    const [linkCell, labelCell, iconCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('mail');
    const link = document.createElement('a');
    link.href = linkCell?.querySelector('a')?.href || '#';

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      link.append(optimizedIcon);
    }
    li.append(link);
    desktopUl.append(li);
    moveInstrumentation(row, li);
  });

  // Re-use searchItems for desktop
  searchItems.forEach((row) => {
    const [
      iconCell,
      placeholderCell,
      submitLabelCell,
      popularKeywordsLabelCell,
      recommendedForYouLabelCell,
      popularKeywordsCell,
      recommendedKeywordsCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('search');

    const searchTrigger = document.createElement('a');
    searchTrigger.href = '#';

    const searchIconPicture = iconCell?.querySelector('picture');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      searchTrigger.append(optimizedSearchIcon);
      const closeIcon = optimizedSearchIcon.cloneNode(true);
      searchTrigger.append(closeIcon);
    }
    li.append(searchTrigger);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    const searchWrap = document.createElement('div');
    searchWrap.classList.add('wrap');
    searchScreenWrap.append(searchWrap);

    const form = document.createElement('form');
    form.action = '/search';
    form.method = 'get';
    form.id = 'search-block-form'; // From ORIGINAL HTML
    searchWrap.append(form);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    form.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      searchIconDiv.append(optimizedSearchIcon);
    }
    searchInputWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInputDesktop';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = placeholderCell?.textContent.trim() || '';
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = submitLabelCell?.textContent.trim() || 'Submit';
    submitButton.append(submitLabel);
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconPicture, optimizedSearchIcon.querySelector('img'));
      submitButton.append(optimizedSearchIcon.cloneNode(true));
    }
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    form.append(searchResultBox);

    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = popularKeywordsLabelCell?.textContent.trim() || 'Popular Keywords:';
    popularKeywordsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || '';
    popularKeywordsWrap.append(popularTokensWrap);
    searchWrap.append(popularKeywordsWrap);

    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent =
      recommendedForYouLabelCell?.textContent.trim() || 'Recommended for you:';
    recommendedKeywordsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || '';
    recommendedKeywordsWrap.append(recommendedTokensWrap);
    searchWrap.append(recommendedKeywordsWrap);

    li.append(searchScreenWrap);
    desktopUl.append(li);
    moveInstrumentation(row, li);

    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('show');
      li.classList.toggle('active');
    });
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
        li.classList.remove('active');
      }
    });
  });

  navUl.append(desktopMenusIcon);

  // Press Release items (added missing logic)
  if (pressReleaseItems.length > 0) {
    const newsroomLi = navUl.querySelector('.newsroom-left-div')?.closest('li');
    if (newsroomLi) {
      const latestTwoPressReleaseDiv = newsroomLi.querySelector('.latest-two-press-release');
      if (latestTwoPressReleaseDiv) {
        pressReleaseItems.forEach((row) => {
          const [
            linkCell,
            titleCell,
            dateCell,
            categoryCell,
          ] = [...row.children];

          const slidesDiv = document.createElement('div');
          slidesDiv.classList.add('slides');
          const slideWrap = document.createElement('div');
          slideWrap.classList.add('wrap');
          slidesDiv.append(slideWrap);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          slideWrap.append(contentDiv);

          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          contentDiv.append(descDiv);

          const titleP = document.createElement('p');
          const titleLink = document.createElement('a');
          titleLink.href = linkCell?.querySelector('a')?.href || '#';
          titleLink.textContent = titleCell?.textContent.trim() || '';
          titleP.append(titleLink);
          descDiv.append(titleP);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const dateEm = document.createElement('em');
          dateEm.textContent = dateCell?.textContent.trim() || '';
          const categoryEm = document.createElement('em');
          categoryEm.textContent = categoryCell?.textContent.trim() || '';
          dateDiv.append(dateEm, categoryEm);
          descDiv.append(dateDiv);

          latestTwoPressReleaseDiv.append(slidesDiv);
          moveInstrumentation(row, slidesDiv);
        });
      }
    }
  }

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow?.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow?.querySelector('picture');
  if (year80LogoPicture) {
    const year80LogoImg = year80LogoPicture.querySelector('img');
    const optimizedYear80Logo = createOptimizedPicture(
      year80LogoImg.src,
      year80LogoImg.alt,
      false,
      [{ width: '74' }],
    );
    optimizedYear80Logo.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(year80LogoPicture, optimizedYear80Logo.querySelector('img'));
    year80LogoLink.append(optimizedYear80Logo);
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.append(header);

  // Hamburger menu toggle logic
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}

