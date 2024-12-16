package com.team.ain.mapper;

import com.team.ain.dto.post.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PostMapper {

    // 게시물 생성
    void insertPost(Post post);

    // 게시물 단일 조회
    Post findPostById(@Param("id") Long id);

    // 게시물 수정
    void updatePost(Post post);

    // 게시물 삭제
    void deletePost(@Param("id") Long id);

    // 게시물 목록 조회 (페이지네이션, 인피니트 스크롤 지원)
    List<Post> findPosts(@Param("offset") int offset, @Param("limit") int limit);
}
