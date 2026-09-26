package com.juvinotech.blog.util;
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.assertThat;
class SlugUtilsTest {@Test void removesAccentsAndSymbols(){assertThat(SlugUtils.slugify("Dockerizando uma aplicação Spring Boot! ")).isEqualTo("dockerizando-uma-aplicacao-spring-boot");}@Test void handlesEmptyValues(){assertThat(SlugUtils.slugify("---")).isEqualTo("item");}}
