package com.app.globalgates.service;

import com.app.globalgates.common.pagination.Criteria;
import com.app.globalgates.dto.BlockDTO;
import com.app.globalgates.dto.BlockWithPagingDTO;
import com.app.globalgates.repository.BlockDAO;
import com.app.globalgates.repository.MemberBlockDAO;
import com.app.globalgates.repository.chat.ChatRoomDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class BlockService {
    private final BlockDAO blockDAO;
    private final ChatRoomDAO chatRoomDAO;
    private final MemberBlockDAO memberBlockDAO;
    private final S3Service s3Service;

    //    차단 추가
    @CacheEvict(value = {"post:list", "page:search"}, allEntries = true)
    public void block(BlockDTO blockDTO) {
        blockDAO.save(blockDTO);
    }

    //    차단 해제
    public void unblock(Long blockerId, Long blockedId) {
        blockDAO.delete(blockerId, blockedId);
    }

    //    차단 여부 조회
    public Optional<BlockDTO> getBlock(Long blockerId, Long blockedId) {
        return blockDAO.findByBlockerIdAndBlockedId(blockerId, blockedId);
    }

    //    차단 목록 조회
    public List<BlockDTO> getBlockList(Long blockerId) {
        return blockDAO.findAllByBlockerId(blockerId);
    }

    //  차단 목록 조회(페이징)
    public BlockWithPagingDTO getBlockListByMemberId(int page, Long memberId) {
        BlockWithPagingDTO blockWithPagingDTO = new BlockWithPagingDTO();
        Criteria criteria = new Criteria(page, memberBlockDAO.getTotalByMemberId(memberId));

        List<BlockDTO> blocks = memberBlockDAO.findAllByMemberIdWithPaging(criteria, memberId);

        criteria.setHasMore(blocks.size() > criteria.getRowCount());

        if (criteria.isHasMore()) {
            blocks.remove(blocks.size() - 1);
        }

        // setting 카드가 바로 img src로 쓸 수 있게 여기서 URL로 바꿔서 내린다.
        blocks.forEach(block -> {
            String fileName = block.getProfileImageFileName();

            if (fileName == null || fileName.isBlank()) {
                block.setProfileImageUrl("/images/main/global-gates-logo.png");
                return;
            }

            try {
                block.setProfileImageUrl(
                        s3Service.getPresignedUrl(fileName, java.time.Duration.ofMinutes(10))
                );
            } catch (java.io.IOException e) {
                block.setProfileImageUrl("/images/main/global-gates-logo.png");
            }
        });

        blockWithPagingDTO.setCriteria(criteria);
        blockWithPagingDTO.setBlocks(blocks);
        return blockWithPagingDTO;
    }

//    양방향 차단 여부 조회 (채팅 연동용)
    public boolean isBlockedEither(Long memberId1, Long memberId2) {
        return blockDAO.isBlockedEither(memberId1, memberId2);
    }

//    차단 추가 + 대화방 차단 시점 기록
    @Transactional
    public void blockWithConversation(BlockDTO blockDTO, Long conversationId, Long lastMessageId) {
        blockDAO.save(blockDTO);
        chatRoomDAO.updateBlockedAfterMessageId(conversationId, blockDTO.getBlockerId(), lastMessageId);
    }

//    차단 해제 + 대화방 차단 해제 시점 기록
    @Transactional
    public void unblockWithConversation(Long blockerId, Long blockedId, Long conversationId, Long lastMessageId) {
        blockDAO.delete(blockerId, blockedId);
        chatRoomDAO.updateBlockReleasedMessageId(conversationId, blockerId, lastMessageId);
    }
}
