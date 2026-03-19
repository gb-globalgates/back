package com.app.globalgates.repository;

import com.app.globalgates.dto.BookmarkFolderDTO;
import com.app.globalgates.mapper.BookmarkFolderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class BookmarkFolderDAO {
    private final BookmarkFolderMapper bookmarkFolderMapper;

//    저장
    public void save(BookmarkFolderDTO bookmarkFolderDTO) {
        bookmarkFolderMapper.insert(bookmarkFolderDTO);
    }

//    수정
    public void update(BookmarkFolderDTO bookmarkFolderDTO) {
        bookmarkFolderMapper.update(bookmarkFolderDTO);
    }

//    삭제
    public void delete(Long id) {
        bookmarkFolderMapper.delete(id);
    }

//    단건 조회
    public Optional<BookmarkFolderDTO> findById(Long id) {
        return bookmarkFolderMapper.selectById(id);
    }

//    회원 폴더 목록 조회
    public List<BookmarkFolderDTO> findAllByMemberId(Long memberId) {
        return bookmarkFolderMapper.selectAllByMemberId(memberId);
    }

//    회원 폴더 목록 페이징 조회
    public List<BookmarkFolderDTO> findAllByMemberIdPaged(Long memberId, int page, int size) {
        return bookmarkFolderMapper.selectAllByMemberIdPaged(memberId, page * size, size);
    }

//    회원 폴더 수 조회
    public int countByMemberId(Long memberId) {
        return bookmarkFolderMapper.selectCountByMemberId(memberId);
    }
}
