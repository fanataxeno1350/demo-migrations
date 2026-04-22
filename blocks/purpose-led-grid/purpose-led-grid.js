import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('row', 'g-4', 'pt-3');

  [...block.children].forEach((row) => {
    // The BlockJson defines 4 fields: image, link, linkLabel, text.
    // We can use destructuring for the first two (image and link) as their content types are distinct.
    // For linkLabel (text) and text (richtext), we need to be careful as they both might appear as plain div content.
    // However, the EDS structure guide indicates fixed-field item models should use index destructuring.
    // Let's re-evaluate based on the EDS structure guide's explicit instruction for fixed-field item models:
    // "For fixed-field item models (uniform cells per row) ALWAYS use index destructuring:
    // const [cell0, cell1, cell2, ...] = [...row.children];"
    // The BlockJson confirms a fixed structure for 'purpose-led-card' with 4 fields.
    // So, the original destructuring is correct according to the EDS guide for fixed-field models.
    const [imageCell, linkCell, linkLabelCell, textCell] = [...row.children];

    const colDiv = document.createElement('div');
    moveInstrumentation(row, colDiv);
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    // The BlockJson and EDS structure guide specify 'linkLabel' as type=text (read .textContent.trim())
    // and 'text' as type=richtext (read .innerHTML).
    // The original code only handles 'textCell' and appends its innerHTML.
    // We need to ensure both linkLabel and text are processed correctly.

    // Link Label (type=text)
    if (linkLabelCell && linkLabelCell.textContent.trim()) {
      // The original HTML doesn't show a separate element for linkLabel,
      // but the BlockJson defines it. The generated JS doesn't use it.
      // Based on the original HTML, the link label is not explicitly rendered as a separate element
      // within the card-text div. The 'desc' paragraph contains the main text.
      // If 'linkLabel' was meant to be displayed, it would need a place in the DOM.
      // Given the original HTML structure, it seems 'linkLabel' might be unused or implicitly part of the 'text' field.
      // However, the BlockJson explicitly defines it.
      // For now, we will assume it's not rendered separately based on the original HTML example,
      // and the 'text' field is the primary content for 'card-text'.
      // If it were to be rendered, it would likely be a heading or another paragraph.
      // Since the original HTML doesn't show it, we'll omit rendering it explicitly for now,
      // but acknowledge its presence in the model.
    }

    // Text (type=richtext)
    if (textCell) {
      const p = document.createElement('p');
      p.classList.add('desc');
      // Per BlockJson, 'text' is richtext, so innerHTML is correct.
      p.innerHTML = textCell.innerHTML;
      cardTextDiv.append(p);
    }

    cardWrap.append(cardImageDiv, cardTextDiv);
    colDiv.append(cardWrap);
    row.replaceWith(colDiv);
  });
}
