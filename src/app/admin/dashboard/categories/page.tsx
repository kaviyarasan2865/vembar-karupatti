'use client';

import React, { useEffect, useState } from 'react';

const Page = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
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
    } catch (error) {
      console.error('Error creating category:', error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
    setImage(category.image);
    setIsEditFormOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

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
    } catch (error) {
      console.error('Error updating category:', error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('/api/admin/category', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete category');
      await fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const CategoryForm = ({ isEdit, onSubmit, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
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
                id="name"
                name="name"
                value={name}
                placeholder="Enter category name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                id="description"
                name="description"
                value={description}
                placeholder="Enter category description"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setDescription(e.target.value)}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleFileChange}
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                {isEdit ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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
                    <img
                      src={category.image}
                      alt={category.name}
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
                      onClick={() => handleDelete(category.id)}
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
        />
      )}

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
        />
      )}
    </div>
  );
};

export default Page;