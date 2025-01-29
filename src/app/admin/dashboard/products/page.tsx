'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Add these interfaces at the top after imports
interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  isActive: boolean;
  units: ProductUnit[];
}

interface ProductUnit {
  unit: string;
  quantity: number;
  discount: number;
  price: number;
  stock: number;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

// Add this interface for form data
interface FormData {
  id?: string;
  name: string;
  description: string;
  image: File | null;
  image2: File | null;
  image3: File | null;
  currentImage?: string;
  currentImage2?: string;
  currentImage3?: string;
  category: string;
  isActive: boolean;
  units: ProductUnit[];
}

// Update the DeleteConfirmationModal component
const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the product &quot;{productName}&quot;? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  
  useEffect(() =>{
    fetchCategories();
    fetchProducts();  
  },[]);
  
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null as string | null,
    productName: ''
  });
  
  // Update initial form data type
  const initialFormData: FormData = {
    name: '',
    description: '',
    image: null,
    image2: null,
    image3: null,
    category: '',
    isActive: true,
    units: [{
      unit: 'pieces',
      quantity: 1,
      discount: 0,
      price: 0,
      stock: 0
    }]
  };
  
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const unitTypes = ["pieces", "kg", "grams", "liters", "units"];

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/product');
      if (!response.ok) throw new Error('Failed to fetch Products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fix event typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: fileInput.files?.[0] || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleUnitChange = (index: number, field: keyof ProductUnit, value: string | number) => {
    setFormData(prev => {
      const newUnits = [...prev.units];
      newUnits[index] = {
        ...newUnits[index],
        [field]: field === 'unit' ? value : Number(value)
      };
      return { ...prev, units: newUnits };
    });
  };

  const addUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, {
        unit: 'pieces',
        quantity: 1,
        discount: 0,
        price: 0,
        stock: 0
      }]
    }));
  };

  const removeUnit = (index: number) => {
    if (formData.units.length > 1) {
      setFormData(prev => ({
        ...prev,
        units: prev.units.filter((_, i) => i !== index)
      }));
    }
  };

  const handleEdit = (product: Product) => {
    setEditMode(true);
    setFormData({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      units: product.units,
      isActive: product.isActive,
      image: null,
      image2: null,
      image3: null,
      currentImage: product.image,
      currentImage2: product.image2,
      currentImage3: product.image3
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('units', JSON.stringify(formData.units));
      formDataToSend.append('isActive', formData.isActive.toString());
      
      if (formData.image) formDataToSend.append('image', formData.image);
      if (formData.image2) formDataToSend.append('image2', formData.image2);
      if (formData.image3) formDataToSend.append('image3', formData.image3);

      const url = '/api/admin/product';
      const method = editMode ? 'PUT' : 'POST';
      
      if (editMode && formData.id) {
        formDataToSend.append('id', formData.id);
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || `Failed to ${editMode ? 'update' : 'add'} product`);
      } else{
        toast.success(editMode? 'Product updated successfully' : 'Product added successfully');
        setFormData(initialFormData);
        setEditMode(false);
        setFormOpen(false);
      }

      await fetchProducts();
      handleCloseForm();
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} product:`, error);
    }
  };

  const handleDeleteClick = (product:Product) => {
    setDeleteModal({
      isOpen: true,
      productId: product._id,
      productName: product.name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/admin/product', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.productId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      toast.success('Product deleted successfully');
      await fetchProducts();
      setDeleteModal({ isOpen: false, productId: null, productName: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditMode(false);
    setFormData(initialFormData);
  };

  const productForm = () => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{editMode ? 'Edit Product' : 'Add Product'}</h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
  
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={100}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
  
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  maxLength={1000}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
  
            {/* Units Section */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Units *</h3>
                <button
                  type="button"
                  onClick={addUnit}
                  className="text-amber-500 hover:text-amber-600"
                >
                  + Add Unit
                </button>
              </div>
  
              {formData.units.map((unit, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
                    <select
                      value={unit.unit}
                      onChange={(e) => handleUnitChange(index, 'unit', e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {unitTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      value={unit.quantity}
                      onChange={(e) => handleUnitChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={unit.price}
                      onChange={(e) => handleUnitChange(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input
                      type="number"
                      value={unit.stock}
                      onChange={(e) => handleUnitChange(index, 'stock', e.target.value)}
                      min="0"
                      required
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={unit.discount}
                      onChange={(e) => handleUnitChange(index, 'discount', e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
  
                  <div className="flex items-end">
                    {formData.units.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUnit(index)}
                        className="text-red-500 hover:text-red-600 px-3 py-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
  
            {/* Image Upload Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image {!editMode && '*'}
                </label>
                {editMode && formData.currentImage && (
                  <Image
                    src={formData.currentImage}
                    width={20} height={20}
                    alt="Current main image"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  required={!editMode}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
                {editMode && formData.currentImage2 && (
                  <Image
                    src={formData.currentImage2}
                    width={20} height={20}
                    alt="Current second image"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="image2"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image 3</label>
                {editMode && formData.currentImage3 && (
                  <Image
                    src={formData.currentImage3}
                    width={20} height={20}
                    alt="Current third image"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="image3"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </form>
        </div>
  
        <div className="p-6 border-t">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              {editMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

    return (
      <div>
        <div className="p-8 max-w-6xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={() => {
                setEditMode(false);
                setFormData(initialFormData);
                setFormOpen(true);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Products
            </button>
          </div>
  
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left pb-4">Name</th>
                    <th className="text-left pb-4">Description</th>
                    <th className="text-left pb-4">Category</th>
                    <th className="text-left pb-4">Image</th>
                    <th className="text-right pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b last:border-b-0">
                      <td className="py-4 font-medium">{product.name}</td>
                      <td className="py-4 max-w-xs truncate">{product.description}</td>
                      <td className="py-4">
                        {categories.find(cat => cat.id === product.category)?.name || 'N/A'}
                      </td>
                      <td className="py-4">
                        <Image
                          src={product.image}
                          width={20} height={20}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button  
                          onClick={() => handleDeleteClick(product)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, productId: null, productName: '' })}
          onConfirm={handleDeleteConfirm}
          productName={deleteModal.productName}
        />
  
        {/* Product Form Modal */}
        {formOpen && productForm()}
      </div>
    );
  };
  
  
  export default Page;