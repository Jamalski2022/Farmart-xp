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

// import React, { useState, useEffect } from 'react';
// import { orderAPI, animalsAPI } from '../services/api';

// const FarmerDashboard = () => {
//   const [activeView, setActiveView] = useState('animals');
//   const [orders, setOrders] = useState([]);
//   const [animals, setAnimals] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   // Animal form state
//   const [newAnimal, setNewAnimal] = useState({
//     name: '',
//     category: '',
//     price: '',
//     description: '',
//   });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [editingAnimal, setEditingAnimal] = useState(null);

//   useEffect(() => {
//     if (activeView === 'orders') {
//       fetchOrders();
//     } else {
//       fetchAnimals();
//     }
//   }, [activeView]);

//   const fetchAnimals = async () => {
//     try {
//       setLoading(true);
//       const response = await animalsAPI.getAll();
//       setAnimals(response.data);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch animals');
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await orderAPI.getAll();
//       setOrders(response.data.orders);
//       setError('');
//     } catch (err) {
//       setError('Failed to fetch orders');
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
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

//   const handleAnimalSubmit = async (e) => {
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
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(editingAnimal ? 'Failed to update animal' : 'Failed to add animal');
//       setTimeout(() => setError(''), 3000);
//       console.error('Submit error:', err);
//     }
//   };

//   const handleAnimalDelete = async (id) => {
//     try {
//       await animalsAPI.delete(id);
//       setSuccess('Animal deleted successfully');
//       fetchAnimals();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError('Failed to delete animal');
//       setTimeout(() => setError(''), 3000);
//       console.error('Delete error:', err);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       await orderAPI.update(orderId, { status });
//       setSuccess(`Order ${orderId} status updated to ${status}`);
//       fetchOrders();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError('Failed to update order status');
//       setTimeout(() => setError(''), 3000);
//       console.error('Update error:', err);
//     }
//   };

//   const updatePaymentStatus = async (orderId, paymentStatus) => {
//     try {
//       await orderAPI.update(orderId, { payment_status: paymentStatus });
//       setSuccess(`Payment status updated for order ${orderId}`);
//       fetchOrders();
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError('Failed to update payment status');
//       setTimeout(() => setError(''), 3000);
//       console.error('Update error:', err);
//     }
//   };

//   const currentAnimal = editingAnimal || newAnimal;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
//         <div className="space-x-4">
//           <button
//             onClick={() => setActiveView('animals')}
//             className={`px-4 py-2 rounded ${
//               activeView === 'animals' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//             }`}
//           >
//             Animals
//           </button>
//           <button
//             onClick={() => setActiveView('orders')}
//             className={`px-4 py-2 rounded ${
//               activeView === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//             }`}
//           >
//             Orders
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
      
//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       {activeView === 'animals' ? (
//         <div className="space-y-6">
//           <form onSubmit={handleAnimalSubmit} className="space-y-4 p-4 border rounded-lg bg-white">
//             <h2 className="text-xl font-semibold">
//               {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 value={currentAnimal.name}
//                 onChange={handleInputChange}
//                 placeholder="Animal Name"
//                 className="p-2 border rounded"
//                 required
//               />
//               <select
//                 name="category"
//                 value={currentAnimal.category}
//                 onChange={handleInputChange}
//                 className="p-2 border rounded"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 <option value="cow">Cow</option>
//                 <option value="goat">Goat</option>
//                 <option value="chicken">Chicken</option>
//               </select>
//               <input
//                 type="number"
//                 name="price"
//                 value={currentAnimal.price}
//                 onChange={handleInputChange}
//                 placeholder="Price"
//                 className="p-2 border rounded"
//                 required
//               />
//               <input
//                 type="file"
//                 name="image"
//                 onChange={handleFileChange}
//                 accept="image/*"
//                 className="p-2 border rounded"
//                 required={!editingAnimal}
//               />
//             </div>
//             <textarea
//               name="description"
//               value={currentAnimal.description}
//               onChange={handleInputChange}
//               placeholder="Description"
//               className="w-full p-2 border rounded"
//               required
//             />
//             <div className="flex space-x-2">
//               <button
//                 type="submit"
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 {editingAnimal ? 'Update Animal' : 'Add Animal'}
//               </button>
//               {editingAnimal && (
//                 <button
//                   type="button"
//                   onClick={() => setEditingAnimal(null)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {animals.map((animal) => (
//               <div key={animal.id} className="border rounded-lg p-4 bg-white">
//                 {animal.image_url ? (
//                   <img
//                     src={animal.image_url}
//                     alt={animal.name}
//                     className="w-full h-48 object-cover rounded mb-2"
//                     onError={(e) => {
//                       e.target.src = '/api/placeholder/200/200';
//                     }}
//                   />
//                 ) : (
//                   <img
//                     src="/api/placeholder/200/200"
//                     alt="placeholder"
//                     className="w-full h-48 object-cover rounded mb-2"
//                   />
//                 )}
//                 <h3 className="font-semibold">{animal.name}</h3>
//                 <p>Category: {animal.category}</p>
//                 <p>Price: ${animal.price}</p>
//                 <div className="flex space-x-2 mt-2">
//                   <button
//                     onClick={() => setEditingAnimal(animal)}
//                     className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex-1"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleAnimalDelete(animal.id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex-1"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {loading ? (
//             <div className="text-center py-4">Loading orders...</div>
//           ) : orders.length === 0 ? (
//             <div className="text-center py-4">No orders found</div>
//           ) : (
//             orders.map((order) => (
//               <div
//                 key={order.id}
//                 className="border rounded-lg p-4 bg-white"
//               >
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold">Order #{order.id}</h3>
//                     <p className="text-gray-600">
//                       Date: {new Date(order.order_date).toLocaleDateString()}
//                     </p>
//                     <p className="text-gray-600">
//                       Customer: {order.user_id}
//                     </p>
//                     <p className="font-medium">
//                       Total: ${order.total_price.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="space-y-2">
//                     <select
//                       value={order.status}
//                       onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                       className="w-full p-2 border rounded"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="accepted">Accept</option>
//                       <option value="declined">Decline</option>
//                       <option value="processing">Processing</option>
//                       <option value="completed">Completed</option>
//                     </select>
//                     <select
//                       value={order.payment_status}
//                       onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
//                       className="w-full p-2 border rounded"
//                     >
//                       <option value="pending">Payment Pending</option>
//                       <option value="paid">Paid</option>
//                       <option value="failed">Failed</option>
//                       <option value="refunded">Refunded</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="mt-4 pt-4 border-t">
//                   <h4 className="font-medium mb-2">Order Items:</h4>
//                   <div className="space-y-2">
//                     {order.items.map((item) => (
//                       <div key={item.id} className="flex justify-between items-center">
//                         <span>{item.animal_name} x{item.quantity}</span>
//                         <span>${item.subtotal.toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FarmerDashboard;