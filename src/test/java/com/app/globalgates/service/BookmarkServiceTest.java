package com.app.globalgates.service;

import com.app.globalgates.dto.BookmarkDTO;
import com.app.globalgates.dto.BookmarkFolderDTO;
import com.app.globalgates.repository.BookmarkDAO;
import com.app.globalgates.repository.BookmarkFolderDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class BookmarkServiceTest {

    @Autowired
    private BookmarkService bookmarkService;

    @Autowired
    private BookmarkFolderDAO bookmarkFolderDAO;

    @Autowired
    private BookmarkDAO bookmarkDAO;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Long memberId;
    private Long postId;

    @BeforeEach
    void setUp() {
        jdbcTemplate.update(
                "insert into tbl_member (member_email, member_password, member_nickname) values (?, ?, ?) on conflict (member_email) do nothing",
                "service-test@test.com", "password123", "서비스테스트유저"
        );
        memberId = jdbcTemplate.queryForObject(
                "select id from tbl_member where member_email = ?", Long.class, "service-test@test.com"
        );

        jdbcTemplate.update(
                "insert into tbl_post (member_id, title, content) values (?, ?, ?)",
                memberId, "서비스 테스트 게시글", "서비스 테스트 내용"
        );
        postId = jdbcTemplate.queryForObject(
                "select id from tbl_post where member_id = ? order by id desc limit 1", Long.class, memberId
        );
    }

    @Test
    @DisplayName("폴더를 생성하고 조회할 수 있다")
    void createFolderAndGetFolders() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("서비스 폴더");

        bookmarkService.createFolder(folderDTO);

        List<BookmarkFolderDTO> result = bookmarkService.getFolders(memberId);
        assertThat(result).extracting(BookmarkFolderDTO::getFolderName).contains("서비스 폴더");
    }

    @Test
    @DisplayName("북마크를 추가하고 회원 기준으로 조회할 수 있다")
    void addBookmarkAndGetBookmarks() {
        BookmarkDTO bookmarkDTO = new BookmarkDTO();
        bookmarkDTO.setMemberId(memberId);
        bookmarkDTO.setPostId(postId);

        bookmarkService.addBookmark(bookmarkDTO);

        List<BookmarkDTO> result = bookmarkService.getBookmarks(memberId);
        assertThat(result).isNotEmpty();
    }

    @Test
    @DisplayName("폴더 삭제 시 연결된 북마크의 folderId를 비운다")
    void deleteFolder() {
        BookmarkFolderDTO folderDTO = new BookmarkFolderDTO();
        folderDTO.setMemberId(memberId);
        folderDTO.setFolderName("삭제 폴더");
        bookmarkFolderDAO.save(folderDTO);

        BookmarkDTO bookmarkDTO = new BookmarkDTO();
        bookmarkDTO.setMemberId(memberId);
        bookmarkDTO.setPostId(postId);
        bookmarkDTO.setFolderId(folderDTO.getId());
        bookmarkDAO.save(bookmarkDTO);

        bookmarkService.deleteFolder(folderDTO.getId());

        assertThat(bookmarkDAO.findById(bookmarkDTO.getId())).isPresent();
        assertThat(bookmarkDAO.findById(bookmarkDTO.getId()).get().getFolderId()).isNull();
    }
}
