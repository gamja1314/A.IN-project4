package com.team.ain.service;

import java.io.IOException;
import java.util.UUID;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.regions.Region;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final Dotenv dotenv = Dotenv.load();

    private final S3Client s3Client = S3Client.builder()
            .region(Region.of(dotenv.get("AWS_REGION")))
            .credentialsProvider(
                    StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(
                                    dotenv.get("AWS_ACCESS_KEY_ID"),
                                    dotenv.get("AWS_SECRET_ACCESS_KEY")
                            )
                    )
            )
            .build();

    private final String bucketName = dotenv.get("AWS_BUCKET_NAME");

    public String uploadFile(MultipartFile file) {
        String filename = generateUniqueFileName(file.getOriginalFilename());

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(filename)
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );
            return "https://" + bucketName + ".s3.amazonaws.com/" + filename;
        } catch (S3Exception | IOException e) {
            log.error("파일 업로드 실패", e);
            throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.");
        }
    }

    private String generateUniqueFileName(String originalFilename) {
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        return UUID.randomUUID().toString() + extension;
    }
    // private final S3Client s3Client; // S3Config에서 Bean으로 생성된 S3Client를 주입받음
    // private final Dotenv dotenv = Dotenv.load();

    // private final String bucketName = dotenv.get("AWS_BUCKET_NAME");

    // public String uploadFile(MultipartFile file) {
    //     String filename = generateUniqueFileName(file.getOriginalFilename());

    //     try {
    //         s3Client.putObject(
    //                 PutObjectRequest.builder()
    //                         .bucket(bucketName)
    //                         .key(filename)
    //                         .build(),
    //                 software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
    //         );
    //         // return "https://" + bucketName + ".s3." + Region.AP_NORTHEAST_2.id() + ".amazonaws.com/" + filename;
    //         return "https://" + bucketName + ".s3." + Region.AP_NORTHEAST_2.toString() + ".amazonaws.com/" + filename;
    //     } catch (S3Exception | IOException e) {
    //         log.error("파일 업로드 실패", e);
    //         throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.");
    //     }
    // }

    // private String generateUniqueFileName(String originalFilename) {
    //     String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
    //     return UUID.randomUUID().toString() + extension;
    // }
}
