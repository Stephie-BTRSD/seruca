package com.seruca.dto;
import com.seruca.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class RegisterRequest {
    @NotBlank private String username;
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private User.Role role = User.Role.STUDENT;
    public RegisterRequest() {}
    public String getUsername(){return username;}
    public void setUsername(String u){this.username=u;}
    public String getEmail(){return email;}
    public void setEmail(String e){this.email=e;}
    public String getPassword(){return password;}
    public void setPassword(String p){this.password=p;}
    public String getFirstName(){return firstName;}
    public void setFirstName(String f){this.firstName=f;}
    public String getLastName(){return lastName;}
    public void setLastName(String l){this.lastName=l;}
    public User.Role getRole(){return role;}
    public void setRole(User.Role r){this.role=r;}
}
