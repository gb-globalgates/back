const bookmarkService = (() => {
//    로그인 회원 정보 조회
    const getMyInfo = async () => {
        const response = await fetch('/api/auth/info');
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    폴더 목록 조회
    const getFolders = async (memberId) => {
        const response = await fetch(`/api/bookmarks/folders/${memberId}`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    폴더 생성
    const createFolder = async (folder) => {
        const response = await fetch('/api/bookmarks/folders', {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    폴더명 수정
    const updateFolder = async (folder) => {
        const response = await fetch('/api/bookmarks/folders', {
            method: 'PATCH',
            body: JSON.stringify(folder),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    폴더 삭제
    const deleteFolder = async (folderId) => {
        const response = await fetch(`/api/bookmarks/folders/${folderId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    북마크 추가
    const addBookmark = async (bookmark) => {
        const response = await fetch('/api/bookmarks', {
            method: 'POST',
            body: JSON.stringify(bookmark),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    북마크 삭제
    const deleteBookmark = async (bookmarkId) => {
        const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    회원/게시글 기준 북마크 삭제
    const deleteBookmarkByPost = async (memberId, postId) => {
        const response = await fetch(`/api/bookmarks/members/${memberId}/posts/${postId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    북마크 폴더 이동
    const updateFolderId = async (bookmarkId, folderId) => {
        const response = await fetch(`/api/bookmarks/${bookmarkId}/folder`, {
            method: 'PATCH',
            body: JSON.stringify({ folderId: folderId }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
    };

//    회원 전체 북마크 조회
    const getBookmarks = async (memberId) => {
        const response = await fetch(`/api/bookmarks/members/${memberId}`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    폴더별 북마크 조회
    const getBookmarksByFolder = async (folderId) => {
        const response = await fetch(`/api/bookmarks/folders/${folderId}/items`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    미분류 북마크 조회
    const getUncategorizedBookmarks = async (memberId) => {
        const response = await fetch(`/api/bookmarks/members/${memberId}/uncategorized`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    회원/게시글 기준 북마크된 폴더 ID 목록 조회
    const getBookmarkedFolderIds = async (memberId, postId) => {
        const response = await fetch(`/api/bookmarks/members/${memberId}/posts/${postId}/folders`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

//    폴더 목록 페이징 조회
    const getFoldersPaged = async (memberId, page, size) => {
        const response = await fetch(`/api/bookmarks/folders/${memberId}/paged?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error(await response.text());
        }
        return await response.json();
    };

    return {
        getMyInfo: getMyInfo,
        getFolders: getFolders,
        createFolder: createFolder,
        updateFolder: updateFolder,
        deleteFolder: deleteFolder,
        addBookmark: addBookmark,
        deleteBookmark: deleteBookmark,
        deleteBookmarkByPost: deleteBookmarkByPost,
        updateFolderId: updateFolderId,
        getBookmarks: getBookmarks,
        getBookmarksByFolder: getBookmarksByFolder,
        getUncategorizedBookmarks: getUncategorizedBookmarks,
        getBookmarkedFolderIds: getBookmarkedFolderIds,
        getFoldersPaged: getFoldersPaged
    };
})();
