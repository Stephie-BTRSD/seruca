package com.seruca.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
@Table(name="documents")
public class Document {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String title;
    @Column(columnDefinition="TEXT") private String content;
    private String filePath;
    private String fileType;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="course_id") private Course course;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="category_id") private TaxonomyCategory category;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="uploaded_by") private User uploadedBy;
    @Column(updatable=false) private LocalDateTime createdAt;
    public Document(){}
    @PrePersist protected void onCreate(){createdAt=LocalDateTime.now();}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
    public String getContent(){return content;} public void setContent(String c){this.content=c;}
    public String getFilePath(){return filePath;} public void setFilePath(String f){this.filePath=f;}
    public String getFileType(){return fileType;} public void setFileType(String f){this.fileType=f;}
    public Course getCourse(){return course;} public void setCourse(Course c){this.course=c;}
    public TaxonomyCategory getCategory(){return category;} public void setCategory(TaxonomyCategory c){this.category=c;}
    public User getUploadedBy(){return uploadedBy;} public void setUploadedBy(User u){this.uploadedBy=u;}
    public LocalDateTime getCreatedAt(){return createdAt;}
}
