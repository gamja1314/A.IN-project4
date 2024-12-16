package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.post.Post;

@Mapper
public interface PostMapper {
    // 게시물 생성
    void insertPost(Post post);

    // 게시물 조회
    Post getPostById(int id);

    // 전체 게시물 조회
    List<Post> getAllPosts();

    // 게시물 수정
    void updatePost(Post post);

    // 게시물 삭제 (완전 삭제)
    void deletePostById(int id);

    // 페이징
    List<Post> getPostsByPage(@Param("limit") int limit, @Param("offset") int offset);
}
