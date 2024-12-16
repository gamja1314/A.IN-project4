package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.post.Post;

@Mapper
public interface PostMapper {

    // 게시물 생성
    void insertPost(Post post);

    // ID로 게시물 조회
    Post selectPostById(Long id);

    // 전체 게시물 조회 (페이징)
    List<Post> selectAllPosts(int offset, int limit);

    // 게시물 수정
    void updatePost(Post post);

    // 게시물 삭제
    void deletePost(Long id);
}
