import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Map the first 8 rows to specific fields based on BlockJson structure
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const logoLinkLabelRow = children[2];
  const year80LogoRow = children[3];
  const year80LogoLinkRow = children[4];
  const year80LogoLinkLabelRow = children[5];
  const contactUsLinkRow = children[6];
  const contactUsLinkLabelRow = children[7];

  // Remaining rows are nav items
  const navItemRows = children.slice(8);

  block.textContent = '';

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a state class, not initial.

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
  const logoLinkHref = logoLinkRow.querySelector('a')?.href;
  if (logoLinkHref) {
    logoLink.href = logoLinkHref;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    logoLink.querySelector('img').classList.add('hiddenlogo1');
    logoLink.querySelector('img').width = 200;
    logoLink.querySelector('img').height = 30;
    logoLink.querySelector('img').style.width = 'auto';
    logoLink.querySelector('img').loading = 'lazy';
    logoLink.querySelector('img').title = logoLinkLabelRow.textContent.trim();
  }
  moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  [...Array(3)].forEach(() => hamburgerUl.append(document.createElement('li')));
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  navItemRows.forEach((row) => {
    const [labelCell, linkCell, linkLabelCell, subLinksCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = linkLabelCell.textContent.trim();
    li.append(anchor);

    const subList = subLinksCell?.querySelector('ul');
    if (subList) {
      const span = document.createElement('span');
      const svgImg = document.createElement('img');
      svgImg.alt = 'svg file';
      // The original SVG is hardcoded in the HTML, so we'll create a placeholder.
      // In a real scenario, this SVG would ideally come from a dedicated field in the model.
      svgImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy40MnoiLz48L3N2Zz4='; // Placeholder SVG
      span.append(svgImg);
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap'); // Add specific classes if needed based on original HTML context
      subNavWrap.innerHTML = subLinksCell.innerHTML; // Move content directly

      // Transform nested lists if any
      const transformNestedLists = (rootUl) => {
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
      };
      subNavWrap.querySelectorAll('ul').forEach(transformNestedLists);

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);

      // Toggle functionality for mega menu
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
      });
    }
    moveInstrumentation(row, li);
    navUl.append(li);
  });

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  const contactUsLinkHref = contactUsLinkRow.querySelector('a')?.href;
  if (contactUsLinkHref) {
    mailLinkMobile.href = contactUsLinkHref;
  }
  mailLinkMobile.textContent = contactUsLinkLabelRow.textContent.trim();
  mailLiMobile.append(mailLinkMobile);
  mobileIconUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  const searchImgMobile = document.createElement('img');
  searchImgMobile.alt = 'svg file';
  searchImgMobile.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy40MnoiLz48L3N2Zz4='; // Placeholder SVG
  searchLinkMobile.append(searchImgMobile);
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.textContent = ' Search';
  searchLinkMobile.append(searchSpanMobile);
  searchLiMobile.append(searchLinkMobile);
  mobileIconUl.append(searchLiMobile);
  mobileIconNav.append(mobileIconUl);
  mainNav.append(mobileIconNav);

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  if (contactUsLinkHref) {
    mailLinkDesktop.href = contactUsLinkHref;
  }
  const mailImgDesktop = document.createElement('img');
  mailImgDesktop.alt = 'svg file';
  mailImgDesktop.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy40MnoiLz48L3N2Zz4='; // Placeholder SVG
  mailLinkDesktop.append(mailImgDesktop);
  mailLiDesktop.append(mailLinkDesktop);
  desktopIconUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  const searchImgDesktop = document.createElement('img');
  searchImgDesktop.alt = 'svg file';
  searchImgDesktop.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy.4MnoiLz48L3N2Zz4='; // Placeholder SVG
  searchLinkDesktop.append(searchImgDesktop);
  searchLiDesktop.append(searchLinkDesktop);
  desktopIconUl.append(searchLiDesktop);
  desktopIconNav.append(desktopIconUl);
  mainNav.append(desktopIconNav);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoLinkHref = year80LogoLinkRow.querySelector('a')?.href;
  if (year80LogoLinkHref) {
    year80LogoLink.href = year80LogoLinkHref;
  }
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
    year80LogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    year80LogoLink.querySelector('img').width = 74;
    year80LogoLink.querySelector('img').height = 60;
    year80LogoLink.querySelector('img').loading = 'lazy';
    year80LogoLink.querySelector('img').title = year80LogoLinkLabelRow.textContent.trim();
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.append(header);

  // Add event listeners for hamburger menu toggle
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Add event listeners for search functionality
  const searchElements = block.querySelectorAll('.search');
  searchElements.forEach((searchLi) => {
    const searchLink = searchLi.querySelector('a');
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.innerHTML = `
      <div class="wrap">
        <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
          <div class="search-wrap">
            <div class="search-icon">
              <img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy40MnoiLz48L3N2Zz4="/>
            </div>
            <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
            <button class="submit-button">
              <div class="label"> Submit </div>
              <img alt="svg file" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNNi4wMyAzLjQyYy40LS40LjktLjYgMS40LS42cy45LjIgMS4zLjZsNC43IDQuNy43LjctLjcuN0wxMC40IDEzLjZjLS40LjQtLjkuNi0xLjMuNnMtLjktLjItMS4zLS42LTYuNy02LjctNi43LTYuN2MtLjQtLjQtLjYtLjktLjYtMS4zcy4yLS45LjYtMS4zTDYuMDMgMy40MnoiLz48L3N2Zz4="/>
            </button>
          </div>
          <div class="searchResultBox" style="display: none;">
            <div class="swiper scrollSwiper">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                </div>
              </div>
            </div>
            <div class="swiper-scrollbar"></div>
          </div>
        </form>
        <div class="search-suggestions-wrap">
          <div class="label">Popular Keywords:</div>
          <div class="tokens-wrap">
            <ul>
              <li>Business</li>
              <li>FY 21</li>
              <li>Brands</li>
              <li>XUV700</li>
              <li>Global</li>
              <li>Nanhi Kali</li>
            </ul>
          </div>
        </div>
        <div class="search-suggestions-wrap">
          <div class="label">Recommended for you:</div>
          <div class="tokens-wrap">
            <ul>
              <li>Annual Report 2021 - 2022</li>
              <li>Leadership Announcement</li>
              <li>Latest Press Release</li>
              <li>Brand Guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    searchLi.append(searchScreenWrap);

    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchLi.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
      // Close hamburger menu if open
      mainNav.classList.remove('active');
      hamburger.classList.remove('active');
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchLi.contains(e.target) && searchLi.classList.contains('active')) {
        searchLi.classList.remove('active');
        searchScreenWrap.classList.remove('active');
      }
    });

    // Prevent propagation for elements within search screen to keep it open
    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
