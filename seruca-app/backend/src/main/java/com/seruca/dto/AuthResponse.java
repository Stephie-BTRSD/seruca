package com.seruca.dto;
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    public AuthResponse() {}
    public static AuthResponseBuilder builder(){return new AuthResponseBuilder();}
    public static class AuthResponseBuilder {
        private String token,username,email,role;
        public AuthResponseBuilder token(String t){this.token=t;return this;}
        public AuthResponseBuilder username(String u){this.username=u;return this;}
        public AuthResponseBuilder email(String e){this.email=e;return this;}
        public AuthResponseBuilder role(String r){this.role=r;return this;}
        public AuthResponse build(){AuthResponse a=new AuthResponse();a.token=token;a.username=username;a.email=email;a.role=role;return a;}
    }
    public String getToken(){return token;}
    public void setToken(String t){this.token=t;}
    public String getUsername(){return username;}
    public void setUsername(String u){this.username=u;}
    public String getEmail(){return email;}
    public void setEmail(String e){this.email=e;}
    public String getRole(){return role;}
    public void setRole(String r){this.role=r;}
}
