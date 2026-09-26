package com.juvinotech.blog.dto;

import com.juvinotech.blog.domain.Post;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class ApiDtos {
    private ApiDtos(){}
    public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
    public record LoginResponse(String token,String tokenType,long expiresIn,String name,String email){}
    public record TaxonomyResponse(Long id,String name,String slug){}
    public record ProjectResponse(Long id,String name,String slug,String description,String imageUrl,String githubUrl,String demoUrl,List<String> technologies){}
    public record PostSummary(Long id,String title,String slug,String summary,String coverImageUrl,Post.Status status,boolean featured,Instant publishedAt,int readingTime,TaxonomyResponse category,List<TaxonomyResponse> tags){}
    public record PostResponse(Long id,String title,String slug,String summary,String content,String coverImageUrl,Post.Status status,boolean featured,Instant createdAt,Instant updatedAt,Instant publishedAt,int readingTime,TaxonomyResponse category,List<TaxonomyResponse> tags,ProjectResponse project,List<PostSummary> related){}
    public record PostRequest(
        @NotBlank @Size(max=180) String title,
        @Size(max=220) String slug,
        @NotBlank @Size(max=400) String summary,
        @NotBlank String content,
        @Size(max=500) @Pattern(regexp="^$|https?://.*",message="deve ser uma URL HTTP(S)") String coverImageUrl,
        @NotNull Post.Status status,
        boolean featured,
        @NotNull Long categoryId,
        List<Long> tagIds,
        Long projectId){}
    public record TaxonomyRequest(@NotBlank @Size(max=80) String name,@Size(max=100) String slug){}
    public record ProjectRequest(@NotBlank @Size(max=120) String name,@Size(max=140) String slug,@NotBlank @Size(max=600) String description,@Size(max=500) @Pattern(regexp="^$|https?://.*",message="deve ser uma URL HTTP(S)") String imageUrl,@Size(max=500) @Pattern(regexp="^$|https?://.*",message="deve ser uma URL HTTP(S)") String githubUrl,@Size(max=500) @Pattern(regexp="^$|https?://.*",message="deve ser uma URL HTTP(S)") String demoUrl,List<String> technologies){}
    public record DashboardResponse(long total,long published,long drafts,List<PostSummary> recent){}
    public record UploadResponse(String url){}
}
