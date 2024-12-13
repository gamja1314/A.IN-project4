package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.post.Post;

@Mapper
public interface PostMapper {

    // 게시물 생성
    void insertPost(Post post);

    // 특정 게시물 조회
    Post selectPostById(Long id);

    // 활성화된 게시물 조회
    List<Post> selectActivePosts();

    // 게시물 수정
    void updatePost(Post post);

    // 게시물 상태 변경 (삭제 또는 비활성화)
    void updatePostStatus(@Param("id") Long id, @Param("status") String status);
}