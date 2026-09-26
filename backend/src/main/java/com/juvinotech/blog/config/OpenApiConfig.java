package com.juvinotech.blog.config;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.*;
@Configuration public class OpenApiConfig {@Bean OpenAPI api(){return new OpenAPI().info(new Info().title("Juvino Tech API").version("1.0").description("API REST do blog técnico")).addSecurityItem(new SecurityRequirement().addList("bearerAuth")).components(new io.swagger.v3.oas.models.Components().addSecuritySchemes("bearerAuth",new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));}}
