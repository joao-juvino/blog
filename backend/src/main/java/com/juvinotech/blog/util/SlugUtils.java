package com.juvinotech.blog.util;

import java.text.Normalizer;
import java.util.Locale;

public final class SlugUtils {
    private SlugUtils(){}
    public static String slugify(String value){
        if(value==null || value.isBlank()) return "item";
        String plain=Normalizer.normalize(value,Normalizer.Form.NFD).replaceAll("\\p{M}","");
        String slug=plain.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+","-").replaceAll("(^-|-$)","");
        return slug.isBlank()?"item":slug;
    }
}
