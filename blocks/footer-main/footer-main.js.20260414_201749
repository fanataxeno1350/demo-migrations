import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first three rows for logo, logoLink, and logoLinkLabel
  // The remaining rows are footer sections
  const [logoRow, logoLinkRow, logoLinkLabelRow, ...footerSectionRows] = [...block.children];

  block.textContent = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const logoLinkHref = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.href = logoLinkHref;
  logoLink.textContent = logoLinkLabelRow.textContent.trim();
  moveInstrumentation(logoLinkRow, logoLink);
  moveInstrumentation(logoLinkLabelRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  moveInstrumentation(logoRow, logoDiv);

  // Social Wrap (from original HTML, not in EDS model)
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrapUl = document.createElement('ul');
  socialWrapUl.classList.add('social-wrap');
  socialCol.append(socialWrapUl);

  // Hardcoded social links from original HTML
  const socialLinks = [
    { class: 'fb', href: ' https://www.facebook.com/mahindrarise', imgSrc: '/content/dam/aemigrate/uploaded-folder/image/1776176655607.svg+xml', alt: 'svg file' },
    { class: 'tw', href: ' https://twitter.com/mahindrarise', imgSrc: '/content/dam/aemigrate/uploaded-folder/image/1776176655731.svg+xml', alt: 'svg file' },
    { class: 'inst', href: 'https://instagram.com/mahindrarise', imgSrc: '/content/dam/aemigrate/uploaded-folder/image/1776176655807.svg+xml', alt: 'svg file' },
    { class: 'yt', href: ' https://youtube.com/c/MahindraRise', imgSrc: '/content/dam/aemigrate/uploaded-folder/image/1776176656003.svg+xml', alt: 'svg file' },
    { class: 'in', href: 'https://www.linkedin.com/company/mahindragroup/', imgSrc: '/content/dam/aemigrate/uploaded-folder/image/1776176656061.svg+xml', alt: 'svg file' },
  ];

  socialLinks.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add(item.class);
    const a = document.createElement('a');
    a.href = item.href;
    a.target = '_blank';
    const img = document.createElement('img');
    img.alt = item.alt;
    img.src = item.imgSrc;
    a.append(img);
    li.append(a);
    socialWrapUl.append(li);
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  footerSectionRows.forEach((row) => {
    // Use content detection instead of index access for footer section rows
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul') && !cell.querySelector('p'));
    const linkCell = cells.find(cell => cell.querySelector('a') && cell.querySelector('a').href.includes('/content/site/link'));
    const linkLabelCell = cells.find(cell => cell !== labelCell && cell !== linkCell && !cell.querySelector('ul') && !cell.querySelector('p'));
    const sectionLinksCell = cells.find(cell => cell.querySelector('ul') || cell.querySelector('p'));

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    // Add specific classes if they exist in the original HTML based on content
    if (labelCell?.textContent.trim().toLowerCase() === 'what we do') {
      head.classList.add('what-we-do-footer-links');
    } else if (labelCell?.textContent.trim().toLowerCase() === 'careers') {
      head.classList.add('careers-footer-links');
    }
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const mainLink = document.createElement('a');
    const mainHref = linkCell?.querySelector('a')?.href || '#';
    mainLink.href = mainHref;
    mainLink.textContent = linkLabelCell?.textContent.trim() || labelCell?.textContent.trim();
    span.append(mainLink);
    moveInstrumentation(linkCell, mainLink);
    moveInstrumentation(linkLabelCell, mainLink);
    moveInstrumentation(labelCell, mainLink);

    const small = document.createElement('small');
    span.append(small);

    const sectionLinksUl = sectionLinksCell?.querySelector('ul');
    if (sectionLinksUl) {
      sectionLinksUl.classList.add('footer-inner-list');
      head.append(sectionLinksUl);
      transformNestedLists(sectionLinksUl);
    } else if (sectionLinksCell?.textContent.trim()) {
      // If it's just text, append it as a paragraph or similar, or ignore if it's not meant to be displayed
      const p = document.createElement('p');
      p.innerHTML = sectionLinksCell.innerHTML;
      head.append(p);
    }
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Hardcoded secondary nav links from original HTML (not in EDS model)
  const secondaryNavLinks = [
    { text: 'Terms of use', href: 'https://www.mahindra.com/terms-of-use' },
    { text: 'Disclaimer', href: 'https://www.mahindra.com/disclaimer' },
    { text: 'Privacy Policy', href: 'https://www.mahindra.com/privacy-policy' },
    { text: 'Sitemap', href: 'https://www.mahindra.com/sitemap' },
    { text: 'Contact Us', href: 'https://www.mahindra.com/contact-us' },
  ];

  secondaryNavLinks.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.text;
    li.append(a);
    secondaryNavUl.append(li);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = 'Copyright© 2026 Mahindra&Mahindra Ltd. All Rights Reserved.';
  copyrightWrap.append(copyrightTextCol);
}

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      // Add the span with img for the accordion toggle, as per original HTML
      const toggleSpan = document.createElement('span');
      toggleSpan.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776176652724.svg+xml"/>';
      // Insert the toggleSpan after the <a> tag, or at the beginning of the li if no <a>
      const directLink = li.querySelector(':scope > a');
      if (directLink) {
        directLink.after(toggleSpan);
      } else {
        li.prepend(toggleSpan);
      }

      // Attach event listener to the toggleSpan
      toggleSpan.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents parent accordion from also toggling
        li.classList.toggle('active');
        subWrap.classList.toggle('active');
      });

      // Handle deeper nesting if present
      nested.querySelectorAll('li').forEach((innerLi) => {
        const innerNested = innerLi.querySelector(':scope > ul');
        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-footer-inner-sub-child');
          innerSubWrap.append(innerNested);
          innerLi.append(innerSubWrap);

          // Add the span with img for the inner accordion toggle
          const innerToggleSpan = document.createElement('span');
          innerToggleSpan.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776176652724.svg+xml"/>';
          const innerDirectLink = innerLi.querySelector(':scope > a');
          if (innerDirectLink) {
            innerDirectLink.after(innerToggleSpan);
          } else {
            innerLi.prepend(innerToggleSpan);
          }

          innerToggleSpan.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            innerLi.classList.toggle('active');
            innerSubWrap.classList.toggle('active');
          });
        }
      });
    }
  });
}
