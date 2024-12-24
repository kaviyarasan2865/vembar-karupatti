'use client';
import React, { useEffect,useState } from 'react'

const page = () => {
const [categories,setCategories]=useState([]);
const [product,setProducts]=useState([]);
const [categorySelected,setCategorySelected]=useState("");
const [name,setName]=useState("");


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
      const response = await fetch('/api/admin/products');
      if (!response.ok) throw new Error('Failed to fetch Products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }; 

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleSubmit=async()=>{

  }

  return (
    <div>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
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
                <th className="text-left pb-4">Image</th>
                <th className="text-right pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {product.map((product) => (
                <tr key={product.id} className="border-b last:border-b-0">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.description}</td>
                  <td className="py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 text-right space-x-2">
                    <button
                    //   onClick={() => handleEdit(category)}
                      className="border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md transition-colors"
                    >
                      Edit
                    </button>
                    <button
                    //   onClick={() => handleDelete(category.id)}
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

      <form onSubmit={handleSubmit}>
       <label>Name</label>
       <input type="text" name="text" onChange={(e)=>setName(e.target.value)}/>
       <label>Category</label>
       <select>
        {categories.map((category)=>(
            <option onChange={(e)=>setCategorySelected(e.target.value)}>{category.name}</option>
        ))}
        </select>
        <label>unit</label>
        <select>
        <option>ml</option>
        <option>l</option>
        <option>kg</option>
        <option>g</option>
        </select>
        <label>quantity</label>
        <input type='number'></input>
        <label>Price per unit</label>
        <input type='number'></input>
        <label>Description</label>
        <input type="textarea"/>
        <label>Image <span className='text-red-500'>*</span></label>
        <input  type='file' accept='image/*'/>
        <label>Image2</label>       
        <input  type='file' accept='image/*'/>
        <label>Image2</label>
        <input  type='file' accept='image/*'/>
        <label>Stock</label>
        <input type="number"></input>
        <button type="submit">add product</button>
      </form>
      </div>
    </div>
  )
}

export default page
