const bookmarkLayout = (() => {
//    HTML 이스케이프
    const escapeHtml = (value) => {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    };

//    SVG 아바타 생성
    const buildAvatarDataUri = (label) => {
        const safeLabel = escapeHtml((label || "?").slice(0, 2));
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="20" fill="#1d9bf0"></rect><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#ffffff">${safeLabel}</text></svg>`;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

//    폴더 아이템 단건 렌더링
    const renderFolderItem = (folder) => {
        const name = escapeHtml(folder.folderName);
        return `<button class="bookmark-item" type="button"
                    data-folder-id="${folder.id}"
                    data-bookmark-folder="${name}"
                    aria-label="${name} 북마크 열기">
                    <span class="bookmark-item-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <path d="M6.75 3h10.5A2.25 2.25 0 0119.5 5.25v15.07a.75.75 0 01-1.2.6L12 16.2l-6.3 4.72a.75.75 0 01-1.2-.6V5.25A2.25 2.25 0 016.75 3z"/>
                        </svg>
                    </span>
                    <span class="bookmark-item-label">${name}</span>
                    <span class="bookmark-item-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"/>
                        </svg>
                    </span>
                </button>`;
    };

//    폴더 목록 렌더링
    const renderFolderList = (folders) => {
        let html = '';
        folders.forEach(folder => {
            html += renderFolderItem(folder);
        });
        return html;
    };

//    북마크 게시글 카드 렌더링
    const renderBookmarkPost = (bookmark) => {
        const title = escapeHtml(bookmark.postTitle || '');
        const content = escapeHtml(bookmark.postContent || '');
        const time = bookmark.createdDatetime || '';
        const postId = bookmark.postId;
        const bookmarkId = bookmark.id;

        return `<article class="bookmark-post" data-post-id="${postId}" data-bookmark-id="${bookmarkId}">
            <div class="bookmark-post-avatar">${title.charAt(0) || 'B'}</div>
            <div class="bookmark-post-body">
                <header class="bookmark-post-header">
                    <div class="bookmark-post-identity">
                        <strong class="bookmark-post-name">${title}</strong>
                        <span class="bookmark-post-time">${time}</span>
                    </div>
                    <div class="bookmark-post-more-wrap">
                        <button class="bookmark-post-more" type="button" aria-label="게시물 더 보기" aria-haspopup="menu" aria-expanded="false" data-post-more>
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></svg>
                        </button>
                        <div class="bookmark-post-more-menu dropdown-menu" role="menu" hidden>
                            <button type="button" class="menu-item menu-item--report" role="menuitem" data-more-action="report">
                                <span class="menu-item__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"></path></svg></span>
                                <span class="menu-item__label">게시물 신고하기</span>
                            </button>
                        </div>
                    </div>
                </header>
                <p class="bookmark-post-text">${content}</p>
                <footer class="bookmark-post-metrics">
                    <div class="bookmark-post-actions">
                        <button type="button" class="bookmark-post-action bookmark-post-action--reply" data-action="reply" aria-label="0 답글">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></svg>
                            <span class="tweet-action-count">0</span>
                        </button>
                        <button type="button" class="bookmark-post-action bookmark-post-action--like" data-action="like" aria-label="좋아요">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></svg>
                            <span>0</span>
                        </button>
                        <div class="bookmark-post-action-right">
                            <button type="button" class="bookmark-post-action bookmark-post-action--bookmark active" data-action="bookmark" aria-label="북마크에 추가됨">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z"></path></svg>
                            </button>
                            <button type="button" class="bookmark-post-action" data-action="share" aria-label="게시물 공유하기" aria-haspopup="menu" aria-expanded="false">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></svg>
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </article>`;
    };

//    북마크 목록 렌더링
    const renderBookmarkPosts = (bookmarks) => {
        let html = '';
        bookmarks.forEach(bookmark => {
            html += renderBookmarkPost(bookmark);
        });
        return html;
    };

//    공유 대화 사용자 행 렌더링
    const renderShareUserRows = (users) => {
        let html = '';
        users.forEach(user => {
            html += `
                <li class="share-chat-user" data-user-id="${user.id}">
                    <img class="share-chat-user__avatar" src="${buildAvatarDataUri(user.name)}" alt="">
                    <div class="share-chat-user__info">
                        <span class="share-chat-user__name">${escapeHtml(user.name)}</span>
                        <span class="share-chat-user__handle">@${escapeHtml(user.handle || '')}</span>
                    </div>
                    <button class="share-chat-user__send" data-share-send="${user.id}">보내기</button>
                </li>
            `;
        });
        return html;
    };

//    공유 모달 폴더 아이템 렌더링 (bookmarkedFolderIds: 이미 북마크된 폴더 ID 목록)
    const renderShareFolderItem = (folder, bookmarkedFolderIds) => {
        const name = escapeHtml(folder.folderName);
        const isBookmarked = bookmarkedFolderIds && bookmarkedFolderIds.includes(folder.id);
        const checkClass = isBookmarked ? 'bookmark-share-sheet-folder-check bookmark-share-sheet-folder-check--active' : 'bookmark-share-sheet-folder-check';
        const checkSvg = isBookmarked
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></svg>'
            : '';
        return `<button type="button" class="bookmark-share-sheet-folder" data-share-folder-id="${folder.id}">
                    <span class="bookmark-share-sheet-folder-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"/>
                        </svg>
                    </span>
                    <span class="bookmark-share-sheet-folder-name">${name}</span>
                    <span class="${checkClass}">${checkSvg}</span>
                </button>`;
    };

//    공유 모달 폴더 목록 렌더링 (모든 북마크 + 폴더들, bookmarkedFolderIds 포함)
    const renderShareFolderList = (folders, bookmarkedFolderIds) => {
        const hasUncategorized = bookmarkedFolderIds && bookmarkedFolderIds.includes(null);
        const allCheckClass = hasUncategorized ? 'bookmark-share-sheet-folder-check bookmark-share-sheet-folder-check--active' : 'bookmark-share-sheet-folder-check';
        const allCheckSvg = hasUncategorized
            ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.64 18.952l-5.55-4.861 1.317-1.504 3.951 3.459 8.459-10.948L19.4 6.32 9.64 18.952z"></path></svg>'
            : '';
        let html = `<button type="button" class="bookmark-share-sheet-folder" data-share-folder-id="">
                    <span class="bookmark-share-sheet-folder-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M2.998 8.5c0-1.38 1.119-2.5 2.5-2.5h9c1.381 0 2.5 1.12 2.5 2.5v14.12l-7-3.5-7 3.5V8.5zM18.5 2H8.998v2H18.5c.275 0 .5.224.5.5V15l2 1.4V4.5c0-1.38-1.119-2.5-2.5-2.5z"/>
                        </svg>
                    </span>
                    <span class="bookmark-share-sheet-folder-name">모든 북마크</span>
                    <span class="${allCheckClass}">${allCheckSvg}</span>
                </button>`;
        folders.forEach(folder => {
            html += renderShareFolderItem(folder, bookmarkedFolderIds);
        });
        return html;
    };

//    빈 상태 표시 동기화
    const syncEmptyState = (container, isEmpty) => {
        const emptyEl = container?.querySelector('[data-empty]');
        if (emptyEl) {
            emptyEl.hidden = !isEmpty;
        }
    };

    return {
        escapeHtml: escapeHtml,
        buildAvatarDataUri: buildAvatarDataUri,
        renderFolderItem: renderFolderItem,
        renderFolderList: renderFolderList,
        renderBookmarkPost: renderBookmarkPost,
        renderBookmarkPosts: renderBookmarkPosts,
        renderShareUserRows: renderShareUserRows,
        renderShareFolderItem: renderShareFolderItem,
        renderShareFolderList: renderShareFolderList,
        syncEmptyState: syncEmptyState
    };
})();
