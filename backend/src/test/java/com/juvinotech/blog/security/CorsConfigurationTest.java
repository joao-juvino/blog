package com.juvinotech.blog.security;

import org.junit.jupiter.api.Test;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;

class CorsConfigurationTest {
    @Test
    void allowsConfiguredFrontendOriginAndLoginPreflight() {
        SecurityConfig config = new SecurityConfig(null);
        var source = (UrlBasedCorsConfigurationSource) config.corsConfigurationSource(
            "http://localhost:4200,http://localhost:8081"
        );
        CorsConfiguration cors = source.getCorsConfigurations().get("/**");

        assertThat(cors.checkOrigin("http://localhost:8081")).isEqualTo("http://localhost:8081");
        assertThat(cors.getAllowedMethods()).contains("GET", "POST", "OPTIONS");
        assertThat(cors.getAllowedHeaders()).contains("Content-Type", "Authorization");
    }
}
