package com.juvinotech.blog.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    public record ApiError(int status,String error,String message,Instant timestamp,String path,Map<String,String> fields){}
    @ExceptionHandler(ResourceNotFoundException.class) ResponseEntity<ApiError> notFound(ResourceNotFoundException ex,HttpServletRequest req){return error(HttpStatus.NOT_FOUND,ex.getMessage(),req,Map.of());}
    @ExceptionHandler(ConflictException.class) ResponseEntity<ApiError> conflict(ConflictException ex,HttpServletRequest req){return error(HttpStatus.CONFLICT,ex.getMessage(),req,Map.of());}
    @ExceptionHandler(BadCredentialsException.class) ResponseEntity<ApiError> unauthorized(BadCredentialsException ex,HttpServletRequest req){return error(HttpStatus.UNAUTHORIZED,"E-mail ou senha inválidos",req,Map.of());}
    @ExceptionHandler(IllegalArgumentException.class) ResponseEntity<ApiError> badRequest(IllegalArgumentException ex,HttpServletRequest req){return error(HttpStatus.BAD_REQUEST,ex.getMessage(),req,Map.of());}
    @ExceptionHandler(IllegalStateException.class) ResponseEntity<ApiError> unavailable(IllegalStateException ex,HttpServletRequest req){return error(HttpStatus.SERVICE_UNAVAILABLE,ex.getMessage(),req,Map.of());}
    @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex,HttpServletRequest req){
        Map<String,String> fields=new LinkedHashMap<>(); ex.getBindingResult().getFieldErrors().forEach(e->fields.putIfAbsent(e.getField(),e.getDefaultMessage()));
        return error(HttpStatus.BAD_REQUEST,"Verifique os campos informados",req,fields);
    }
    @ExceptionHandler(Exception.class) ResponseEntity<ApiError> unknown(Exception ex,HttpServletRequest req){return error(HttpStatus.INTERNAL_SERVER_ERROR,"Não foi possível concluir a operação",req,Map.of());}
    private ResponseEntity<ApiError> error(HttpStatus status,String message,HttpServletRequest req,Map<String,String> fields){return ResponseEntity.status(status).body(new ApiError(status.value(),status.getReasonPhrase(),message,Instant.now(),req.getRequestURI(),fields));}
}
