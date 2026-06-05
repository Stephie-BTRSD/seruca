package com.seruca.entity;
import jakarta.persistence.*;
import java.util.List;
@Entity
@Table(name="taxonomy_categories")
public class TaxonomyCategory {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(columnDefinition="TEXT") private String description;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="parent_id") private TaxonomyCategory parent;
    @OneToMany(mappedBy="parent",cascade=CascadeType.ALL) private List<TaxonomyCategory> children;
    private Integer level;
    private String slug;
    public TaxonomyCategory(){}
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String n){this.name=n;}
    public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
    public TaxonomyCategory getParent(){return parent;} public void setParent(TaxonomyCategory p){this.parent=p;}
    public List<TaxonomyCategory> getChildren(){return children;} public void setChildren(List<TaxonomyCategory> c){this.children=c;}
    public Integer getLevel(){return level;} public void setLevel(Integer l){this.level=l;}
    public String getSlug(){return slug;} public void setSlug(String s){this.slug=s;}
}
