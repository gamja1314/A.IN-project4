package com.team.ain.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FollowersMapper {
    void follow(Long followerId, Long followingId);
    void unfollow(Long followerId, Long followingId);
    boolean isFollowing(Long followerId, Long followingId);
    long getFollowerIds(Long memberId);
    int getFollowersCount(Long memberId);
    int getFollowingCount(Long memberId);
}
