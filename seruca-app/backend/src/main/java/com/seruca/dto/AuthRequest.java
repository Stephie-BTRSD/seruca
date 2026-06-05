package com.seruca.dto;
import jakarta.validation.constraints.NotBlank;
public class AuthRequest {
    @NotBlank private String username;
    @NotBlank private String password;
    public AuthRequest() {}
    public String getUsername(){return username;}
    public void setUsername(String u){this.username=u;}
    public String getPassword(){return password;}
    public void setPassword(String p){this.password=p;}
}
