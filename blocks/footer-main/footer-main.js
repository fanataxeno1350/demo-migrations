import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
  // Apply classes from ORIGINAL HTML to the root UL
  if (level === 0) {
    rootUl.classList.add('footer-inner-list');
  }

  rootUl.querySelectorAll(':scope > li').forEach((li) => {
    // Apply classes from ORIGINAL HTML to LI
    // No specific classes for LI in ORIGINAL HTML, but if there were, they'd be added here.

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl;

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
        triggerEl = span;
      }
    } else {
      // Apply classes from ORIGINAL HTML to A
      // No specific classes for A in ORIGINAL HTML, but if there were, they'd be added here.
      triggerEl = anchor;
    }

    if (nested) {
      nested.remove(); // Remove the original UL to re-wrap it
      const subWrap = document.createElement('div');
      subWrap.classList.add(
        level === 0 ? 'has-footer-sub-child' : 'has-footer-inner-sub-child',
      );
      subWrap.append(nested);
      li.append(subWrap);

      if (triggerEl) {
        const small = document.createElement('small');
        // Data-once attributes are for JS behavior, not direct class mapping.
        // The event listener below handles the behavior.
        // small.setAttribute('data-once', 'footerClickEvent'); // Removed as per Rule 16, handled by JS
        // if (level > 0) {
        //   small.setAttribute('data-once', 'footerClickEvent innerFooterClickEvent'); // Removed
        // }
        // The image is hardcoded in ORIGINAL HTML, not in model, so omit.
        // If it were in the model, it would be: img.src = iconCell.querySelector('img').src;
        // For now, we omit the image as it's not in the EDS model.
        // small.append(img);
        triggerEl.parentNode.insertBefore(small, triggerEl.nextSibling);

        // Add event listener for expand/collapse behavior
        small.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
        // Also add to triggerEl if it's not the small element itself
        if (triggerEl !== small) {
          triggerEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });
        }
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Identify the fixed root fields first
  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.querySelector('a') && row !== logoRow);
  const copyrightTextRow = children.find((row) => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.trim().length > 0);

  // Filter out the identified root rows to get only item rows
  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow && row !== copyrightTextRow);

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoAnchor = document.createElement('a');
  if (logoLinkRow) {
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoAnchor.href = foundLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoAnchor);
  }

  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      // Apply class from ORIGINAL HTML: hiddenlogo1
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoAnchor);
  }

  logoDiv.append(logoAnchor);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  // Content detection for footer-social-item: 3 cells, first cell has a picture, third cell has a UL
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[2].querySelector('ul');
  });

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a') && cell !== iconCell);
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');

    const anchor = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.target = '_blank'; // From original HTML
      }
      moveInstrumentation(linkCell, anchor);
    }

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]); // Assuming a small icon size
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
      moveInstrumentation(iconCell, anchor);
    }

    // Add specific classes based on icon alt text or other detection if needed
    // Example: if (img.alt.toLowerCase().includes('facebook')) li.classList.add('fb');
    // For now, no specific classes are derived from the icon, following Rule 12.
    // If original HTML had specific classes for each social icon (e.g., fb, tw), they'd be added here.
    // Based on ORIGINAL HTML, these classes are on the LI, not the A.
    const iconAlt = iconCell?.querySelector('img')?.alt?.toLowerCase();
    if (iconAlt?.includes('facebook')) li.classList.add('fb');
    else if (iconAlt?.includes('twitter')) li.classList.add('tw');
    else if (iconAlt?.includes('instagram')) li.classList.add('inst');
    else if (iconAlt?.includes('youtube')) li.classList.add('yt');
    else if (iconAlt?.includes('linkedin')) li.classList.add('in');


    li.append(anchor);
    socialUl.append(li);
  });

  socialLinksWrapper.append(socialUl);
  footerHeader.append(socialLinksWrapper);
  container.append(footerHeader);

  // Footer Menu Box Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const col = document.createElement('div');
  col.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Content detection for footer-link-block: 3 cells, second cell has an A, third cell has text "Links value"
  const footerLinkBlockItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[1].querySelector('a') && cells[2].textContent.trim() === 'Links value';
  });

  let currentItemRows = [...itemRows]; // Create a mutable copy for processing
  footerLinkBlockItems.forEach((row) => {
    const cells = [...row.children];
    const blockTitleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== 'Links value');
    const blockTitleLinkCell = cells.find(cell => cell.querySelector('a'));
    const linksContainerCell = cells.find(cell => cell.textContent.trim() === 'Links value'); // This cell is just a marker

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const blockTitleAnchor = document.createElement('a');
    if (blockTitleLinkCell) {
      const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
      if (foundBlockTitleLink) {
        blockTitleAnchor.href = foundBlockTitleLink.href;
      }
      moveInstrumentation(blockTitleLinkCell, blockTitleAnchor);
    }
    if (blockTitleCell) {
      blockTitleAnchor.textContent = blockTitleCell.textContent.trim();
      moveInstrumentation(blockTitleCell, blockTitleAnchor);
    }
    span.append(blockTitleAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner'); // From original HTML
    span.append(small);

    headDiv.append(span);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');

    // Add event listener for mobile accordion behavior
    small.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      headDiv.classList.toggle('active'); // Toggle 'active' on 'head' div
      footerInnerList.classList.toggle('active'); // Toggle 'active' on 'footer-inner-list'
    });
    // Also add to the block title anchor
    blockTitleAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      headDiv.classList.toggle('active');
      footerInnerList.classList.toggle('active');
    });

    // Filter for footer-link-item rows associated with this block
    // This assumes footer-link-item rows immediately follow their parent footer-link-block
    // in the authored content structure.
    // We need to find the index of the current `row` within the original `children` array
    const blockIndex = children.indexOf(row);
    let nextRowIndex = blockIndex + 1;
    let currentLinkItemRow = children[nextRowIndex];

    // Content detection for footer-link-item: 3 cells, first cell has text, second cell has an A, third cell has a UL
    while (currentLinkItemRow && currentLinkItemRow.children.length === 3 && !currentLinkItemRow.children[0].querySelector('picture') && currentLinkItemRow.children[2].querySelector('ul')) {
      const itemCells = [...currentLinkItemRow.children];
      const labelCell = itemCells.find(c => !c.querySelector('a') && !c.querySelector('picture') && !c.querySelector('ul'));
      const linkCell = itemCells.find(c => c.querySelector('a'));
      const hierarchyCell = itemCells.find(c => c.querySelector('ul'));

      const li = document.createElement('li');

      let rootEl;
      if (linkCell) {
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          rootEl = document.createElement('a');
          rootEl.href = foundLink.href;
        } else {
          rootEl = document.createElement('span'); // Fallback if no link but label exists
        }
      } else {
        rootEl = document.createElement('span'); // Fallback if no link
      }

      if (labelCell) {
        rootEl.textContent = labelCell.textContent.trim();
        moveInstrumentation(labelCell, rootEl);
      }
      moveInstrumentation(currentLinkItemRow, rootEl);
      li.appendChild(rootEl);

      if (hierarchyCell) {
        const hierarchyRoot = hierarchyCell.querySelector('ul');
        if (hierarchyRoot) {
          // Create a temporary div to hold the innerHTML and apply classes
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = hierarchyCell.innerHTML;
          moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

          // Apply classes from ORIGINAL HTML to nested ULs, LIs, and As
          tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-inner-list')); // Example class from original HTML
          tempDiv.querySelectorAll('li').forEach(liElement => {
            // No specific classes for LI in ORIGINAL HTML, but if there were, they'd be added here.
          });
          tempDiv.querySelectorAll('a').forEach(aElement => {
            // No specific classes for A in ORIGINAL HTML, but if there were, they'd be added here.
          });

          // Transform nested lists within this hierarchy
          transformNestedLists(tempDiv.querySelector('ul'));

          // Move all children from tempDiv to the wrapper
          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child');
          while (tempDiv.firstChild) {
            wrapper.append(tempDiv.firstChild);
          }

          // Add event listener to rootEl for expanding the hierarchy
          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active');
            li.classList.toggle('active');
          });

          li.appendChild(wrapper);
        }
      }
      footerInnerList.append(li);
      nextRowIndex++;
      currentLinkItemRow = children[nextRowIndex];
    }

    headDiv.append(footerInnerList);
    linkBlocks.append(headDiv);
    footerMenu.append(linkBlocks);
  });

  col.append(footerMenu);
  footerMenuBox.append(col);
  container.append(footerMenuBox);

  // Copyright Wrap Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  // Content detection for secondary-nav-item: 2 cells, first cell has text, second cell has an A
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelector('a');
  });

  secondaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      moveInstrumentation(linkCell, anchor);
    }
    if (labelCell) {
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, anchor);
    }
    li.append(anchor);
    secondaryNavUl.append(li);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) {
    copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);

  container.append(copyrightWrap);
  block.innerHTML = '';
  block.append(container);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
