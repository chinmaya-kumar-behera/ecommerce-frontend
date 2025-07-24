import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getReviewsByProductId } from "../../services/api";
import ProductReview from "./components/ProductReview";
import ProductInfo from "./components/ProductInfo";
import ProductImages from "./components/ProductImages";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setReviewsLoading(true);
        const productResponse = await getProductById(id);
        setProduct(productResponse.data.Product);
        const reviewsResponse = await getReviewsByProductId(id);
        setReviews(reviewsResponse.data.data);
        setReviewsLoading(false);
      } catch (err) {
        setReviewsLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProductImages product={product} />
        <ProductInfo product={product} />
      </div>
      <ProductReview productId={id} reviews={reviews} setReviews={setReviews} />
    </div>
  );
};
export default ProductDetail;
