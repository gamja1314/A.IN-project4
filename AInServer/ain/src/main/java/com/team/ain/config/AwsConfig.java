package com.team.ain.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AwsConfig {

    @Bean
    public AmazonS3 amazonS3() {
        // .env 파일 경로를 명시적으로 설정
            
        Dotenv dotenv = Dotenv.configure()
            .directory("C:/Users/rlatj/gitHub/A-IN/AInServer/ain") // 절대 경로 지정
            .load();

        // 환경 변수 로드
        String accessKey = dotenv.get("AWS_ACCESS_KEY");
        String secretKey = dotenv.get("AWS_SECRET_KEY");
        String region = dotenv.get("AWS_REGION");

        // 디버깅용 출력
        System.out.println("AWS_ACCESS_KEY: " + accessKey);
        System.out.println("AWS_SECRET_KEY: " + secretKey);
        System.out.println("AWS_REGION: " + region);

        if (accessKey == null || secretKey == null) {
            throw new IllegalArgumentException("AWS Access Key or Secret Key cannot be null.");
        }

        // AWS 자격 증명 설정
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);

        return AmazonS3ClientBuilder.standard()
            .withRegion(region)
            .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
            .build();
    }
    
}
