import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection for the first three rows as per model fields
  const rows = [...block.children];
  const logoRow = rows.find(row => row.querySelector('picture'));
  const logoLinkRow = rows.find(row => row.querySelector('a') && !row.querySelector('picture'));
  const logoLinkLabelRow = rows.find(row => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.trim() !== '');

  // Remaining rows are footerSections
  const sectionRows = rows.filter(row => row !== logoRow && row !== logoLinkRow && row !== logoLinkLabelRow);

  block.textContent = '';

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header Section
  const footerHeaderRow = document.createElement('div');
  footerHeaderRow.classList.add('row', 'footer-header');
  container.append(footerHeaderRow);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeaderRow.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  if (logoLinkRow) { // Ensure logoLinkRow exists before querying
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }
  logoDiv.append(logoLink);

  if (logoRow) { // Ensure logoRow exists before querying
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('hiddenlogo1');
        optimizedImg.width = 200;
        optimizedImg.height = 30;
        optimizedImg.style.width = 'auto';
        optimizedImg.loading = 'lazy';
        moveInstrumentation(img, optimizedImg);
        logoLink.append(optimizedPic);
      }
    }
  }

  // Social Wrap (not in EDS model, so not created)
  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeaderRow.append(socialWrapCol);
  // No social links in the model, so this column remains empty or can be removed if strictly adhering to model.
  // For now, it's added as per original HTML structure.

  // Footer Menu Box Section
  const footerMenuBoxRow = document.createElement('div');
  footerMenuBoxRow.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBoxRow);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBoxRow.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  sectionRows.forEach((row) => {
    // For footer-section item rows, cells are fixed: [heading, sectionLinks]
    const cells = [...row.children];
    const headingCell = cells[0];
    const sectionLinksCell = cells[1];

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);
    moveInstrumentation(row, linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const headingText = headingCell.textContent.trim();
    const sectionLinksUl = sectionLinksCell.querySelector('ul');

    if (sectionLinksUl) {
      // If there's a UL, it's a dropdown/accordion
      const triggerLink = document.createElement('a');
      triggerLink.textContent = headingText;
      triggerLink.href = '#'; // Placeholder, as heading is text, not aem-content link
      span.append(triggerLink);

      const small = document.createElement('small');
      span.append(small);

      sectionLinksUl.classList.add('footer-inner-list');
      headDiv.append(sectionLinksUl);

      // Transform nested lists for accordion behavior
      function transformNestedLists(rootUl) {
        rootUl.querySelectorAll('li').forEach(li => {
          const nested = li.querySelector(':scope > ul');
          if (nested) {
            nested.remove(); // Remove to re-append in wrapper
            const subWrap = document.createElement('div');
            subWrap.classList.add('has-footer-sub-child'); // Use exact class from original HTML
            subWrap.append(nested);
            li.append(subWrap);

            const trigger = li.querySelector(':scope > a') || li;
            trigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('active');
              subWrap.classList.toggle('active');
            });

            // Handle inner nested lists (has-footer-inner-sub-child)
            nested.querySelectorAll('li').forEach(innerLi => {
              const innerNested = innerLi.querySelector(':scope > ul');
              if (innerNested) {
                innerNested.remove();
                const innerSubWrap = document.createElement('div');
                innerSubWrap.classList.add('has-footer-inner-sub-child');
                innerSubWrap.append(innerNested);
                innerLi.append(innerSubWrap);

                const innerTrigger = innerLi.querySelector(':scope > a') || innerLi;
                innerTrigger.addEventListener('click', (e) => {
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
      transformNestedLists(sectionLinksUl);

      // Add click listener to the main heading to toggle the list for mobile
      triggerLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        headDiv.classList.toggle('active'); // Toggle 'active' on headDiv for CSS control
        sectionLinksUl.classList.toggle('active'); // Toggle 'active' on ul for CSS control
      });

    } else {
      // If no UL, it's a simple text heading (could be a link if the model supported it)
      const p = document.createElement('p');
      p.textContent = headingText;
      span.append(p);
      // Append any other content from sectionLinksCell directly, as it's not a list
      if (sectionLinksCell.innerHTML.trim()) {
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = sectionLinksCell.innerHTML;
        headDiv.append(contentDiv);
      }
    }
  });

  // Copyright Section
  const copyrightWrapRow = document.createElement('div');
  copyrightWrapRow.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrapRow);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrapRow.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Hardcoding secondary nav links as they are not in the EDS model
  // In a real scenario, these would come from an EDS model field.
  const secondaryNavLinks = [
    { text: 'Terms of use', href: 'https://www.mahindra.com/terms-of-use' },
    { text: 'Disclaimer', href: 'https://www.mahindra.com/disclaimer' },
    { text: 'Privacy Policy', href: 'https://www.mahindra.com/privacy-policy' },
    { text: 'Sitemap', href: 'https://www.mahindra.com/sitemap' },
    { text: 'Contact Us', href: 'https://www.mahindra.com/contact-us' },
  ];

  secondaryNavLinks.forEach(item => {
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
  copyrightWrapRow.append(copyrightTextCol);
}
