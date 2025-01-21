package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team.ain.dto.story.StoryCommentDTO;
import com.team.ain.mapper.StoryCommentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryCommentService {
    
    private final StoryCommentMapper storyCommentMapper;
    private final MemberService memberService;
    
    // 댓글 작성
    @Transactional  // 멤버 확인과 댓글 작성이 하나의 트랜잭션으로 처리되어야 함
    public void createComment(StoryCommentDTO comment) {
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("댓글 내용을 입력해주세요.");
        }

        // 멤버 존재 여부 확인
        memberService.findNameAndProfileUrlById(comment.getMemberId());
        
        try {
            storyCommentMapper.insertComment(comment);
            log.info("댓글 작성 성공 - 스토리 ID: {}, 작성자 ID: {}", 
                comment.getStoryId(), comment.getMemberId());
        } catch (Exception e) {
            log.error("댓글 작성 실패: ", e);
            throw new RuntimeException("댓글 작성에 실패했습니다.");
        }
    }
    
    // 스토리의 모든 댓글 조회
    public List<StoryCommentDTO> getCommentsByStoryId(Long storyId) {
        try {
            List<StoryCommentDTO> comments = storyCommentMapper.findCommentsByStoryId(storyId);
            
            // 각 댓글에 대한 답글 조회도 함께 수행
            for (StoryCommentDTO comment : comments) {
                List<StoryCommentDTO> replies = storyCommentMapper.findRepliesByCommentId(comment.getId());
                comment.setReplies(replies);
            }
            
            return comments;
        } catch (Exception e) {
            log.error("댓글 조회 실패 - 스토리 ID: {}", storyId, e);
            throw new RuntimeException("댓글 목록을 가져오는데 실패했습니다.");
        }
    }
    
    // 특정 댓글의 답글 조회
    public List<StoryCommentDTO> getRepliesByCommentId(Long commentId) {
        try {
            List<StoryCommentDTO> replies = storyCommentMapper.findRepliesByCommentId(commentId);
            log.info("답글 조회 성공 - 댓글 ID: {}, 조회된 답글 수: {}", commentId, replies.size());
            return replies;
        } catch (Exception e) {
            log.error("답글 조회 실패 - 댓글 ID: {}", commentId, e);
            throw new RuntimeException("답글 목록을 가져오는데 실패했습니다.");
        }
    }
    
    // 댓글 삭제 (작성자만 삭제 가능)
    @Transactional  // 삭제 작업은 트랜잭션으로 처리
    public void deleteComment(Long commentId, Long memberId) {
        try {
            // 댓글 작성자 확인
            StoryCommentDTO comment = storyCommentMapper.findCommentById(commentId);
            if (comment == null) {
                throw new IllegalArgumentException("존재하지 않는 댓글입니다.");
            }
            if (!comment.getMemberId().equals(memberId)) {
                throw new IllegalArgumentException("댓글 작성자만 삭제할 수 있습니다.");
            }
            
            storyCommentMapper.deleteComment(commentId, memberId);
            log.info("댓글 삭제 성공 - 댓글 ID: {}, 삭제자 ID: {}", commentId, memberId);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("댓글 삭제 실패 - 댓글 ID: {}, 멤버 ID: {}", commentId, memberId, e);
            throw new RuntimeException("댓글 삭제에 실패했습니다.");
        }
    }
    
    // 댓글 상세 조회
    public StoryCommentDTO getCommentById(Long commentId) {
        try {
            StoryCommentDTO comment = storyCommentMapper.findCommentById(commentId);
            if (comment == null) {
                throw new IllegalArgumentException("존재하지 않는 댓글입니다.");
            }
            return comment;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            log.error("댓글 상세 조회 실패 - 댓글 ID: {}", commentId, e);
            throw new RuntimeException("댓글을 찾을 수 없습니다.");
        }
    }
}