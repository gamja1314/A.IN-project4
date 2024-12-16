// package com.team.ain.service;

// import java.io.IOException;
// import java.io.InputStream;
// import java.util.UUID;

// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import com.amazonaws.auth.AWSStaticCredentialsProvider;
// import com.amazonaws.auth.BasicAWSCredentials;
// import com.amazonaws.regions.Regions;
// import com.amazonaws.services.s3.AmazonS3;
// import com.amazonaws.services.s3.AmazonS3ClientBuilder;
// import com.amazonaws.services.s3.model.ObjectMetadata;

// import io.github.cdimascio.dotenv.Dotenv;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class S3Service {

//     private final AmazonS3 amazonS3;

//     private final String bucketName;

//     public S3Service() {
//         Dotenv dotenv = Dotenv.load();
//         String accessKey = dotenv.get("AWS_ACCESS_KEY");
//         String secretKey = dotenv.get("AWS_SECRET_KEY");
//         String region = dotenv.get("AWS_REGION");
//         this.bucketName = dotenv.get("AWS_BUCKET_NAME");

//         BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
//         this.amazonS3 = AmazonS3ClientBuilder.standard()
//                 .withRegion(Regions.fromName(region))
//                 .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
//                 .build();
//     }

//     public String uploadFile(MultipartFile file) {
//         String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//         try (InputStream inputStream = file.getInputStream()) {
//             ObjectMetadata metadata = new ObjectMetadata();
//             metadata.setContentLength(file.getSize());
//             amazonS3.putObject(bucketName, fileName, inputStream, metadata);
//         } catch (IOException e) {
//             throw new RuntimeException("File upload failed", e);
//         }
//         return amazonS3.getUrl(bucketName, fileName).toString();
//     }
// }
package com.team.ain.service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;

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

    public String uploadFile(MultipartFile file) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        try (InputStream inputStream = file.getInputStream()) {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            amazonS3.putObject(bucketName, fileName, inputStream, metadata);
        } catch (IOException e) {
            throw new RuntimeException("File upload failed", e);
        }
        return amazonS3.getUrl(bucketName, fileName).toString();
    }
}
