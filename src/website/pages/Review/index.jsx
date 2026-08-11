import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./HeroSection/HeroSection";
import FeedbackFormSection from "./FeedbackFormSection/FeedbackFormSection";
import TestimonialsSection from "./TestimonialsSection/TestimonialsSection";
import { useLanguage } from "../../../shared/LanguageContext";
import { useAdminStore } from "../../../shared/useAdminStore";
import "./Review.scss";

const initialReviews = [
  {
    id: 1,
    name: "kiranben Patel",
    city: "Vadodara",
    rating: 5,
    text: "Both the taste and aroma of Janmotri shing oil are wonderful. If we use it in cooking, the taste of the food is doubled."
  },
  {
    id: 2,
    name: "deepakbhai trivedi",
    city: "Rajkot",
    rating: 5,
    text: "We have been using this brand for years. The oil is always fresh, pure and healthy. Completely safe even for children."
  },
  {
    id: 3,
    name: "Hetalben Joshi",
    city: "Ahmedabad",
    rating: 5,
    text: "At home, farsan, bhajiya or poori – Janmotri shing oil is perfect for every dish. Maintains both quality and trust."
  },
  {
    id: 4,
    name: "Mayurbhai Chauhan",
    city: "Patan",
    rating: 5,
    text: "The fragrance of Janmotri Shing oil will tell you how pure it is. After cooking, a special fragrance is left in the house."
  }
];

const Review = () => {
  const { t } = useLanguage();
  const reviews = useAdminStore((state) => state.reviews);
  const addReview = useAdminStore((state) => state.addReview);

  const reviewsList = reviews
    .filter((r) => r.status === "Approved")
    .map((r) => ({
      id: r.id,
      name: r.customerName,
      city: r.productName || "Verified Buyer",
      rating: r.rating,
      text: r.message
    }));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    feedback: ""
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Ensure scroll position is reset to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRatingClick = (ratingValue) => {
    setFormData((prev) => ({ ...prev, rating: ratingValue }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Form Validation
    if (!formData.name.trim()) {
      setErrorMessage(t("common.requiredName", "Please enter your name."));
      return;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMessage(t("common.requiredEmail", "Please enter a valid email address."));
      return;
    }
    if (formData.rating === 0) {
      setErrorMessage(t("common.requiredRating", "Please choose a rating score."));
      return;
    }
    if (!formData.feedback.trim()) {
      setErrorMessage(t("common.requiredFeedback", "Please write down your feedback."));
      return;
    }

    // Success Submission: Add to admin store
    addReview({
      customerName: formData.name.trim(),
      productName: "Verified Buyer",
      rating: formData.rating,
      message: formData.feedback.trim()
    });

    setSubmitSuccess(true);

    // Reset inputs
    setFormData({
      name: "",
      email: "",
      rating: 0,
      feedback: ""
    });

    // Clear success message after delay
    setTimeout(() => {
      setSubmitSuccess(false);
    }, 4500);
  };

  return (
    <div className="review-page-root">
      <Navbar />

      <main className="review-main-content">
        <HeroSection />

        <FeedbackFormSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleRatingClick={handleRatingClick}
          handleFormSubmit={handleFormSubmit}
          hoveredRating={hoveredRating}
          setHoveredRating={setHoveredRating}
          errorMessage={errorMessage}
          submitSuccess={submitSuccess}
        />

        <TestimonialsSection reviewsList={reviewsList} />
      </main>

      <Footer />
    </div>
  );
};

export default Review;
