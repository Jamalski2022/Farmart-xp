import React, { useState, useEffect } from 'react';
import { animalsAPI } from '../services/api';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await animalsAPI.getAllAnimals();
      setAnimals(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch animals');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await animalsAPI.addAnimal(newAnimal);
      setSuccess('Animal added successfully');
      setNewAnimal({
        name: '',
        category: '',
        price: '',
        description: '',
        image_url: ''
      });
      fetchAnimals();
    } catch (err) {
      setError('Failed to add animal');
    }
  };

  const handleDelete = async (id) => {
    try {
      await animalsAPI.deleteAnimal(id);
      setSuccess('Animal deleted successfully');
      fetchAnimals();
    } catch (err) {
      setError('Failed to delete animal');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Farmer Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            name="name"
            value={newAnimal.name}
            onChange={handleInputChange}
            placeholder="Animal Name"
            className="p-2 border rounded"
            required
          />
          <select
            name="category"
            value={newAnimal.category}
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
            value={newAnimal.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={newAnimal.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-2 border rounded"
            required
          />
          <input
            type="file"
            name="image_url"
            value={newAnimal.image_url}
            onChange={handleInputChange}
            placeholder="Image URL"
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Animal
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Animals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animals.map((animal) => (
            <div key={animal.id} className="border p-4 rounded">
              <img
                src={animal.image_url || '/api/placeholder/200/200'}
                alt={animal.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="font-semibold">{animal.name}</h3>
              <p>Category: {animal.category}</p>
              <p>Price: ${animal.price}</p>
              <button
                onClick={() => handleDelete(animal.id)}
                className="mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;