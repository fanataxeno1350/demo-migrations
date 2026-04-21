import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // CHECK 0 & 1: Replaced children[0] with content detection for the heading
  const headingWrapper = children.find(row => row.children.length === 1 && row.querySelector('div:first-child:not(:has(picture)):not(:has(a))'));
  if (headingWrapper) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.setAttribute('data-aos', 'fade-up');
    heading.setAttribute('data-aos-offset', '100');
    heading.setAttribute('data-aos-duration', '650');
    heading.setAttribute('data-aos-easing', 'ease-in-out');
    moveInstrumentation(headingWrapper, heading);
    heading.textContent = headingWrapper.textContent.trim();
    sectionHeader.append(heading);
    block.replaceChild(sectionHeader, headingWrapper);
  } else {
    // If no heading found, still append sectionHeader to maintain structure
    block.prepend(sectionHeader);
  }


  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const flickitySliderWrap = document.createElement('div');
  flickitySliderWrap.classList.add('flickity-slider-mobile-wrap', 'grid-layout');
  flickitySliderWrap.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }');

  const twitterFeedSlides = document.createElement('div');
  twitterFeedSlides.classList.add('slides');

  const elfsightApp = document.createElement('div');
  elfsightApp.classList.add('elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235', 'eapps-twitter-feed', 'eapps-twitter-feed-source-user', 'eapps-twitter-feed-color-scheme--dark');
  elfsightApp.setAttribute('data-elfsight-app-lazy', '');
  elfsightApp.id = 'eapps-twitter-feed-1';

  const twitterFeedContainer = document.createElement('div');
  twitterFeedContainer.classList.add('eapps-twitter-feed-container', 'eapps-twitter-feed-post-x-icon-hide', 'eapps-twitter-feed-post-reply-hide', 'eapps-twitter-feed-post-repost-hide', 'eapps-twitter-feed-post-like-hide', 'eapps-twitter-feed-post-share-button-hide', 'eapps-twitter-feed-small', 'eapps-twitter-feed-hide-header');
  twitterFeedContainer.setAttribute('eapps-link', 'app');

  const twitterFeedInner = document.createElement('div');
  twitterFeedInner.classList.add('eapps-twitter-feed-inner');

  const twitterFeedPosts = document.createElement('div');
  twitterFeedPosts.classList.add('eapps-twitter-feed-posts');
  twitterFeedPosts.setAttribute('eapps-link', 'posts');
  twitterFeedPosts.style.maxHeight = 'none';

  const twitterFeedPostsContainer = document.createElement('div');
  twitterFeedPostsContainer.classList.add('eapps-twitter-feed-posts-container');
  twitterFeedPostsContainer.setAttribute('eapps-link', 'postsContainer');
  twitterFeedPostsContainer.style.maxHeight = 'none';

  const twitterFeedPostsInner = document.createElement('div');
  twitterFeedPostsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
  twitterFeedPostsInner.setAttribute('eapps-link', 'posts');
  twitterFeedPostsInner.style.position = 'relative';
  twitterFeedPostsInner.style.overflow = 'hidden';
  twitterFeedPostsInner.style.height = 'auto'; // Will be dynamically set by content
  twitterFeedPostsInner.style.transition = 'height 100ms cubic-bezier(0.4, 0, 0.2, 1)';

  // Filter out the heading row if it was processed
  const contentRows = children.filter(row => row !== headingWrapper);

  const twitterPosts = contentRows.filter((row) => row.children.length === 10);
  twitterPosts.forEach((row, i) => {
    const [userImageCell, userNameCell, userScreenNameCell, userProfileLinkCell, dateCell, postTextCell, postMediaImageCell, postLinkCell, repostsCell, likesCell] = [...row.children];

    const postItem = document.createElement('div');
    postItem.classList.add('eapps-twitter-feed-posts-item', 'eapps-twitter-feed-posts-item-media-items-1', 'eapps-twitter-feed-posts-item-media-show', 'eapps-twitter-feed-posts-item-show', 'shuffle-item', 'shuffle-item--visible');
    postItem.style.position = 'absolute';
    postItem.style.top = '0px';
    postItem.style.visibility = 'visible';
    postItem.style.willChange = 'transform';
    postItem.style.left = '0px';
    postItem.style.opacity = '1';
    postItem.style.transitionDuration = '100ms';
    postItem.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
    postItem.style.transitionProperty = 'transform, opacity';
    postItem.style.transform = `translate(0px, ${i * 471}px) scale(1)`; // Example, adjust as needed

    const postItemInner = document.createElement('div');
    postItemInner.classList.add('eapps-twitter-feed-posts-item-inner');

    const userDiv = document.createElement('div');
    userDiv.classList.add('eapps-twitter-feed-posts-item-user');
    const userLink = document.createElement('a');
    userLink.rel = 'nofollow';
    userLink.target = '_blank';
    userLink.href = userProfileLinkCell.querySelector('a')?.href || '#';

    const userImageContainer = document.createElement('div');
    userImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
    const userImg = userImageCell.querySelector('picture > img');
    if (userImg) {
      const optimizedUserPic = createOptimizedPicture(userImg.src, userImg.alt, false, [{ width: '400' }]);
      moveInstrumentation(userImg.closest('picture'), optimizedUserPic.querySelector('img'));
      userImageContainer.append(optimizedUserPic);
    }
    userLink.append(userImageContainer);

    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('eapps-twitter-feed-posts-item-user-name');
    const userNameLink = document.createElement('a');
    userNameLink.rel = 'nofollow';
    userNameLink.target = '_blank';
    userNameLink.href = userProfileLinkCell.querySelector('a')?.href || '#';
    const userNameSpan = document.createElement('span');
    userNameSpan.textContent = userNameCell.textContent.trim();
    userNameLink.append(userNameSpan);
    userNameDiv.append(userNameLink);

    const userScreenNameDiv = document.createElement('div');
    userScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
    const userScreenNameLink = document.createElement('a');
    userScreenNameLink.rel = 'nofollow';
    userScreenNameLink.target = '_blank';
    userScreenNameLink.href = userProfileLinkCell.querySelector('a')?.href || '#';
    const screenNameSpan = document.createElement('span');
    screenNameSpan.textContent = userScreenNameCell.textContent.trim();
    userScreenNameLink.append(screenNameSpan);
    userScreenNameDiv.append(userScreenNameLink);

    const userDateSpan = document.createElement('span');
    userDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
    userDateSpan.textContent = dateCell.textContent.trim();
    userScreenNameDiv.append(userDateSpan);
    userNameDiv.append(userScreenNameDiv);

    userDiv.append(userLink, userNameDiv);

    const postTextDiv = document.createElement('div');
    postTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
    // CHECK 1.5: Correctly using innerHTML for richtext field
    postTextDiv.innerHTML = postTextCell.innerHTML;

    const postMediaDiv = document.createElement('div');
    postMediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
    postMediaDiv.setAttribute('eapps-link', 'media');
    const mediaItem = document.createElement('div');
    mediaItem.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');
    const mediaImg = postMediaImageCell.querySelector('picture > img');
    if (mediaImg) {
      const mediaLink = document.createElement('a');
      mediaLink.rel = 'nofollow';
      mediaLink.target = '_blank';
      mediaLink.href = postLinkCell.querySelector('a')?.href || '#';
      mediaLink.setAttribute('aria-label', `Watch ${userNameCell.textContent.trim()}'s video post on X`);

      const optimizedMediaPic = createOptimizedPicture(mediaImg.src, mediaImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(mediaImg.closest('picture'), optimizedMediaPic.querySelector('img'));
      mediaLink.append(optimizedMediaPic);
      mediaItem.append(mediaLink);
    }
    postMediaDiv.append(mediaItem);

    const postActionsDiv = document.createElement('div');
    postActionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');

    const repostItem = document.createElement('a');
    repostItem.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-repost');
    repostItem.rel = 'nofollow';
    repostItem.href = '#';
    repostItem.title = 'Repost';
    const repostIconDiv = document.createElement('div');
    repostIconDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
    const repostTextDiv = document.createElement('div');
    repostTextDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
    repostTextDiv.textContent = repostsCell.textContent.trim();
    repostItem.append(repostIconDiv, repostTextDiv);

    const likesItem = document.createElement('a');
    likesItem.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-likes');
    likesItem.rel = 'nofollow';
    likesItem.href = '#';
    likesItem.title = 'Like';
    const likesIconDiv = document.createElement('div');
    likesIconDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
    const likesTextDiv = document.createElement('div');
    likesTextDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
    likesTextDiv.textContent = likesCell.textContent.trim();
    likesItem.append(likesIconDiv, likesTextDiv);

    postActionsDiv.append(repostItem, likesItem);

    postItemInner.append(userDiv, postTextDiv, postMediaDiv, postActionsDiv);
    postItem.append(postItemInner);
    twitterFeedPostsInner.append(postItem);
    moveInstrumentation(row, postItem);
  });

  twitterFeedPostsContainer.append(twitterFeedPostsInner);
  twitterFeedPosts.append(twitterFeedPostsContainer);
  twitterFeedInner.append(twitterFeedPosts);
  twitterFeedContainer.append(twitterFeedInner);
  elfsightApp.append(twitterFeedContainer);
  twitterFeedSlides.append(elfsightApp);

  const storyCardSlides = document.createElement('div');
  storyCardSlides.classList.add('slides');

  const storyCards = contentRows.filter((row) => row.children.length === 5);
  storyCards.forEach((row) => {
    const [imageCell, categoryCell, textCell, linkCell, dateCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');
    const img = imageCell.querySelector('picture > img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('thumb-img', 'img-fluid');
      moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
      imageWrap.append(optimizedPic);
    }
    wrap.append(imageWrap);

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

    const readMoreLink = document.createElement('a');
    readMoreLink.classList.add('btn', 'btn-link');
    readMoreLink.href = linkCell.querySelector('a')?.href || '#';
    readMoreLink.textContent = 'Read more';
    moveInstrumentation(linkCell, readMoreLink);
    contentWrap.append(readMoreLink);

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('date');
    const time = document.createElement('time');
    // CHECK 1.5: Placeholder date, needs to be extracted from content if available
    time.setAttribute('datetime', '2026-04-07T12:00:00Z');
    time.textContent = dateCell.textContent.trim();
    dateDiv.append(time);
    contentWrap.append(dateDiv);

    wrap.append(contentWrap);
    storyCardSlides.append(wrap);
    moveInstrumentation(row, wrap);
  });

  flickitySliderWrap.append(twitterFeedSlides, storyCardSlides);
  container.append(flickitySliderWrap);
  block.append(container);

  // Optimize all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
