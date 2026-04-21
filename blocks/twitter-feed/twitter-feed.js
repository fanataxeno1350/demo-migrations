import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Destructure root fields based on BlockJson model
  const [
    profileBannerCell,
    profileImageCell,
    displayNameCell,
    screenNameCell,
    profileLinkCell,
    verifiedIconCell,
    followLinkCell,
    followIconCell,
    followLabelCell,
    postsCountCell,
    followingCountCell,
    followersCountCell,
    ...postRows
  ] = children;

  block.innerHTML = '';
  block.classList.add(
    'elfsight-app-81878be6-2fc1-4ba6-b776-5fb962097235',
    'eapps-twitter-feed',
    'eapps-twitter-feed-source-user',
    'eapps-twitter-feed-color-scheme--dark',
  );

  const container = document.createElement('div');
  container.classList.add(
    'eapps-twitter-feed-container',
    'eapps-twitter-feed-post-x-icon-hide',
    'eapps-twitter-feed-post-reply-hide',
    'eapps-twitter-feed-post-repost-hide',
    'eapps-twitter-feed-post-like-hide',
    'eapps-twitter-feed-post-share-button-hide',
    'eapps-twitter-feed-small',
    'eapps-twitter-feed-hide-header',
  );
  block.append(container);

  const inner = document.createElement('div');
  inner.classList.add('eapps-twitter-feed-inner');
  container.append(inner);

  // Header
  const header = document.createElement('div');
  header.classList.add('eapps-twitter-feed-header', 'eapps-twitter-feed-header-show');
  inner.append(header);

  const headerInner = document.createElement('div');
  headerInner.classList.add('eapps-twitter-feed-header-inner');
  header.append(headerInner);

  // Profile Banner
  const bannerContainer = document.createElement('div');
  bannerContainer.classList.add('eapps-twitter-feed-header-banner-container');
  const profileBannerPicture = profileBannerCell?.querySelector('picture');
  if (profileBannerPicture) {
    const bannerImg = profileBannerPicture.querySelector('img');
    const optimizedBannerPic = createOptimizedPicture(bannerImg.src, bannerImg.alt, false, [{ width: '1920' }]);
    optimizedBannerPic.querySelector('img').classList.add('eapps-twitter-feed-header-banner');
    moveInstrumentation(profileBannerCell, optimizedBannerPic.querySelector('img'));
    bannerContainer.append(optimizedBannerPic);
  }
  headerInner.append(bannerContainer);

  // User Info
  const headerUser = document.createElement('div');
  headerUser.classList.add('eapps-twitter-feed-header-user');
  headerInner.append(headerUser);

  const profileLink = profileLinkCell?.querySelector('a')?.href || '#';

  const userImageLink = document.createElement('a');
  userImageLink.rel = 'nofollow';
  userImageLink.href = profileLink;
  userImageLink.target = '_blank';
  userImageLink.classList.add('eapps-twitter-feed-header-user-image-container');

  const profileImagePicture = profileImageCell?.querySelector('picture');
  if (profileImagePicture) {
    const profileImg = profileImagePicture.querySelector('img');
    const optimizedProfilePic = createOptimizedPicture(profileImg.src, profileImg.alt, false, [{ width: '400' }]);
    optimizedProfilePic.querySelector('img').classList.add('eapps-twitter-feed-header-user-image');
    moveInstrumentation(profileImageCell, optimizedProfilePic.querySelector('img'));
    userImageLink.append(optimizedProfilePic);
  }
  headerUser.append(userImageLink);

  const userInfo = document.createElement('div');
  userInfo.classList.add('eapps-twitter-feed-header-user-info');
  headerUser.append(userInfo);

  const userInfoNameWrapper = document.createElement('div');
  userInfoNameWrapper.classList.add('eapps-twitter-feed-header-user-info-name-wrapper');
  userInfo.append(userInfoNameWrapper);

  const userInfoName = document.createElement('div');
  userInfoName.classList.add('eapps-twitter-feed-header-user-info-name');
  userInfoNameWrapper.append(userInfoName);

  const displayNameLink = document.createElement('a');
  displayNameLink.rel = 'nofollow';
  displayNameLink.href = profileLink;
  displayNameLink.title = `Visit ${displayNameCell?.textContent.trim()} on X (formerly Twitter)`;
  displayNameLink.target = '_blank';
  displayNameLink.textContent = displayNameCell?.textContent.trim() || '';
  moveInstrumentation(displayNameCell, displayNameLink);
  userInfoName.append(displayNameLink);

  const verifiedIconPicture = verifiedIconCell?.querySelector('picture');
  if (verifiedIconPicture) {
    const verifiedIconImg = verifiedIconPicture.querySelector('img');
    const verifiedSpan = document.createElement('span');
    verifiedSpan.classList.add('eapps-twitter-feed-header-user-info-name-verified-container');
    verifiedSpan.title = 'Verified account';
    const optimizedVerifiedPic = createOptimizedPicture(verifiedIconImg.src, verifiedIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(verifiedIconCell, optimizedVerifiedPic.querySelector('img'));
    verifiedSpan.append(optimizedVerifiedPic);
    displayNameLink.append(verifiedSpan);
  }

  const screenNameDiv = document.createElement('div');
  screenNameDiv.classList.add('eapps-twitter-feed-header-user-info-screen-name');
  userInfoNameWrapper.append(screenNameDiv);

  const screenNameLink = document.createElement('a');
  screenNameLink.rel = 'nofollow';
  screenNameLink.href = profileLink;
  screenNameLink.target = '_blank';
  screenNameLink.textContent = screenNameCell?.textContent.trim() || '';
  moveInstrumentation(screenNameCell, screenNameLink);
  screenNameDiv.append(screenNameLink);

  const followLink = followLinkCell?.querySelector('a')?.href || '#';
  const followAnchor = document.createElement('a');
  followAnchor.rel = 'nofollow';
  followAnchor.href = followLink;
  followAnchor.target = '_blank';
  followAnchor.classList.add('eapps-twitter-feed-header-user-info-follow');
  moveInstrumentation(followLinkCell, followAnchor);
  userInfo.append(followAnchor);

  const followIconPicture = followIconCell?.querySelector('picture');
  if (followIconPicture) {
    const followIconImg = followIconPicture.querySelector('img');
    const optimizedFollowPic = createOptimizedPicture(followIconImg.src, followIconImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(followIconCell, optimizedFollowPic.querySelector('img'));
    followAnchor.append(optimizedFollowPic);
  }

  const followLabelSpan = document.createElement('span');
  followLabelSpan.classList.add('eapps-twitter-feed-header-user-info-follow-label');
  followLabelSpan.textContent = followLabelCell?.textContent.trim() || '';
  moveInstrumentation(followLabelCell, followLabelSpan);
  followAnchor.append(followLabelSpan);

  // Statistics
  const statistics = document.createElement('div');
  statistics.classList.add('eapps-twitter-feed-header-statistics');
  headerInner.append(statistics);

  const createStatItem = (name, dataCell, className) => {
    const item = document.createElement('div');
    item.classList.add(`eapps-twitter-feed-header-statistics-${className}`, 'eapps-twitter-feed-header-statistics-item');
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('eapps-twitter-feed-header-statistics-item-name');
    nameDiv.textContent = name;
    item.append(nameDiv);
    const dataDiv = document.createElement('div');
    dataDiv.classList.add('eapps-twitter-feed-header-statistics-item-data');
    dataDiv.textContent = dataCell?.textContent.trim() || '0';
    moveInstrumentation(dataCell, dataDiv);
    item.append(dataDiv);
    return item;
  };

  statistics.append(createStatItem('Posts', postsCountCell, 'posts'));
  statistics.append(createStatItem('Following', followingCountCell, 'following'));
  statistics.append(createStatItem('Followers', followersCountCell, 'followers'));

  // Posts Section
  const postsSection = document.createElement('div');
  postsSection.classList.add('eapps-twitter-feed-posts');
  inner.append(postsSection);

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('eapps-twitter-feed-posts-container');
  postsSection.append(postsContainer);

  const postsInner = document.createElement('div');
  postsInner.classList.add('eapps-twitter-feed-posts-inner', 'shuffle');
  postsContainer.append(postsInner);

  postRows.forEach((row) => {
    // Destructure item row cells based on BlockJson model
    const [
      userImageCell,
      userNameCell,
      userVerifiedIconCell,
      userScreenNameCell,
      postDateCell,
      postLinkCell,
      postLinkIconCell,
      postTextCell,
      mediaCell,
      repostCountCell,
      likeCountCell,
    ] = [...row.children];

    const postItem = document.createElement('div');
    // Determine media items count from original HTML or assume 1 if not explicitly available
    const mediaItemsCount = mediaCell?.children.length > 0 ? mediaCell.children.length : 1;
    postItem.classList.add(
      'eapps-twitter-feed-posts-item',
      `eapps-twitter-feed-posts-item-media-items-${mediaItemsCount}`,
      'eapps-twitter-feed-posts-item-media-show',
      'eapps-twitter-feed-posts-item-show',
      'shuffle-item',
      'shuffle-item--visible',
    );
    moveInstrumentation(row, postItem);
    postsInner.append(postItem);

    const postItemInner = document.createElement('div');
    postItemInner.classList.add('eapps-twitter-feed-posts-item-inner');
    postItem.append(postItemInner);

    // Post User Info
    const postUser = document.createElement('div');
    postUser.classList.add('eapps-twitter-feed-posts-item-user');
    postItemInner.append(postUser);

    const postUserLink = document.createElement('a');
    postUserLink.rel = 'nofollow';
    postUserLink.target = '_blank';
    postUserLink.href = postLinkCell?.querySelector('a')?.href || '#';
    postUser.append(postUserLink);

    const postUserImageContainer = document.createElement('div');
    postUserImageContainer.classList.add('eapps-twitter-feed-posts-item-user-image-container');
    postUserLink.append(postUserImageContainer);

    const userImagePicture = userImageCell?.querySelector('picture');
    if (userImagePicture) {
      const userImg = userImagePicture.querySelector('img');
      const optimizedUserPic = createOptimizedPicture(userImg.src, userImg.alt, false, [{ width: '48' }]);
      optimizedUserPic.querySelector('img').classList.add('eapps-twitter-feed-posts-item-user-image');
      moveInstrumentation(userImageCell, optimizedUserPic.querySelector('img'));
      postUserImageContainer.append(optimizedUserPic);
    }

    const postUserName = document.createElement('div');
    postUserName.classList.add('eapps-twitter-feed-posts-item-user-name');
    postUser.append(postUserName);

    const userNameLink = document.createElement('a');
    userNameLink.rel = 'nofollow';
    userNameLink.target = '_blank';
    userNameLink.href = postLinkCell?.querySelector('a')?.href || '#';
    postUserName.append(userNameLink);

    const userNameSpan = document.createElement('span');
    userNameSpan.textContent = userNameCell?.textContent.trim() || '';
    moveInstrumentation(userNameCell, userNameSpan);
    userNameLink.append(userNameSpan);

    const userVerifiedIconPicture = userVerifiedIconCell?.querySelector('picture');
    if (userVerifiedIconPicture) {
      const userVerifiedImg = userVerifiedIconPicture.querySelector('img');
      const userVerifiedSpan = document.createElement('span');
      userVerifiedSpan.classList.add('eapps-twitter-feed-posts-item-user-name-verified');
      userVerifiedSpan.title = 'Verified account';
      const optimizedUserVerifiedPic = createOptimizedPicture(userVerifiedImg.src, userVerifiedImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(userVerifiedIconCell, optimizedUserVerifiedPic.querySelector('img'));
      userVerifiedSpan.append(optimizedUserVerifiedPic);
      userNameLink.append(userVerifiedSpan);
    }

    const userScreenNameDiv = document.createElement('div');
    userScreenNameDiv.classList.add('eapps-twitter-feed-posts-item-user-screen-name');
    postUserName.append(userScreenNameDiv);

    const userScreenNameLink = document.createElement('a');
    userScreenNameLink.rel = 'nofollow';
    userScreenNameLink.target = '_blank';
    userScreenNameLink.href = postLinkCell?.querySelector('a')?.href || '#';
    userScreenNameLink.textContent = userScreenNameCell?.textContent.trim() || '';
    moveInstrumentation(userScreenNameCell, userScreenNameLink);
    userScreenNameDiv.append(userScreenNameLink);

    const postDateSpan = document.createElement('span');
    postDateSpan.classList.add('eapps-twitter-feed-posts-item-user-date');
    postDateSpan.textContent = postDateCell?.textContent.trim() || '';
    moveInstrumentation(postDateCell, postDateSpan);
    userScreenNameDiv.append(postDateSpan);

    const postUserPost = document.createElement('div');
    postUserPost.classList.add('eapps-twitter-feed-posts-item-user-post');
    postUser.append(postUserPost);

    const postLinkAnchor = document.createElement('a');
    postLinkAnchor.rel = 'nofollow';
    postLinkAnchor.href = postLinkCell?.querySelector('a')?.href || '#';
    postLinkAnchor.target = '_blank';
    postLinkAnchor.title = 'View on X';
    moveInstrumentation(postLinkCell, postLinkAnchor);
    postUserPost.append(postLinkAnchor);

    const postLinkIconPicture = postLinkIconCell?.querySelector('picture');
    if (postLinkIconPicture) {
      const postLinkIconImg = postLinkIconPicture.querySelector('img');
      const optimizedPostLinkIconPic = createOptimizedPicture(postLinkIconImg.src, postLinkIconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(postLinkIconCell, optimizedPostLinkIconPic.querySelector('img'));
      postLinkAnchor.append(optimizedPostLinkIconPic);
    }

    // Post Text (richtext field)
    const postTextDiv = document.createElement('div');
    postTextDiv.classList.add('eapps-twitter-feed-posts-item-text');
    postTextDiv.innerHTML = postTextCell?.innerHTML || ''; // Use innerHTML for richtext
    moveInstrumentation(postTextCell, postTextDiv);
    postItemInner.append(postTextDiv);

    // Media
    const postMediaDiv = document.createElement('div');
    postMediaDiv.classList.add('eapps-twitter-feed-posts-item-media', 'eapps-twitter-feed-posts-item-media-visible');
    postItemInner.append(postMediaDiv);

    const mediaImagePicture = mediaCell?.querySelector('picture');
    if (mediaImagePicture) {
      const mediaItem = document.createElement('div');
      mediaItem.classList.add('eapps-twitter-feed-posts-item-media-item-type-image', 'eapps-twitter-feed-posts-item-media-item');
      const mediaLink = document.createElement('a');
      mediaLink.rel = 'nofollow';
      mediaLink.href = postLinkCell?.querySelector('a')?.href || '#';
      mediaLink.target = '_blank';
      mediaLink.ariaLabel = `Watch ${userNameCell?.textContent.trim()}'s video post on X`;

      const mediaImg = mediaImagePicture.querySelector('img');
      const optimizedMediaPic = createOptimizedPicture(mediaImg.src, mediaImg.alt, false, [{ width: '750' }]);
      optimizedMediaPic.querySelector('img').classList.add('eapps-twitter-feed-posts-item-media-item-image');
      moveInstrumentation(mediaCell, optimizedMediaPic.querySelector('img'));
      
      // Check if the media is a video
      if (/\.(mp4|webm|ogg|mov)$/i.test(mediaImg.src)) {
        const video = document.createElement('video');
        video.src = mediaImg.src;
        video.autoplay = false;
        video.muted = true;
        video.playsInline = true;
        video.loop = false;
        video.controls = true;
        video.classList.add('eapps-twitter-feed-posts-item-media-item-image');
        mediaItem.append(video); // Append video directly to mediaItem
      } else {
        mediaLink.append(optimizedMediaPic);
        mediaItem.append(mediaLink);
      }
      postMediaDiv.append(mediaItem);
    }

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('eapps-twitter-feed-posts-item-actions');
    postItemInner.append(actionsDiv);

    const createActionItem = (title, iconSrc, countCell, className) => {
      const actionLink = document.createElement('a');
      actionLink.rel = 'nofollow';
      // Use actual href from original HTML if available, otherwise placeholder
      actionLink.href = '#'; 
      if (className.includes('comments')) {
        actionLink.href = `https://x.com/intent/tweet?in_reply_to=${postLinkCell?.querySelector('a')?.href.split('/').pop()}&related=${userNameCell?.textContent.trim()}`;
      } else if (className.includes('repost')) {
        actionLink.href = `https://x.com/intent/retweet?tweet_id=${postLinkCell?.querySelector('a')?.href.split('/').pop()}&related=${userNameCell?.textContent.trim()}`;
      } else if (className.includes('likes')) {
        actionLink.href = `https://x.com/intent/like?tweet_id=${postLinkCell?.querySelector('a')?.href.split('/').pop()}&related=${userNameCell?.textContent.trim()}`;
      }

      actionLink.title = title;
      actionLink.target = '_blank'; // Open in new tab for actions
      actionLink.classList.add('eapps-twitter-feed-posts-item-actions-item', className);

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
      const iconImg = document.createElement('img');
      iconImg.alt = 'svg file';
      iconImg.src = iconSrc;
      iconDiv.append(iconImg);
      actionLink.append(iconDiv);

      if (countCell) {
        const countDiv = document.createElement('div');
        countDiv.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
        countDiv.textContent = countCell.textContent.trim() || '0';
        moveInstrumentation(countCell, countDiv);
        actionLink.append(countDiv);
      }
      return actionLink;
    };

    actionsDiv.append(createActionItem('Reply', '/content/dam/aemigrate/uploaded-folder/image/1776769073916.svg+xml', null, 'eapps-twitter-feed-posts-item-actions-item-comments'));
    actionsDiv.append(createActionItem('Repost', '/content/dam/aemigrate/uploaded-folder/image/1776769074022.svg+xml', repostCountCell, 'eapps-twitter-feed-posts-item-actions-item-repost'));
    actionsDiv.append(createActionItem('Like', '/content/dam/aemigrate/uploaded-folder/image/1776769074250.svg+xml', likeCountCell, 'eapps-twitter-feed-posts-item-actions-item-likes'));

    // Share button
    const shareDiv = document.createElement('div');
    shareDiv.classList.add('eapps-twitter-feed-posts-item-actions-item', 'eapps-twitter-feed-posts-item-actions-item-share');
    actionsDiv.append(shareDiv);

    const shareIconSpan = document.createElement('span');
    shareIconSpan.classList.add('eapps-twitter-feed-posts-item-actions-item-icon');
    const shareIconImg = document.createElement('img');
    shareIconImg.alt = 'svg file';
    shareIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776769074350.svg+xml';
    shareIconSpan.append(shareIconImg);
    shareDiv.append(shareIconSpan);

    const shareTextSpan = document.createElement('span');
    shareTextSpan.classList.add('eapps-twitter-feed-posts-item-actions-item-text');
    shareTextSpan.textContent = 'Share';
    shareDiv.append(shareTextSpan);

    // Popover for share options
    const popover = document.createElement('div');
    popover.classList.add('eui-popover', 'eui-popover-left');
    const popoverContent = document.createElement('div');
    popoverContent.classList.add('eui-popover-content');
    const popoverContentInner = document.createElement('div');
    popoverContentInner.classList.add('eui-popover-content-inner');
    popoverContent.append(popoverContentInner);
    popover.append(popoverContent);
    shareDiv.append(popover);

    const createPopoverItem = (title, iconSrc, shareUrl) => {
      const item = document.createElement('div');
      item.classList.add('eui-popover-content-item');
      const itemIcon = document.createElement('div');
      itemIcon.classList.add('eui-popover-content-item-icon');
      const icon = document.createElement('img');
      icon.src = iconSrc;
      itemIcon.append(icon);
      item.append(itemIcon);
      const itemTitle = document.createElement('div');
      itemTitle.classList.add('eui-popover-content-item-title');
      itemTitle.textContent = title;
      item.append(itemTitle);

      // Add event listener for share functionality
      item.addEventListener('click', () => {
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
      });
      return item;
    };

    const postUrl = postLinkCell?.querySelector('a')?.href || window.location.href;
    const postText = postTextCell?.textContent.trim() || '';

    popoverContentInner.append(createPopoverItem('Share on Facebook', 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIDx0aXRsZT5zb2NpYWwtbmV0d29ya3MvZmFjZWJvb2stbXVsdGljb2xvcjwvdGl0bGU+DQogICAgPGcgaWQ9InNvY2lhbC1uZXR3b3Jrcy9mYWNlYm9vay1tdWx0aWNvbG9yIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICAgICAgPGNpcmNsZSBpZD0iaWNvbi1jb2xvciIgZmlsbD0iIzAwNzZGQiIgZmlsbC1ydWxlPSJub256ZXJvIiBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPg0KICAgICAgICA8cGF0aCBkPSJNMTYuMTY2NjY2Nyw2LjE2NjY2NjY3IEwxNi4xNjY2NjY3LDguODA1NTYyMzUgTDE0LjMyNTA1OTQsOC44MDU1NjIzNSBDMTMuNzQ2MzM2LDguODA1NTYyMzUgMTMuMjc3MTU4MSw5LjI2NzI5MzU4IDEzLjI3NzE1ODEsOS44MzY4MzE0MyBMMTMuMjc3MTU4MSwxMS44NzY3MDU4IEwxNi4xMjA0MDAzLDExLjg3NjcwNTggTDE1LjcyNzQ0NzgsMTQuODExMzM0OSBMMTMuMjc3MTU4MSwxNC44MTEzMzQ5IEwxMy4yNzcyNzExLDIxLjg3Nzc2NzQgQzEyLjc1NjYyMywyMS45NTgyMzE5IDEyLjIyMjk5MjEsMjIgMTEuNjc5NDg3MiwyMiBDMTEuMjEwMDkzNCwyMiAxMC43NDgwNjQ0LDIxLjk2ODg0NjEgMTAuMjk1NDAyOCwyMS45MDg1MTcgTDEwLjI5NTE5OTksMTQuODExMjk0IEw3LjgzMzMzMzMzLDE0LjgxMTI5NCBMNy44MzMzMzMzMywxMS44NzY2NjQ5IEwxMC4yOTUxOTk5LDExLjg3NjY2NDkgTDEwLjI5NTE5OTksOS40MTIwOTc1OCBDMTAuMjk1MTk5OSw3LjYxOTY4ODY1IDExLjc3MTY1Niw2LjE2NjY2NjY3IDEzLjU5Mjk3MjUsNi4xNjY2NjY2NyBMMTYuMTY2NjY2Nyw2LjE2NjY2NjY3IFoiIGlkPSJpY29uLWNvbG9yIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4NCiAgICA8L2c+DQo8L3N2Zz4=', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(postText)}`));
    popoverContentInner.append(createPopoverItem('Share on X', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xNy40NjM2IDMuNDA0NzVIMjAuMzc3MUwxNC4wMTIgMTAuNjg2NUwyMS41IDIwLjU5NTJIMTUuNjM3TDExLjA0NDggMTQuNTg1Nkw1Ljc5MDQxIDIwLjU5NTJIMi44NzUxOUw5LjY4MzI0IDEyLjgwNjZMMi41IDMuNDA0NzVIOC41MTE4N0wxMi42NjI4IDguODk3NzdMMTcuNDYzNiAzLjQwNDc1Wk0xNi40NDExIDE4Ljg0OTdIMTguMDU1NUw3LjYzNDY2IDUuMDU4NjYINS45MDIyNkwxNi40NDExIDE4Ljg0OTdaIiBmaWxsPSJibGFjayIvPg0KPC9zdmc+DQo=', `https://x.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(postUrl)}`));

    // Toggle popover visibility on share button click
    shareDiv.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent event from bubbling up and closing immediately
      popover.classList.toggle('eui-popover-active');
    });

    // Close popover when clicking outside
    document.addEventListener('click', (event) => {
      if (!shareDiv.contains(event.target) && popover.classList.contains('eui-popover-active')) {
        popover.classList.remove('eui-popover-active');
      }
    });

    // Post Date (bottom)
    const bottomDateDiv = document.createElement('div');
    bottomDateDiv.classList.add('eapps-twitter-feed-posts-item-date');
    bottomDateDiv.textContent = postDateCell?.textContent.trim() || '';
    postItemInner.append(bottomDateDiv);
  });

  // Load More button (simplified, no actual functionality)
  const showMoreDiv = document.createElement('div');
  showMoreDiv.classList.add('eapps-twitter-feed-posts-show-more', 'eapps-twitter-feed-posts-show-more-hide');
  showMoreDiv.textContent = 'Load more Posts';
  postsContainer.append(showMoreDiv);

  const showMoreLoaderContainer = document.createElement('div');
  showMoreLoaderContainer.classList.add('eapps-twitter-feed-posts-show-more-loader-container');
  const showMoreLoader = document.createElement('div');
  showMoreLoader.classList.add('eapps-twitter-feed-posts-show-more-loader');
  const showMoreLoaderInner = document.createElement('div');
  showMoreLoaderInner.classList.add('eapps-twitter-feed-posts-show-more-loader-inner');
  showMoreLoader.append(showMoreLoaderInner);
  showMoreLoaderContainer.append(showMoreLoader);
  showMoreDiv.append(showMoreLoaderContainer);

  // Error and Loader containers (simplified, no actual functionality)
  const errorDiv = document.createElement('div');
  errorDiv.classList.add('eapps-twitter-feed-error');
  inner.append(errorDiv);

  const loaderContainer = document.createElement('div');
  loaderContainer.classList.add('eapps-twitter-feed-loader-container', 'eapps-loader-container', 'eapps-loader-hide');
  const loader = document.createElement('div');
  loader.classList.add('eapps-loader');
  const loaderInner = document.createElement('div');
  loaderInner.classList.add('eapps-loader-inner');
  loader.append(loaderInner);
  loaderContainer.append(loader);
  inner.append(loaderContainer);
}
