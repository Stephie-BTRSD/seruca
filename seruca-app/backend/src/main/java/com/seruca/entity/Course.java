package com.seruca.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name="courses")
public class Course {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="TEXT") private String description;
    @Column(nullable=false) private String code;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="lecturer_id") private User lecturer;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id") private TaxonomyCategory category;
    @Enumerated(EnumType.STRING) private Status status;
    @Column(updatable=false) private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public Course(){}
    public static CourseBuilder builder(){return new CourseBuilder();}
    public static class CourseBuilder{
        private Long id;private String title,description,code;private User lecturer;private TaxonomyCategory category;private Status status;
        public CourseBuilder id(Long i){this.id=i;return this;}
        public CourseBuilder title(String t){this.title=t;return this;}
        public CourseBuilder description(String d){this.description=d;return this;}
        public CourseBuilder code(String c){this.code=c;return this;}
        public CourseBuilder lecturer(User l){this.lecturer=l;return this;}
        public CourseBuilder category(TaxonomyCategory c){this.category=c;return this;}
        public CourseBuilder status(Status s){this.status=s;return this;}
        public Course build(){Course c=new Course();c.id=id;c.title=title;c.description=description;c.code=code;c.lecturer=lecturer;c.category=category;c.status=status;return c;}
    }
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();updatedAt=LocalDateTime.now();}
    @PreUpdate protected void onUpdate(){updatedAt=LocalDateTime.now();}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
    public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
    public String getCode(){return code;} public void setCode(String c){this.code=c;}
    public User getLecturer(){return lecturer;} public void setLecturer(User l){this.lecturer=l;}
    public TaxonomyCategory getCategory(){return category;} public void setCategory(TaxonomyCategory c){this.category=c;}
    public Status getStatus(){return status;} public void setStatus(Status s){this.status=s;}
    public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
    public enum Status{DRAFT,PUBLISHED,ARCHIVED}
}
