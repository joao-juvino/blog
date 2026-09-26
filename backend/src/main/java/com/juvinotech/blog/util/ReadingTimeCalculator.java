package com.juvinotech.blog.util;

public final class ReadingTimeCalculator {
    private static final int WORDS_PER_MINUTE=220;
    private ReadingTimeCalculator(){}
    public static int calculate(String markdown){
        if(markdown==null || markdown.isBlank()) return 1;
        String text=markdown.replaceAll("```[\\s\\S]*?```"," ").replaceAll("[`#>*_\\[\\]()]"," ").trim();
        int words=text.isBlank()?0:text.split("\\s+").length;
        return Math.max(1,(int)Math.ceil(words/(double)WORDS_PER_MINUTE));
    }
}
