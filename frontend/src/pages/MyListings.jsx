import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, X, Save, Trash } from "lucide-react";

const ItemForm = () => {
  const { id } = useParams(); // If id exists, we are editing, otherwise creating
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    shortDescription: "",
    description: "",
    images: [],
    status: "active",
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Categories with icons
  const categories = [
    "Electronics",
    "Furniture",
    "Books",
    "Kitchen",
    "Collectibles",
    "Clothing",
    "Sports & Outdoors",
    "Tools",
    "Toys & Games",
    "Other",
  ];

  // Condition options
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  // Status options
  const statuses = ["active", "inactive", "sold", "pending"];

  // Fetch item data if editing
  useEffect(() => {
    if (isEditing) {
      // This would be an API call in a real app
      // Simulating API call with timeout
      setTimeout(() => {
        // Sample data for item being edited
        const itemData = {
          id: parseInt(id),
          title: "Dell XPS 13 Laptop - 2023 Model",
          price: 850,
          category: "Electronics",
          condition: "Like New",
          shortDescription:
            "Dell XPS 13 laptop in excellent condition. Intel Core i7, 16GB RAM, 512GB SSD. Includes charger and original box.",
          description:
            "Selling my Dell XPS 13 laptop. Only 6 months old and in excellent condition. Intel Core i7 processor, 16GB RAM, 512GB SSD. Battery life is still excellent (around 10 hours of regular use). Comes with original charger and box. Selling because I'm upgrading to a MacBook for design work.\n\nSpecs:\n- Intel Core i7 11th Gen\n- 16GB RAM\n- 512GB NVMe SSD\n- 13.4\" FHD+ Display (1920x1200)\n- Windows 11 Pro\n- Backlit Keyboard\n- Thunderbolt 4 ports",
          images: ["/image1.avif", "/image2.avif", "/image3.avif"],
          status: "active",
          datePosted: "2023-03-02",
        };

        setFormData(itemData);
        setOriginalData(itemData);
        setImagePreviewUrls(itemData.images);
        setIsLoading(false);
      }, 1000);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    const files = Array.from(e.target.files);

    if (formData.images.length + files.length > 5) {
      setErrors({
        ...errors,
        images: "Maximum 5 images allowed",
      });
      return;
    }

    // Create preview URLs for the images
    const newImagePreviewUrls = [...imagePreviewUrls];
    const newImages = [...formData.images];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result);
        setImagePreviewUrls(newImagePreviewUrls);
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });

    setFormData({
      ...formData,
      images: newImages,
    });

    // Clear error if any
    if (errors.images) {
      setErrors({
        ...errors,
        images: null,
      });
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newImagePreviewUrls = [...imagePreviewUrls];

    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setFormData({
      ...formData,
      images: newImages,
    });
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document
        .getElementsByName(firstErrorField)[0]
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to post/update the item
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);

      // Show success and redirect to listings
      alert(`Item successfully ${isEditing ? "updated" : "created"}!`);
      navigate("/selling");
    }, 1500);
  };

  const handleDelete = () => {
    setIsSubmitting(true);

    // Simulate API call to delete the item
    setTimeout(() => {
      console.log("Item deleted:", id);
      setIsSubmitting(false);
      setShowDeleteModal(false);

      // Show success and redirect to listings
      alert("Item successfully deleted!");
      navigate("/selling");
    }, 1500);
  };

  // Show loading state if necessary
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/selling" className="text-green-600 hover:text-green-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to listings
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb & Back Link */}
      <div className="mb-6">
        <Link
          to="/selling"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to listings</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? "Edit Item" : "Create New Listing"}
        </h1>

        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 flex items-center"
            disabled={isSubmitting}
          >
            <Trash className="h-5 w-5 mr-1" />
            Delete Item
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 p-6 rounded-md"
      >
        {/* Title */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
            placeholder="e.g., Dell XPS 13 Laptop - 2023 Model"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Price, Category, Status (side by side on larger screens) */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-full md:w-1/3">
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-2"
            >
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.price ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
              placeholder="e.g., 850"
              min="0"
              step="0.01"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="w-full md:w-1/3">
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${errors.category ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500 bg-white`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {isEditing && (
            <div className="w-full md:w-1/3">
              <label
                htmlFor="status"
                className="block text-gray-700 font-medium mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-green-500 bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Condition <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {conditions.map((condition) => (
              <label
                key={condition}
                className={`px-4 py-2 border cursor-pointer ${
                  formData.condition === condition
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  checked={formData.condition === condition}
                  onChange={handleChange}
                  className="sr-only"
                />
                {condition}
              </label>
            ))}
          </div>
          {errors.condition && (
            <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
          )}
        </div>

        {/* Short Description */}
        <div className="mb-6">
          <label
            htmlFor="shortDescription"
            className="block text-gray-700 font-medium mb-2"
          >
            Short Description <span className="text-red-500">*</span>
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Brief summary that appears in listings)
            </span>
          </label>
          <input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.shortDescription ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500`}
            placeholder="e.g., Dell XPS 13 laptop in excellent condition. Intel Core i7, 16GB RAM, 512GB SSD."
            maxLength="150"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.shortDescription.length}/150 characters
          </p>
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription}</p>
          )}
        </div>

        {/* Full Description */}
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2"
          >
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"} focus:outline-none focus:border-green-500 h-40`}
            placeholder="Describe your item in detail. Include specs, condition, reason for selling, etc."
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">
            Use blank lines to separate paragraphs.
          </p>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">
            Images <span className="text-red-500">*</span>
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Up to 5 images)
            </span>
          </label>

          {/* Image Preview Area */}
          <div className="flex flex-wrap gap-4 mb-4">
            {imagePreviewUrls.map((url, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border border-gray-300"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-300"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            ))}

            {/* Upload Button (only show if less than 5 images) */}
            {formData.images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Image</span>
              </label>
            )}
          </div>
          {errors.images && (
            <p className="text-red-500 text-sm">{errors.images}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 text-white font-medium flex items-center justify-center ${
              isSubmitting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            <Save className="h-5 w-5 mr-2" />
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Listing"}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Listing
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete <strong>{formData.title}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemForm;
