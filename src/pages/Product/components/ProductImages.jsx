const ProductImages = ({ product }) => {
  return (
    <div className="md:w-1/2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-contain"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {product.images.map((img, index) => (
          <div key={index} className="bg-white rounded shadow p-1">
            <img
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="h-24 w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;