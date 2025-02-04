import React, { useState, useEffect } from 'react';
import { animalsAPI } from '../services/api';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await animalsAPI.getAll();
      setAnimals(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch animals');
      console.error('Fetch error:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingAnimal) {
      setEditingAnimal(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      }));
    } else {
      setNewAnimal(prev => ({
        ...prev,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const currentAnimal = editingAnimal || newAnimal;

      formData.append('name', currentAnimal.name);
      formData.append('category', currentAnimal.category);
      formData.append('price', currentAnimal.price);
      formData.append('description', currentAnimal.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingAnimal) {
        await animalsAPI.update(editingAnimal.id, formData);
        setSuccess('Animal updated successfully');
        setEditingAnimal(null);
      } else {
        await animalsAPI.create(formData);
        setSuccess('Animal added successfully');
      }

      setNewAnimal({
        name: '',
        category: '',
        price: '',
        description: '',
      });
      setSelectedFile(null);
      fetchAnimals();
    } catch (err) {
      setError(editingAnimal ? 'Failed to update animal' : 'Failed to add animal');
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await animalsAPI.delete(id);
      setSuccess('Animal deleted successfully');
      fetchAnimals();
    } catch (err) {
      setError('Failed to delete animal');
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (animal) => {
    setEditingAnimal(animal);
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const cancelEdit = () => {
    setEditingAnimal(null);
    setSelectedFile(null);
    setError('');
    setSuccess('');
  };

  const currentAnimal = editingAnimal || newAnimal;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Farmer Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8" encType="multipart/form-data">
        <div className="flex flex-col space-y-2">
          <h2 className="text-xl font-semibold">
            {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
          </h2>
          <input
            type="text"
            name="name"
            value={currentAnimal.name}
            onChange={handleInputChange}
            placeholder="Animal Name"
            className="p-2 border rounded"
            required
          />
          <select
            name="category"
            value={currentAnimal.category}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="cow">Cow</option>
            <option value="goat">Goat</option>
            <option value="chicken">Chicken</option>
          </select>
          <input
            type="number"
            name="price"
            value={currentAnimal.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={currentAnimal.description}
            onChange={handleInputChange}
            
            
            placeholder="Description"
            className="p-2 border rounded"
            required
          />
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="p-2 border rounded"
            required={!editingAnimal}
          />
          {editingAnimal && (
            <p className="text-sm text-gray-600">
              Leave image empty to keep the current image
            </p>
          )}
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-1"
            >
              {editingAnimal ? 'Update Animal' : 'Add Animal'}
            </button>
            {editingAnimal && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Animals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animals.map((animal) => (
            <div key={animal.id} className="border p-4 rounded">
              {animal.image_url ? (
                <img
                  src={animal.image_url}
                  alt={animal.name}
                  className="w-full h-48 object-cover rounded mb-2"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/200/200';
                    console.error('Image failed to load:', animal.image_url);
                  }}
                />
              ) : (
                <img
                  src="/api/placeholder/200/200"
                  alt="placeholder"
                  className="w-full h-48 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold">{animal.name}</h3>
              <p>Category: {animal.category}</p>
              <p>Price: ${animal.price}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(animal)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(animal.id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;