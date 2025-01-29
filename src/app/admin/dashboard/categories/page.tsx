'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Add this interface near the top of the file
interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the category &quot;{categoryName}&quot;? This action cannot be undone.
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

// Category Form Component
interface CategoryFormProps {
  isEdit: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  image: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  isEdit, 
  onSubmit, 
  onClose, 
  name, 
  setName, 
  description, 
  setDescription, 
  image, 
  handleFileChange 
}) => (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEdit ? 'Edit Category' : 'Add Category'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              onChange={handleFileChange}
            />
            {image && (
              <Image
                src={image}
                alt="Preview"
                width={20} height={20}
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              {isEdit ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

// Main Page Component
const Page = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    categoryId: null as string | null,
    categoryName: ''
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/category');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      image,
    };

    try {
      const response = await fetch('/api/admin/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }

      await fetchCategories();
      setIsFormOpen(false);
      setName('');
      setDescription('');
      setImage(null);
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setImage(category.image);
    setIsEditFormOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!editingCategory) return;

    const formData = {
      id: editingCategory.id,
      name,
      description,
      image,
    };

    try {
      const response = await fetch('/api/admin/category', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update category');
      }

      await fetchCategories();
      setIsEditFormOpen(false);
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImage(null);
      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteModal({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/admin/category', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.categoryId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      
      await fetchCategories();
      toast.success('Category deleted successfully');
      setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete category');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left pb-4">Name</th>
                <th className="text-left pb-4">Description</th>
                <th className="text-left pb-4">Image</th>
                <th className="text-right pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="py-4 font-medium">{category.name}</td>
                  <td className="py-4">{category.description}</td>
                  <td className="py-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={20} height={20}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null, categoryName: '' })}
        onConfirm={handleDeleteConfirm}
        categoryName={deleteModal.categoryName}
      />

      {/* Add Category Modal */}
      {isFormOpen && (
        <CategoryForm
          isEdit={false}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setName('');
            setDescription('');
            setImage(null);
          }}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          image={image}
          handleFileChange={handleFileChange}
        />
      )}

      {/* Edit Category Modal */}
      {isEditFormOpen && (
        <CategoryForm
          isEdit={true}
          onSubmit={handleUpdate}
          onClose={() => {
            setIsEditFormOpen(false);
            setEditingCategory(null);
            setName('');
            setDescription('');
            setImage(null);
          }}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          image={image}
          handleFileChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default Page;