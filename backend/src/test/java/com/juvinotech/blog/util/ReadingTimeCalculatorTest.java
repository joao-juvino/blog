package com.juvinotech.blog.util;
import org.junit.jupiter.api.Test;import static org.assertj.core.api.Assertions.assertThat;
class ReadingTimeCalculatorTest {@Test void minimumIsOneMinute(){assertThat(ReadingTimeCalculator.calculate("texto curto")).isEqualTo(1);}@Test void roundsUpReadingTime(){assertThat(ReadingTimeCalculator.calculate("palavra ".repeat(221))).isEqualTo(2);}@Test void ignoresFencedCode(){assertThat(ReadingTimeCalculator.calculate("```java\n"+"code ".repeat(500)+"\n``` texto")).isEqualTo(1);}}
