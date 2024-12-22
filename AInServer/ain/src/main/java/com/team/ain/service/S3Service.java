package com.team.ain.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import io.github.cdimascio.dotenv.Dotenv;

@Service
public class S3Service {

    private final AmazonS3 amazonS3;
    private final String bucketName;

    public S3Service(AmazonS3 amazonS3) {
        Dotenv dotenv = Dotenv.configure().load();
        this.amazonS3 = amazonS3;
        this.bucketName = dotenv.get("AWS_BUCKET_NAME");

        if (this.bucketName == null) {
            throw new IllegalArgumentException("AWS_BUCKET_NAME cannot be null.");
        }
    }

    public String uploadFile(MultipartFile file, String directory) {
        // 파일 검증
        validateFile(file);

        // 파일명 생성 (디렉토리 포함)
        String fileName = createFileName(file.getOriginalFilename(), directory);

        try (InputStream inputStream = file.getInputStream()) {
            // 메타데이터 설정
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());
            
            // S3에 업로드 - ACL 설정 제거
            amazonS3.putObject(new PutObjectRequest(
                bucketName, 
                fileName, 
                inputStream, 
                metadata
            ));

            // 파일 URL 반환
            return amazonS3.getUrl(bucketName, fileName).toString();
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }

    // 나머지 메소드들은 그대로 유지
    public void deleteFile(String fileUrl) {
        String fileName = extractFileKeyFromUrl(fileUrl);
        try {
            amazonS3.deleteObject(bucketName, fileName);
        } catch (Exception e) {
            throw new RuntimeException("파일 삭제 실패", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("빈 파일입니다.");
        }

        // 파일 크기 검증 (10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("파일 크기는 10MB를 초과할 수 없습니다.");
        }

        // 파일 타입 검증
        String contentType = file.getContentType();
        if (contentType == null || !(
            contentType.startsWith("image/") || 
            contentType.startsWith("video/") ||
            contentType.equals("application/octet-stream")
        )) {
            throw new IllegalArgumentException("지원하지 않는 파일 형식입니다.");
        }
    }

    private String createFileName(String originalFileName, String directory) {
        return directory + "/" + UUID.randomUUID().toString() + "_" + originalFileName;
    }

    private String extractFileKeyFromUrl(String fileUrl) {
        try {
            URL url = new URL(fileUrl);
            String path = url.getPath();
            return path.substring(path.indexOf('/', 1) + 1);
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("잘못된 파일 URL입니다.", e);
        }
    }
}