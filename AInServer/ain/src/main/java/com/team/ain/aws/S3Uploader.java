package com.team.ain.aws;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.UUID;

import io.github.cdimascio.dotenv.Dotenv;

@Component
public class S3Uploader {

    private final S3Client s3Client;
    private final String bucketName;

    public S3Uploader() {
        // Load environment variables using dotenv
        Dotenv dotenv = Dotenv.load();
        this.bucketName = dotenv.get("AWS_S3_BUCKET_NAME");

        String region = dotenv.get("AWS_REGION");
        String accessKey = dotenv.get("AWS_ACCESS_KEY");
        String secretKey = dotenv.get("AWS_SECRET_KEY");

        // Initialize S3 Client
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        )
                )
                .build();
    }

    /**
     * Upload a file to S3 and return its URL.
     *
     * @param file The file to upload
     * @return The URL of the uploaded file
     */
    public String uploadFile(MultipartFile file) {
        String key = "uploads/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            // Create PutObjectRequest
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            // Upload the file to S3
            s3Client.putObject(
                    putObjectRequest,
                    Paths.get(saveToTemp(file)) // Save MultipartFile as a temporary file
            );

            // Return the URL of the uploaded file
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, s3Client.region().id(), key);

        } catch (Exception e) {
            throw new RuntimeException("파일 업로드 실패: " + e.getMessage(), e);
        }
    }

    /**
     * Save a MultipartFile to the system's temporary directory.
     *
     * @param file MultipartFile
     * @return The path of the saved file
     */
    private String saveToTemp(MultipartFile file) throws IOException {
        String tempFilePath = System.getProperty("java.io.tmpdir") + "/" + file.getOriginalFilename();
        file.transferTo(Paths.get(tempFilePath).toFile());
        return tempFilePath;
    }
}
