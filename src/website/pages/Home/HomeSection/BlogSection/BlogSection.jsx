import { useLanguage } from "../../../../../shared/LanguageContext";
import "./BlogSection.scss";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

// Centralized image imports

const blogs = [
  {
    id: 1,
    imageKey: "blog1",
    title:
      "No Compromise in Purity! The first choice of every home for family health and taste.",
  },
  {
    id: 2,
    imageKey: "blog2",
    title:
      "Made from premium quality G20 groundnuts of Saurashtra, this oil is 100% pure and double filtered.",
  },
  {
    id: 3,
    imageKey: "blog3",
    title:
      "Janmotri Groundnut Oil – The Best Choice for Your Family’s Health!",
  },
];

const BlogSection = () => {
  const { t, getImage } = useLanguage();

  return (
    <section className="blog-section">
      <div className="blog-bg-image" style={{ backgroundImage: `url(${getImage("journeyBg")})` }} />

      <div className="blog-container">

        <div className="section-header">
          <h2>{t("home.blog.title", "Blog")}</h2>
          <div className="heading-line"></div>
        </div>

        <div className="blog-grid">

          {blogs.map((blog, index) => (
            <Card
              key={blog.id}
              className="blog-card"
            >
              <div className="blog-image">
                <img
                  src={getImage(blog.imageKey)}
                  alt={t(`home.blog.posts.${index}`, blog.title)}
                />
              </div>

              <div className="blog-content">
                <h4>{t(`home.blog.posts.${index}`, blog.title)}</h4>

                <Button
                  label={t("common.readMore", "Read More")}
                  className="blog-btn"
                />
              </div>
            </Card>
          ))}

        </div>

      </div>

    </section>
  );
};

export default BlogSection;