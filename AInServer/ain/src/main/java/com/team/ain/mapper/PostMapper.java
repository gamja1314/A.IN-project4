package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.post.Post;
import com.team.ain.dto.post.PostMedia;

@Mapper
public interface PostMapper {
    // 게시물 생성
    void insertPost(Post post);
    void insertPostMedia(List<PostMedia> mediaList); // Post 대신 PostMedia 리스트 사용

    // 게시물 조회
    Post getPostById(Long id);
    List<Post> getAllPosts();

    // 게시물 수정
    void updatePost(Post post);
    void deletePostMedia(Long postId);
    void deletePostMediaById(Long mediaId);

    // 게시물 삭제
    void deletePostById(Long id);

    // 페이징
    List<Post> getPostsByPage(@Param("page") int page, @Param("size") int size);
    int getTotalPostCount();
}