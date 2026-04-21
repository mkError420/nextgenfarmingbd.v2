'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    price: '',
    oldPrice: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    galleryImages: [] as string[],
    mainImageIndex: 0,
    description: '',
    description_en: '',
    details: '',
    inStock: true,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [galleryImagePreviews, setGalleryImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [params.id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const selectedCategory = categories.find((cat: any) => cat.name_en === formData.category);

  const handleImageUpload = async (files: File[], type: 'main' | 'gallery') => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      console.log('Uploading files:', files);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload images');
      }

      const data = await res.json();
      console.log('Upload response:', data);
      
      if (type === 'main') {
        setFormData((prev) => ({ ...prev, images: data.urls }));
        setImagePreviews(data.urls);
      } else {
        setFormData((prev) => ({ ...prev, galleryImages: data.urls }));
        setGalleryImagePreviews(data.urls);
      }
      
      console.log('Form data after upload:', data.urls);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    const files = Array.from(e.target.files || []);
    const maxFiles = type === 'main' ? 3 : 2;
    
    if (files.length > maxFiles) {
      alert(`Please select up to ${maxFiles} images only.`);
      return;
    }
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and WebP files are allowed.');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 5MB.');
        return;
      }
    }

    // Create previews
    const previews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          if (type === 'main') {
            setImagePreviews(previews);
          } else {
            setGalleryImagePreviews(previews);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Auto-upload the images
    handleImageUpload(files, type);
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?id=${params.id}`);
      const data = await res.json();
      const product = data.product || data;
      if (product) {
        // Handle backward compatibility: convert single image to images array
        const productImages = product.images && product.images.length > 0 
          ? product.images 
          : (product.image ? [product.image] : []);
        const productGalleryImages = product.galleryImages || [];
        const productMainImageIndex = product.mainImageIndex ?? 0;
        
        setFormData({
          name: product.name || '',
          name_en: product.name_en || '',
          price: product.price?.toString() || '',
          oldPrice: product.oldPrice?.toString() || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          images: productImages,
          galleryImages: productGalleryImages,
          mainImageIndex: productMainImageIndex,
          description: product.description || '',
          description_en: product.description_en || '',
          details: product.details || '',
          inStock: product.inStock ?? true,
        });
        setImagePreviews(productImages);
        setGalleryImagePreviews(productGalleryImages);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploading) {
      alert('Please wait for images to finish uploading.');
      return;
    }

    setSaving(true);

    console.log('Submitting form data:', formData);
    console.log('Images in form data:', formData.images);

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const error = await res.json();
        console.error('Update error:', error);
        alert(error.error || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name (Bangla) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name (English)
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (৳) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Price (৳)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.oldPrice}
                onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={categoriesLoading}
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat.name_en}>
                    {cat.icon} {cat.name} ({cat.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={!selectedCategory || !selectedCategory.subcategories || selectedCategory.subcategories.length === 0}
              >
                <option value="">Select a subcategory (optional)</option>
                {selectedCategory?.subcategories?.map((sub: string, index: number) => (
                  <option key={index} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (up to 3) *
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  max={3}
                  onChange={(e) => handleFileChange(e, 'main')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploading && (
                  <p className="text-sm text-gray-500">Uploading images...</p>
                )}
                {imagePreviews.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className={`w-32 h-32 object-cover rounded-lg border-2 ${formData.mainImageIndex === index ? 'border-green-500' : 'border-gray-200'}`}
                          />
                          <div className="absolute top-2 right-2">
                            <input
                              type="radio"
                              name="mainImage"
                              checked={formData.mainImageIndex === index}
                              onChange={() => setFormData({ ...formData, mainImageIndex: index })}
                              className="w-5 h-5 accent-green-600"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {formData.mainImageIndex === index ? 'Main' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Select the radio button to mark as main image</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallery Images (up to 2 for single page)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  max={2}
                  onChange={(e) => handleFileChange(e, 'gallery')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {galleryImagePreviews.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {galleryImagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Gallery Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Bangla)
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (English)
            </label>
            <textarea
              rows={4}
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              বিস্তারিত (Details for Single Product Page)
            </label>
            <textarea
              rows={6}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Enter detailed product information that will appear in the 'বিস্তারিত' section on the single product page..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              In Stock
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
