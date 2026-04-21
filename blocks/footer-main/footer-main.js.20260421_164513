import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, isInner = false) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');
    let triggerEl = anchor;

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
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add(isInner ? 'has-footer-inner-sub-child' : 'has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      if (triggerEl) {
        const small = document.createElement('small');
        // The original HTML uses a hardcoded SVG path for the toggle icon.
        // Since the block model doesn't provide an icon field for nested list toggles,
        // we'll add the small element as a placeholder for the toggle, but omit the img.
        // If an icon field were present in the model for these toggles, we would use that.
        // The data-once attributes are from the original HTML and are preserved.
        small.setAttribute('data-once', 'footerClickEvent');
        if (isInner) {
          small.setAttribute('data-once', 'footerClickEvent innerFooterClickEvent');
        }
        // The original HTML had an img tag here, but we don't have an authored icon.
        // const img = document.createElement('img');
        // img.alt = 'svg file';
        // small.append(img);
        triggerEl.after(small);

        small.addEventListener('click', (e) => { // Event listener added to the small toggle element
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, true);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are at fixed indices
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightRow = children[2];

  // Item rows need content detection
  const socialLinkRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  const menuBlockRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim() === 'Menu Items value';
  });

  const menuItemRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  const secondaryNavRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  block.innerHTML = ''; // Clear block content to rebuild

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
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('hiddenlogo1');
      optimizedImg.alt = img.alt;
      optimizedImg.title = img.title;
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }

  // Social Links Section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialList = document.createElement('ul');
  socialList.classList.add('social-wrap');
  socialCol.append(socialList);

  socialLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const linkCell = cells[1];
    // const hierarchyCell = cells[2]; // Not used for social links directly, but present in model

    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.target = '_blank';
    }

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]); // Assuming a small size for social icons
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.alt = img.alt;
        moveInstrumentation(img, optimizedImg);
        socialAnchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, li);
    li.append(socialAnchor);
    socialList.append(li);
  });

  // Footer Menu Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const menuCol = document.createElement('div');
  menuCol.classList.add('col');
  footerMenuBox.append(menuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  menuCol.append(footerMenu);

  menuBlockRows.forEach((row) => {
    const cells = [...row.children];
    const titleCell = cells[0];
    const titleLinkCell = cells[1];
    // const menuItemsCell = cells[2]; // This is a container field, not a direct content cell

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');
    linkBlocks.append(headDiv);

    const span = document.createElement('span');
    headDiv.append(span);

    const titleAnchor = document.createElement('a');
    const foundTitleLink = titleLinkCell.querySelector('a');
    if (foundTitleLink) {
      titleAnchor.href = foundTitleLink.href;
    }
    titleAnchor.textContent = titleCell.textContent.trim();
    span.append(titleAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    // Add event listener for mobile menu toggle
    small.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      linkBlocks.classList.toggle('active');
      headDiv.classList.toggle('active');
    });


    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');
    headDiv.append(ul);
    moveInstrumentation(row, linkBlocks);
  });

  // Append menu items to their respective menu blocks
  menuItemRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    const li = document.createElement('li');
    const foundLink = linkCell.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell.querySelector('ul'); // Check for <ul> directly in the richtext cell
    if (hierarchyRoot) {
      // Create a temporary div to hold the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements as per original HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('')); // No specific class for <a> in original HTML for these
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('')); // No specific class for <ul> in original HTML for these
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('')); // No specific class for <li> in original HTML for these

      const wrapper = document.createElement('div');
      wrapper.classList.add('has-footer-sub-child');
      // Move all children from tempDiv to wrapper
      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }
      li.appendChild(wrapper);

      const small = document.createElement('small');
      small.setAttribute('data-once', 'footerClickEvent');
      // The original HTML had an img tag here, but we don't have an authored icon.
      // const img = document.createElement('img');
      // img.alt = 'svg file';
      // small.append(img);
      rootEl.after(small);

      small.addEventListener('click', (e) => { // Event listener added to the small toggle element
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        li.classList.toggle('active');
      });
      transformNestedLists(hierarchyRoot); // Pass the actual <ul> element
    }

    // Find the correct parent menu block to append this item
    // This logic is still a placeholder as the model doesn't provide explicit parent links.
    // For now, it will append to the first menu block.
    const parentMenuBlock = footerMenu.firstElementChild; // Default to first if no specific logic
    if (parentMenuBlock) {
      parentMenuBlock.querySelector('.footer-inner-list').append(li);
    }
  });

  // Copyright and Secondary Nav Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavList = document.createElement('ul');
  secondaryNavList.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavList);

  secondaryNavRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNavList.append(li);
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightCol);
  copyrightWrap.append(copyrightCol);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
