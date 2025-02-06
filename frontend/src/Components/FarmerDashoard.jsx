// import React, { useState, useEffect } from 'react';
// import { animalsAPI } from '../services/api';

// const FarmerDashboard = () => {
//   const [animals, setAnimals] = useState([]);
//   const [editingAnimal, setEditingAnimal] = useState(null);
//   const [newAnimal, setNewAnimal] = useState({
//     name: '',
//     category: '',
//     price: '',
//     description: '',
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     fetchAnimals();
//   }, []);

//   const fetchAnimals = async () => {
//     try {
//       const response = await animalsAPI.getAll();
//       setAnimals(response.data);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch animals');
//       console.error('Fetch error:', err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (editingAnimal) {
//       setEditingAnimal(prev => ({
//         ...prev,
//         [name]: name === 'price' ? parseFloat(value) || '' : value
//       }));
//     } else {
//       setNewAnimal(prev => ({
//         ...prev,
//         [name]: name === 'price' ? parseFloat(value) || '' : value
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);

//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       const currentAnimal = editingAnimal || newAnimal;

//       formData.append('name', currentAnimal.name);
//       formData.append('category', currentAnimal.category);
//       formData.append('price', currentAnimal.price);
//       formData.append('description', currentAnimal.description);
//       if (selectedFile) {
//         formData.append('image', selectedFile);
//       }

//       if (editingAnimal) {
//         await animalsAPI.update(editingAnimal.id, formData);
//         setSuccess('Animal updated successfully');
//         setEditingAnimal(null);
//       } else {
//         await animalsAPI.create(formData);
//         setSuccess('Animal added successfully');
//       }

//       setNewAnimal({
//         name: '',
//         category: '',
//         price: '',
//         description: '',
//       });
//       setSelectedFile(null);
//       fetchAnimals();
//     } catch (err) {
//       setError(editingAnimal ? 'Failed to update animal' : 'Failed to add animal');
//       console.error('Submit error:', err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await animalsAPI.delete(id);
//       setSuccess('Animal deleted successfully');
//       fetchAnimals();
//     } catch (err) {
//       setError('Failed to delete animal');
//       console.error('Delete error:', err);
//     }
//   };

//   const handleEdit = (animal) => {
//     setEditingAnimal(animal);
//     setSelectedFile(null);
//     setError('');
//     setSuccess('');
//   };

//   const cancelEdit = () => {
//     setEditingAnimal(null);
//     setSelectedFile(null);
//     setError('');
//     setSuccess('');
//   };

//   const currentAnimal = editingAnimal || newAnimal;

//   return (
//     <div className="w-full max-w-4xl mx-auto mt-8 p-6">
//       <h1 className="text-2xl font-bold mb-6">Farmer Dashboard</h1>

//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       {success && <p className="text-green-500 mb-4">{success}</p>}
      
//       <form onSubmit={handleSubmit} className="space-y-4 mb-8" encType="multipart/form-data">
//         <div className="flex flex-col space-y-2">
//           <h2 className="text-xl font-semibold">
//             {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
//           </h2>
//           <input
//             type="text"
//             name="name"
//             value={currentAnimal.name}
//             onChange={handleInputChange}
//             placeholder="Animal Name"
//             className="p-2 border rounded"
//             required
//           />
//           <select
//             name="category"
//             value={currentAnimal.category}
//             onChange={handleInputChange}
//             className="p-2 border rounded"
//             required
//           >
//             <option value="">Select Category</option>
//             <option value="cow">Cow</option>
//             <option value="goat">Goat</option>
//             <option value="chicken">Chicken</option>
//           </select>
//           <input
//             type="number"
//             name="price"
//             value={currentAnimal.price}
//             onChange={handleInputChange}
//             placeholder="Price"
//             className="p-2 border rounded"
//             required
//           />
//           <textarea
//             name="description"
//             value={currentAnimal.description}
//             onChange={handleInputChange}
            
            
//             placeholder="Description"
//             className="p-2 border rounded"
//             required
//           />
//           <input
//             type="file"
//             name="image"
//             onChange={handleFileChange}
//             accept="image/*"
//             className="p-2 border rounded"
//             required={!editingAnimal}
//           />
//           {editingAnimal && (
//             <p className="text-sm text-gray-600">
//               Leave image empty to keep the current image
//             </p>
//           )}
//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-1"
//             >
//               {editingAnimal ? 'Update Animal' : 'Add Animal'}
//             </button>
//             {editingAnimal && (
//               <button
//                 type="button"
//                 onClick={cancelEdit}
//                 className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </div>
//       </form>

//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">Your Animals</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {animals.map((animal) => (
//             <div key={animal.id} className="border p-4 rounded">
//               {animal.image_url ? (
//                 <img
//                   src={animal.image_url}
//                   alt={animal.name}
//                   className="w-full h-48 object-cover rounded mb-2"
//                   onError={(e) => {
//                     e.target.src = '/api/placeholder/200/200';
//                     console.error('Image failed to load:', animal.image_url);
//                   }}
//                 />
//               ) : (
//                 <img
//                   src="/api/placeholder/200/200"
//                   alt="placeholder"
//                   className="w-full h-48 object-cover rounded mb-2"
//                 />
//               )}
//               <h3 className="font-semibold">{animal.name}</h3>
//               <p>Category: {animal.category}</p>
//               <p>Price: ${animal.price}</p>
//               <div className="flex space-x-2 mt-2">
//                 <button
//                   onClick={() => handleEdit(animal)}
//                   className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 flex-1"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(animal.id)}
//                   className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FarmerDashboard;


import React, { useState, useEffect } from 'react';
import { animalsAPI,orderAPI } from '../services/api';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [orders, setOrders] = useState([]);
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
  const [activeTab, setActiveTab] = useState('animals');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
    fetchOrders();
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

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch orders');
      setLoading(false);
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
      formData.append('description', currentAnimal.description || '');
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await orderAPI.updateStatus(orderId, status);
      if (response.data) {
        setSuccess(`Order ${status.toLowerCase()} successfully`);
        fetchOrders();
      } else {
        setError('Failed to update order status');
      }
    } catch (err) {
      setError('Failed to update order status');
      console.error('Update error:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentAnimal = editingAnimal || newAnimal;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6">
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setActiveTab('animals')}
          className={`px-4 py-2 rounded ${
            activeTab === 'animals' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Manage Animals
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded ${
            activeTab === 'orders' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Manage Orders
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {activeTab === 'animals' ? (
        <div>
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
                value={currentAnimal.description || ''}
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
                <p>Description: {animal.description}</p>
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
      ) : (
        <div className="space-y-4">
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <>
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">
                        Placed on: {formatDate(order.order_date)}
                      </p>
                      <p className="font-medium">Total: ${order.total_price.toFixed(2)}</p>
                    </div>
                    <div className="space-x-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span>{item.animal_name}</span>
                          <span className="text-gray-600">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Shipping Address: {order.shipping_address}</p>
                      <p>Phone: {order.phone_number}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {orders.length === 0 && (
                <p className="text-center text-gray-500">No orders found</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
