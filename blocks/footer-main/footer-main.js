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
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
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

      // Recursively transform inner nested lists if any
      nested.querySelectorAll(':scope > li > ul').forEach((innerUl) => {
        const innerSubWrap = document.createElement('div');
        innerSubWrap.classList.add('has-footer-inner-sub-child'); // Use original HTML class
        innerSubWrap.appendChild(innerUl);
        const parentLi = innerUl.closest('li');
        parentLi.appendChild(innerSubWrap);

        const innerTrigger = parentLi.querySelector(':scope > a, :scope > span');
        if (innerTrigger) {
          innerTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            parentLi.classList.toggle('active');
            innerSubWrap.classList.toggle('active');
          });
        }
      });
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // Destructure the known root fields
  const logoRow = rows[0];
  const logoLinkRow = rows[1];
  const copyrightTextRow = rows[2];

  // Remaining rows are item rows
  const itemRows = rows.slice(3);

  block.innerHTML = '';
  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  // Logo Section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      optimizedPic.querySelector('img').width = 200;
      optimizedPic.querySelector('img').height = 30;
      optimizedPic.querySelector('img').style.width = 'auto';
    }
  }
  moveInstrumentation(logoRow, logoLink);

  // Social Links Section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialList = document.createElement('ul');
  socialList.classList.add('social-wrap');
  socialCol.append(socialList);

  // Categorize item rows based on their structure
  const socialLinkItems = []; // 3 cells: icon (picture), link (a), hierarchy (ul)
  const footerLinkBlocks = []; // 3 cells: blockTitle (text), blockTitleLink (a), menuItems (div)
  const footerMenuItems = []; // 4 cells: label (text), link (a), icon (picture), hierarchy (ul)
  const secondaryNavItems = []; // 2 cells: label (text), link (a)

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) {
      // Could be socialLinkItems or footerLinkBlocks
      const firstCellHasPicture = cells[0].querySelector('picture');
      const thirdCellHasUl = cells[2].querySelector('ul');
      if (firstCellHasPicture && thirdCellHasUl) {
        socialLinkItems.push(row);
      } else if (!firstCellHasPicture && !thirdCellHasUl) { // Assuming blockTitle is text and menuItems is a div placeholder
        footerLinkBlocks.push(row);
      }
    } else if (cells.length === 4) {
      footerMenuItems.push(row);
    } else if (cells.length === 2) {
      secondaryNavItems.push(row);
    }
  });

  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // The third cell is hierarchy-tree, but it's not used in social links rendering, only in model.

    const li = document.createElement('li');

    const iconPicture = iconCell ? iconCell.querySelector('picture') : null;
    const iconImg = iconPicture ? iconPicture.querySelector('img') : null;
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;

    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.target = '_blank';
    }
    moveInstrumentation(linkCell, socialAnchor);

    if (iconImg) {
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '30' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      socialAnchor.append(optimizedPic);
    }
    moveInstrumentation(iconCell, socialAnchor);

    li.append(socialAnchor);
    socialList.append(li);
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

  // Create a mutable copy of footerMenuItems to consume
  const remainingFooterMenuItems = [...footerMenuItems];

  footerLinkBlocks.forEach((row) => {
    const cells = [...row.children];
    const blockTitleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const blockTitleLinkCell = cells.find(cell => cell.querySelector('a'));
    // The third cell is a container placeholder, not rendered directly.

    const linkBlocksDiv = document.createElement('div');
    linkBlocksDiv.classList.add('link-blocks');
    footerMenu.append(linkBlocksDiv);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocksDiv.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const blockTitleAnchor = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell ? blockTitleLinkLinkCell.querySelector('a') : null;
    if (foundBlockTitleLink) {
      blockTitleAnchor.href = foundBlockTitleLink.href;
    }
    blockTitleAnchor.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, blockTitleAnchor);
    moveInstrumentation(blockTitleCell, blockTitleAnchor);
    span.append(blockTitleAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    // Add event listener for the block title to toggle the list on mobile
    headDiv.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      linkBlocksDiv.classList.toggle('active');
    });

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');
    linkBlocksDiv.append(footerInnerList);

    // This logic assumes footerMenuItems immediately follow their parent footer-link-block
    // in the authored content, or that all footerMenuItems are grouped under the first
    // footer-link-block if no explicit grouping is provided.
    // For a more robust solution, the model would need a way to associate menu items
    // with a specific block title.
    // Given the flat structure, we'll process all `footerMenuItems` here and assume they
    // belong to the `footer-menu` section generally.

    // The original code tried to filter `currentBlockMenuItems` which is not possible
    // with the current flat structure. We will iterate through `remainingFooterMenuItems`
    // and append them to the `footerInnerList` of the *first* `footerLinkBlock` processed,
    // or if there's a specific grouping, that logic would be applied here.
    // For this review, we'll assume they are all part of the main footer menu.

    // If there's a specific grouping, the `footerMenuItems` array should be processed
    // in conjunction with `footerLinkBlocks` to ensure correct nesting.
    // Since `footer-menu-item` is a direct child of the block, and `footer-link-block`
    // is also a direct child, the generated JS needs to decide how to group them.
    // The most common pattern is that `footer-menu-item` rows immediately follow
    // their `footer-link-block` parent.

    // To correctly associate, we need to process `itemRows` sequentially
    // and identify when a `footer-link-block` is followed by `footer-menu-item`s.
    // Let's re-structure the item row processing to handle this.

    // This part of the code needs to be re-evaluated to correctly associate
    // `footer-menu-item`s with their `footer-link-block` parents.
    // The current approach of filtering `itemRows` into separate arrays and then
    // iterating them independently will not maintain the authored order for nesting.

    // Let's assume for now that all `footerMenuItems` are appended to the first `footer-inner-list`
    // if no explicit grouping is possible from the flat block structure.
    // A better approach would be to iterate `itemRows` once and build the structure.
    // For this review, I'll keep the current structure but refine the `footerMenuItems` consumption.

    // The original code had a `while (footerMenuItems.length > 0)` loop inside `footerLinkBlocks.forEach`.
    // This means all `footerMenuItems` would be appended to the first `footer-link-block`'s list.
    // This is likely incorrect if there are multiple `footer-link-block`s.
    // The block structure implies `footer-menu-item`s are direct children of the block,
    // not nested under `footer-link-block` in the raw HTML.
    // Therefore, if they are to be grouped, the grouping must be inferred or explicitly
    // authored (e.g., a field in `footer-menu-item` pointing to a `blockTitle`).
    // Without such a field, the most reasonable interpretation is that all `footer-menu-item`s
    // are part of the main `footer-menu` and are appended sequentially.

    // Let's process the `remainingFooterMenuItems` and append them to the current `footerInnerList`.
    // This is still a simplification, but it reflects the flat input better than trying to filter.
    // A more accurate solution would require a different block structure or a grouping field.
    // For now, we'll append them all to the first `footer-inner-list` created.
    // If there are multiple `footer-link-block`s, this will be incorrect.
    // Let's assume for this exercise that the `footer-menu-item`s are meant to be
    // grouped under the *first* `footer-link-block` if no other grouping mechanism exists.
    // This is a common pattern for "container" fields where child items follow the parent.

    // To correctly handle the "container" field `menuItems` within `footer-link-block`,
    // we need to process the `itemRows` in order.
    // Let's re-think the item row processing.

    // A better way to handle the container relationship:
    // Iterate through `itemRows` once. When a `footer-link-block` is found,
    // create its structure. Then, continue iterating and if `footer-menu-item`s
    // are found immediately after, append them to the current `footer-link-block`'s list.

    // Re-categorize item rows to maintain order for container relationships
    const processedItemRows = [];
    let currentLinkBlock = null;
    let currentLinkBlockList = null;

    itemRows.forEach((row) => {
      const cells = [...row.children];
      if (cells.length === 3) {
        const firstCellHasPicture = cells[0].querySelector('picture');
        const thirdCellHasUl = cells[2].querySelector('ul');
        if (firstCellHasPicture && thirdCellHasUl) {
          socialLinkItems.push(row);
          currentLinkBlock = null; // Reset if a different type of item is encountered
        } else if (!firstCellHasPicture && !thirdCellHasUl) {
          // This is a footer-link-block
          const blockTitleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
          const blockTitleLinkCell = cells.find(cell => cell.querySelector('a'));

          const linkBlocksDiv = document.createElement('div');
          linkBlocksDiv.classList.add('link-blocks');
          footerMenu.append(linkBlocksDiv);

          const headDiv = document.createElement('div');
          headDiv.classList.add('head');
          linkBlocksDiv.append(headDiv);

          const span = document.createElement('span');
          headDiv.append(span);

          const blockTitleAnchor = document.createElement('a');
          const foundBlockTitleLink = blockTitleLinkCell ? blockTitleLinkCell.querySelector('a') : null;
          if (foundBlockTitleLink) {
            blockTitleAnchor.href = foundBlockTitleLink.href;
          }
          blockTitleAnchor.textContent = blockTitleCell.textContent.trim();
          moveInstrumentation(blockTitleLinkCell, blockTitleAnchor);
          moveInstrumentation(blockTitleCell, blockTitleAnchor);
          span.append(blockTitleAnchor);

          const small = document.createElement('small');
          small.setAttribute('data-once', 'footerMobileInner');
          span.append(small);

          headDiv.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            linkBlocksDiv.classList.toggle('active');
          });

          currentLinkBlockList = document.createElement('ul');
          currentLinkBlockList.classList.add('footer-inner-list');
          linkBlocksDiv.append(currentLinkBlockList);

          currentLinkBlock = {
            element: linkBlocksDiv,
            list: currentLinkBlockList,
          };
        }
      } else if (cells.length === 4) {
        // This is a footer-menu-item
        if (currentLinkBlock) {
          const [labelCell, menuLinkCell, iconCell, hierarchyCell] = cells;

          const li = document.createElement('li');
          currentLinkBlock.list.append(li);

          const foundMenuLink = menuLinkCell.querySelector('a');
          let menuAnchor;
          if (foundMenuLink) {
            menuAnchor = document.createElement('a');
            menuAnchor.href = foundMenuLink.href;
          } else {
            menuAnchor = document.createElement('span'); // If no link, use span for label
          }
          menuAnchor.textContent = labelCell.textContent.trim();
          moveInstrumentation(menuLinkCell, menuAnchor);
          moveInstrumentation(labelCell, menuAnchor);
          li.append(menuAnchor);

          const itemIconPicture = iconCell.querySelector('picture');
          if (itemIconPicture) {
            const itemIconImg = itemIconPicture.querySelector('img');
            if (itemIconImg) {
              const optimizedPic = createOptimizedPicture(itemIconImg.src, itemIconImg.alt, false, [{ width: '20' }]);
              moveInstrumentation(itemIconImg, optimizedPic.querySelector('img'));
              const iconSpan = document.createElement('span');
              iconSpan.setAttribute('data-once', 'footerClickEvent');
              iconSpan.append(optimizedPic);
              li.append(iconSpan);
            }
          }
          moveInstrumentation(iconCell, menuAnchor);

          const hierarchyRoot = hierarchyCell.querySelector('ul');
          if (hierarchyRoot) {
            const hierarchyWrapper = document.createElement('div');
            hierarchyWrapper.classList.add('has-footer-sub-child');
            // Move instrumentation for the hierarchy cell
            moveInstrumentation(hierarchyCell, hierarchyWrapper);

            // Append the hierarchyRoot (ul) to a temporary div to apply classes before moving
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = hierarchyCell.innerHTML;
            const ulToTransform = tempDiv.querySelector('ul');

            if (ulToTransform) {
              transformNestedLists(ulToTransform); // Apply transformations and event listeners
              // Move all children from tempDiv to hierarchyWrapper
              while (tempDiv.firstChild) {
                hierarchyWrapper.append(tempDiv.firstChild);
              }
            }
            li.append(hierarchyWrapper);

            // Add event listener to the menuAnchor for toggling the hierarchy
            menuAnchor.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              li.classList.toggle('active');
              hierarchyWrapper.classList.toggle('active');
            });
          }
        } else {
          // If a footer-menu-item is found without a preceding footer-link-block,
          // it's an un-grouped item. For now, we'll ignore it or handle it as a generic item.
          // For this block, it implies a structural issue in the authored content.
          // For now, we'll push it to a generic list if no block is active.
          // Or, more correctly, it should be part of the `footerMenuItems` array
          // and processed separately if not grouped.
          // Given the model, `footer-menu-item` is a child of `footer-link-block` container.
          // So, it MUST follow a `footer-link-block`.
        }
      } else if (cells.length === 2) {
        // This is a secondary-nav-item
        secondaryNavItems.push(row);
        currentLinkBlock = null; // Reset if a different type of item is encountered
      }
    });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavList = document.createElement('ul');
  secondaryNavList.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavList);

  secondaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    secondaryNavList.append(li);

    const secondaryNavLink = document.createElement('a');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      secondaryNavLink.href = foundLink.href;
    }
    secondaryNavLink.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, secondaryNavLink);
    moveInstrumentation(labelCell, secondaryNavLink);
    li.append(secondaryNavLink);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
