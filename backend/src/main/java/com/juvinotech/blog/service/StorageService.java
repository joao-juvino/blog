package com.juvinotech.blog.service;

import com.juvinotech.blog.dto.ApiDtos.UploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException; import java.util.*;

@Service
public class StorageService {
    private final String url,key,bucket;
    public StorageService(@Value("${app.storage.supabase-url}")String url,@Value("${app.storage.service-key}")String key,@Value("${app.storage.bucket}")String bucket){this.url=url;this.key=key;this.bucket=bucket;}
    public UploadResponse upload(MultipartFile file)throws IOException{
        if(url.isBlank()||key.isBlank())throw new IllegalStateException("Supabase Storage não configurado");
        String type=Optional.ofNullable(file.getContentType()).orElse("");if(!List.of("image/jpeg","image/png","image/webp","image/gif").contains(type))throw new IllegalArgumentException("Formato de imagem não permitido");
        String ext=switch(type){case "image/png"->"png";case "image/webp"->"webp";case "image/gif"->"gif";default->"jpg";};String name=UUID.randomUUID()+"."+ext;
        RestClient.create().post().uri(url+"/storage/v1/object/"+bucket+"/"+name).header("Authorization","Bearer "+key).header("apikey",key).contentType(MediaType.parseMediaType(type)).body(file.getBytes()).retrieve().toBodilessEntity();
        return new UploadResponse(url+"/storage/v1/object/public/"+bucket+"/"+name);
    }
}
