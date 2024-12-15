package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.team.ain.dto.post.Post;
import com.team.ain.mapper.PostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    private final S3Uploader s3Uploader;

    // 게시물 생성
    public void createPost(Post post, MultipartFile file) {
        if (file != null){
            String mediaUrl = s3Uploader.uploadFile(file);
            post.setMediaUrl(mediaUrl);
            post.setMediaType(file.getContentType().startsWith("image") ? "image" : "video");
        }
        post.setStatus("ACTIVE");
        postMapper.insertPost(post);
    }


    // 게시물 수정
    public void updatePost(Long id, Post updatedPost, MultipartFile file){
        // 기존 게시물 조회        
        Post existingPost = postMapper.selectPostById(id);
        if(existingPost == null){
            throw new IllegalArgumentException("해당 게시물이 존재하지 않음");
        }
        // 파일 업로드 처리
        if( file != null){
            try{
                String mediaUrl = s3Uploader.uploadFile(file);
                existingPost.setMediaUrl(mediaUrl);
                existingPost.setMediaType(file.getContentType().startsWith("image")? "image":"video");
            }catch(Exceptoin e){
                throw new RuntimeException("오류가 발생했습니다. :" + e.getMessage(), e);
            }
        }
        // 업데이트 필드만 변경
        if (updatedPost.getContent() != null){
            existingPost.setContent(updatedPost.getContent());
        }
        if (updatedPost.getLocation() != null){
            existingPost.setLocation(updatedPost.getLocation());
        }
        // DB 업데이트
        postMapper.updatePost(existingPost);
    }


    // 특정 게시물 조회
    public Post getPostById(Long id) {
        return postMapper.selectPostById(id);
    }

    // 활성화된 게시물 조회
    public List<Post> getActivePosts(Integer page, Integer size) {
        return postMapper.selectActivePosts();
    }

    // 게시물 상태 변경 (삭제 또는 비활성화)
    @Transactional
    public void updatePostStatus(Long id, String status) {
        postMapper.updatePostStatus(id, status);
    }
}
