import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const headingRow = children.shift();
  const headingText = headingRow.querySelector('div').textContent.trim();

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingText;
  sectionHeader.append(heading);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides');

  // Filter items based on the number of cells per row as per BlockJson
  // twitter-feed-item has 10 fields
  // story-card-item has 5 fields
  const twitterFeedItems = children.filter((row) => [...row.children].length === 10);
  const storyCardItems = children.filter((row) => [...row.children].length === 5);

  if (twitterFeedItems.length > 0) {
    const twitterFeedContainer = document.createElement('div');
    twitterFeedContainer.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
    twitterFeedContainer.setAttribute('data-elfsight-app-lazy', '');
    twitterFeedContainer.id = 'eapps-twitter-feed-1';

    const eappsTwitterFeedContainer = document.createElement('div');
    eappsTwitterFeedContainer.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
    eappsTwitterFeedContainer.setAttribute('eapps-link', 'app');

    const eappsTwitterFeedTitle = document.createElement('div');
    eappsTwitterFeedTitle.classList.add('eapps-twitter-feed-title');
    eappsTwitterFeedTitle.setAttribute('eapps-link', 'title');
    eappsTwitterFeedTitle.innerHTML = '<div class="eui-widget-title es-widget-title" style="display: none;"></div>';
    eappsTwitterFeedContainer.append(eappsTwitterFeedTitle);

    const eappsTwitterFeedInner = document.createElement('div');
    eappsTwitterFeedInner.classList.add('eapps-twitter-feed-inner');

    twitterFeedItems.forEach((row) => {
      const cells = [...row.children];
      const profileBannerImageCell = cells[0];
      const profileImageCell = cells[1];
      const profileNameCell = cells[2];
      const profileScreenNameCell = cells[3];
      const profileLinkCell = cells[4];
      const isVerifiedCell = cells[5];
      const postsCountCell = cells[6];
      const followingCountCell = cells[7];
      const followersCountCell = cells[8];
      const postsCell = cells[9]; // This is a container field, its value is a placeholder in the current HTML.

      const header = document.createElement('div');
      header.classList.add('eapps-twitter-feed-header', 'eapps-twitter-feed-header-show');
      header.setAttribute('eapps-link', 'header');
      moveInstrumentation(row, header);

      const headerInner = document.createElement('div');
      headerInner.classList.add('eapps-twitter-feed-header-inner');

      const bannerContainer = document.createElement('div');
      bannerContainer.classList.add('eapps-twitter-feed-header-banner-container');
      const bannerPicture = profileBannerImageCell.querySelector('picture');
      if (bannerPicture) {
        const bannerImg = bannerPicture.querySelector('img');
        if (bannerImg) {
          const optimizedBannerPic = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(bannerImg, optimizedBannerPic.querySelector('img'));
          bannerContainer.append(optimizedBannerPic);
          optimizedBannerPic.classList.add('eapps-twitter-feed-header-banner');
        }
      }
      headerInner.append(bannerContainer);

      const userDiv = document.createElement('div');
      userDiv.classList.add('eapps-twitter-feed-header-user');

      const profileLink = profileLinkCell.querySelector('a');
      const profileHref = profileLink ? profileLink.href : '#';

      const userImageContainer = document.createElement('a');
      userImageContainer.classList.add('eapps-twitter-feed-header-user-image-container');
      userImageContainer.rel = 'nofollow';
      userImageContainer.href = profileHref;
      userImageContainer.target = '_blank';

      const profilePicture = profileImageCell.querySelector('picture');
      if (profilePicture) {
        const profileImg = profilePicture.querySelector('img');
        if (profileImg) {
          const optimizedProfilePic = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '100' }]);
          moveInstrumentation(profileImg, optimizedProfilePic.querySelector('img'));
          userImageContainer.append(optimizedProfilePic);
          optimizedProfilePic.classList.add('eapps-twitter-feed-header-user-image');
        }
      }
      userDiv.append(userImageContainer);

      const userInfo = document.createElement('div');
      userInfo.classList.add('eapps-twitter-feed-header-user-info');

      const nameWrapper = document.createElement('div');
      nameWrapper.classList.add('eapps-twitter-feed-header-user-info-name-wrapper');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('eapps-twitter-feed-header-user-info-name');
      const nameLink = document.createElement('a');
      nameLink.rel = 'nofollow';
      nameLink.href = profileHref;
      nameLink.title = `Visit ${profileNameCell.textContent.trim()} on X (formerly Twitter)`;
      nameLink.target = '_blank';
      nameLink.textContent = profileNameCell.textContent.trim();

      if (isVerifiedCell.textContent.trim() === 'true') {
        const verifiedSpan = document.createElement('span');
        verifiedSpan.classList.add('eapps-twitter-feed-header-user-info-name-verified-container');
        verifiedSpan.title = 'Verified account';
        const verifiedImg = document.createElement('img');
        verifiedImg.alt = 'svg file';
        // Use an actual SVG from the original HTML if available, or a generic one.
        // For this example, we'll assume a generic one as the block model doesn't provide it.
        verifiedImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776838582992.svg+xml'; // Use actual SVG path from original HTML
        verifiedSpan.append(verifiedImg);
        nameLink.append(verifiedSpan);
      }
      nameDiv.append(nameLink);
      nameWrapper.append(nameDiv);

      const screenNameDiv = document.createElement('div');
      screenNameDiv.classList.add('eapps-twitter-feed-header-user-info-screen-name');
      const screenNameLink = document.createElement('a');
      screenNameLink.rel = 'nofollow';
      screenNameLink.target = '_blank';
      screenNameLink.href = profileHref;
      screenNameLink.textContent = `@${profileScreenNameCell.textContent.trim()}`;
      screenNameDiv.append(screenNameLink);
      nameWrapper.append(screenNameDiv);
      userInfo.append(nameWrapper);

      const followLink = document.createElement('a');
      followLink.rel = 'nofollow';
      followLink.href = `https://x.com/intent/follow?screen_name=${profileScreenNameCell.textContent.trim()}`;
      followLink.target = '_blank';
      followLink.classList.add('eapps-twitter-feed-header-user-info-follow');
      followLink.setAttribute('eapps-link', 'follow');
      const followImg = document.createElement('img');
      followImg.alt = 'svg file';
      // Generic SVG for follow icon
      followImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776838583026.svg+xml'; // Use actual SVG path from original HTML
      const followLabel = document.createElement('span');
      followLabel.classList.add('eapps-twitter-feed-header-user-info-follow-label');
      followLabel.textContent = 'Follow';
      followLink.append(followImg, followLabel);
      userInfo.append(followLink);

      userDiv.append(userInfo);
      headerInner.append(userDiv);

      const statisticsDiv = document.createElement('div');
      statisticsDiv.classList.add('eapps-twitter-feed-header-statistics');

      const createStatItem = (className, name, data) => {
        const item = document.createElement('div');
        item.classList.add(`eapps-twitter-feed-header-statistics-${className}`, 'eapps-twitter-feed-header-statistics-item');
        const itemName = document.createElement('div');
        itemName.classList.add('eapps-twitter-feed-header-statistics-item-name');
        itemName.textContent = name;
        const itemData = document.createElement('div');
        itemData.classList.add('eapps-twitter-feed-header-statistics-item-data');
        itemData.textContent = data;
        item.append(itemName, itemData);
        return item;
      };

      statisticsDiv.append(
        createStatItem('posts', 'Posts', postsCountCell.textContent.trim()),
        createStatItem('following', 'Following', followingCountCell.textContent.trim()),
        createStatItem('followers', 'Followers', followersCountCell.textContent.trim()),
      );
      headerInner.append(statisticsDiv);
      header.append(headerInner);
      eappsTwitterFeedInner.append(header);

      const postsDiv = document.createElement('div');
      postsDiv.classList.add('eapps-twitter-feed-posts');
      postsDiv.setAttribute('eapps-link', 'posts');
      postsDiv.style.maxHeight = 'none';

      const postsContainer = document.createElement('div');
      postsContainer.classList.add('eapps-twitter-feed-posts-container');
      postsContainer.setAttribute('eapps-link', 'postsContainer');
      postsContainer.style.maxHeight = 'none';

      const postsInner = document.createElement('div');
      postsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
      postsInner.setAttribute('eapps-link', 'posts');
      postsInner.style.cssText = 'position: relative; overflow: hidden; height: auto; transition: height 100ms cubic-bezier(0.4, 0, 0.2, 1); transition-property: transform, opacity; transition-duration: 100ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);';

      // The BlockJson model indicates "posts" is a container field with item "twitter-feed-post-item".
      // This means individual post items should appear as separate rows in the block.children array,
      // not nested within the `postsCell`.
      // As per the provided EDS BLOCK STRUCTURE and HTML, `postsCell` contains a placeholder text "Posts value".
      // If actual `twitter-feed-post-item` rows were present, they would be filtered by their cell count
      // (12 fields as per BlockJson) and processed separately.
      // For now, we'll treat `postsCell` content as a placeholder for the entire posts section.
      const postsPlaceholder = document.createElement('div');
      postsPlaceholder.textContent = postsCell.textContent.trim(); // "Posts value"
      postsInner.append(postsPlaceholder); // Placeholder

      postsContainer.append(postsInner);
      postsDiv.append(postsContainer);
      eappsTwitterFeedInner.append(postsDiv);

      twitterFeedContainer.append(eappsTwitterFeedContainer);
    });
    slidesWrapper.append(twitterFeedContainer);
  }

  storyCardItems.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const categoryCell = cells[1];
    const textCell = cells[2];
    const linkCell = cells[3];
    const dateCell = cells[4];

    const slideDiv = document.createElement('div');
    slideDiv.classList.add('slides');
    moveInstrumentation(row, slideDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrap.append(optimizedPic);
        optimizedPic.classList.add('thumb-img', 'img-fluid');
      }
    }
    wrapDiv.append(imageWrap);

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.textContent = categoryCell.textContent.trim();
    contentWrap.append(categoryDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('text');
    textDiv.textContent = textCell.textContent.trim();
    contentWrap.append(textDiv);

    const link = linkCell.querySelector('a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.classList.add('btn', 'btn-link');
      anchor.textContent = 'Read more';
      contentWrap.append(anchor);
    }

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    time.setAttribute('datetime', dateCell.textContent.trim()); // Assuming date is in a parseable format
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrapDiv.append(contentWrap);
    slideDiv.append(wrapDiv);
    slidesWrapper.append(slideDiv);
  });

  flickitySliderWrap.append(slidesWrapper);
  container.append(flickitySliderWrap);

  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'latest-stories', 'home-stories');
  block.append(sectionHeader, container);
}
