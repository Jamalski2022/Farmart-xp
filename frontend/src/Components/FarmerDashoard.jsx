import React, { useState, useEffect } from 'react';
import { animalsAPI, orderAPI } from '../services/api';
import { CloudinaryContext } from 'cloudinary-react';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const uploadImageToCloudinary = async (file) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();
      setUploadingImage(false);
      return result.secure_url;
    } catch (error) {
      setUploadingImage(false);
      setError('Failed to upload image');
      console.error('Cloudinary upload error:', error);
      return null;
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
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile);
      }

      const currentAnimal = editingAnimal || newAnimal;
      const formData = {
        name: currentAnimal.name,
        category: currentAnimal.category,
        price: currentAnimal.price,
        description: currentAnimal.description || '',
        image_url: imageUrl || currentAnimal.image_url
      };

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
        image_url: '',
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

//   return (
//     <CloudinaryContext cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}>
//       <div className="w-full max-w-4xl mx-auto mt-8 p-6">
//         <div className="mb-6 flex space-x-4">
//           <button
//             onClick={() => setActiveTab('animals')}
//             className={`px-4 py-2 rounded ${
//               activeTab === 'animals' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             Manage Animals
//           </button>
//           <button
//             onClick={() => setActiveTab('orders')}
//             className={`px-4 py-2 rounded ${
//               activeTab === 'orders' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-200 text-gray-700'
//             }`}
//           >
//             Manage Orders
//           </button>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {success && <p className="text-green-500 mb-4">{success}</p>}

//         {activeTab === 'animals' ? (
//           <div>
//             <form onSubmit={handleSubmit} className="space-y-4 mb-8" encType="multipart/form-data">
//               <div className="flex flex-col space-y-2">
//                 <h2 className="text-xl font-semibold">
//                   {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
//                 </h2>
//                 <input
//                   type="text"
//                   name="name"
//                   value={currentAnimal.name}
//                   onChange={handleInputChange}
//                   placeholder="Animal Name"
//                   className="p-2 border rounded"
//                   required
//                 />
//                 <select
//                   name="category"
//                   value={currentAnimal.category}
//                   onChange={handleInputChange}
//                   className="p-2 border rounded"
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   <option value="cow">Cow</option>
//                   <option value="goat">Goat</option>
//                   <option value="chicken">Chicken</option>
//                 </select>
//                 <input
//                   type="number"
//                   name="price"
//                   value={currentAnimal.price}
//                   onChange={handleInputChange}
//                   placeholder="Price"
//                   className="p-2 border rounded"
//                   required
//                 />
//                 <textarea
//                   name="description"
//                   value={currentAnimal.description || ''}
//                   onChange={handleInputChange}
//                   placeholder="Description"
//                   className="p-2 border rounded"
//                   required
//                 />
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={handleFileChange}
//                   accept="image/*"
//                   className="p-2 border rounded"
//                   required={!editingAnimal}
//                   disabled={uploadingImage}
//                 />
//                 {uploadingImage && (
//                   <p className="text-blue-500">Uploading image...</p>
//                 )}
//                 <div className="flex space-x-2">
//                   <button
//                     type="submit"
//                     className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex-1"
//                     disabled={uploadingImage}
//                   >
//                     {editingAnimal ? 'Update Animal' : 'Add Animal'}
//                   </button>
//                   {editingAnimal && (
//                     <button
//                       type="button"
//                       onClick={cancelEdit}
//                       className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//                     >
//                       Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </form>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {animals.map((animal) => (
//                 <div key={animal.id} className="border p-4 rounded">
//                   {animal.image_url ? (
//                     <img
//                       src={animal.image_url}
//                       alt={animal.name}
//                       className="w-full h-48 object-cover rounded mb-2"
//                       onError={(e) => {
//                         e.target.src = '/api/placeholder/200/200';
//                       }}
//                     />
//                   ) : (
//                     <img
//                       src="/api/placeholder/200/200"
//                       alt="placeholder"
//                       className="w-full h-48 object-cover rounded mb-2"
//                     />
//                   )}
//                   <h3 className="font-semibold">{animal.name}</h3>
//                   <p>Category: {animal.category}</p>
//                   <p>Price: ${animal.price}</p>
//                   <p>Description: {animal.description}</p>
//                   <div className="flex space-x-2 mt-2">
//                     <button
//                       onClick={() => handleEdit(animal)}
//                       className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 flex-1"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(animal.id)}
//                       className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex-1"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {loading ? (
//               <p>Loading orders...</p>
//             ) : (
//               <>
//                 {orders.map((order) => (
//                   <div key={order.id} className="border rounded-lg p-4 space-y-2">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold">Order #{order.id}</h3>
//                         <p className="text-sm text-gray-600">
//                           Placed on: {formatDate(order.order_date)}
//                         </p>
//                         <p className="font-medium">Total: ${order.total_price.toFixed(2)}</p>
//                       </div>
//                       <div className="space-x-2">
//                         {order.status === 'pending' && (
//                           <>
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'processing')}
//                               className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                             >
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => updateOrderStatus(order.id, 'cancelled')}
//                               className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}
//                         <span className={`px-2 py-1 rounded text-sm ${
//                           order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
//                           order.status === 'completed' ? 'bg-green-100 text-green-800' :
//                           order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="mt-4">
//                       <h4 className="font-medium mb-2">Order Items:</h4>
//                       <div className="space-y-2">
//                         {order.items.map((item) => (
//                           <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
//                             <span>{item.animal_name}</span>
//                             <span className="text-gray-600">
//                               {item.quantity} x ${item.price.toFixed(2)}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
                    
//                     {order.shipping_address && (
//                       <div className="mt-2 text-sm text-gray-600">
//                         <p>Shipping Address: {order.shipping_address}</p>
//                         <p>Phone: {order.phone_number}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
                
//                 {orders.length === 0 && (
//                   <p className="text-center text-gray-500">No orders found</p>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </CloudinaryContext>
//   );
// };

// export default FarmerDashboard;

return (
  <CloudinaryContext cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}>
    <div className="dashboard-container">
      <div className="tab-buttons">
        <button
          onClick={() => setActiveTab('animals')}
          className={`tab-button ${activeTab === 'animals' ? 'active' : ''}`}
        >
          Manage Animals
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
        >
          Manage Orders
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {activeTab === 'animals' ? (
        <div>
          <form onSubmit={handleSubmit} className="animal-form" encType="multipart/form-data">
            <div className="form-container">
              <h2 className="form-title">
                {editingAnimal ? 'Edit Animal' : 'Add New Animal'}
              </h2>
              <input
                type="text"
                name="name"
                value={currentAnimal.name}
                onChange={handleInputChange}
                placeholder="Animal Name"
                className="form-input"
                required
              />
              <select
                name="category"
                value={currentAnimal.category}
                onChange={handleInputChange}
                className="form-select"
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
                className="form-input"
                required
              />
              <textarea
                name="description"
                value={currentAnimal.description || ''}
                onChange={handleInputChange}
                placeholder="Description"
                className="form-textarea"
                required
              />
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="form-file-input"
                required={!editingAnimal}
                disabled={uploadingImage}
              />
              {uploadingImage && (
                <p className="upload-status">Uploading image...</p>
              )}
              <div className="button-group">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={uploadingImage}
                >
                  {editingAnimal ? 'Update Animal' : 'Add Animal'}
                </button>
                {editingAnimal && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="animals-grid">
            {animals.map((animal) => (
              <div key={animal.id} className="animal-card">
                {animal.image_url ? (
                  <img
                    src={animal.image_url}
                    alt={animal.name}
                    className="animal-image"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/200/200';
                    }}
                  />
                ) : (
                  <img
                    src="/api/placeholder/200/200"
                    alt="placeholder"
                    className="animal-image animal-image-small"
                  />
                )}
                <h3 className="animal-name">{animal.name}</h3>
                <p>Category: {animal.category}</p>
                <p>Price: ${animal.price}</p>
                <p>Description: {animal.description}</p>
                <div className="animal-actions">
                  <button
                    onClick={() => handleEdit(animal)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="orders-container">
          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <>
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-title">Order #{order.id}</h3>
                      <p className="order-date">
                        Placed on: {formatDate(order.order_date)}
                      </p>
                      <p className="order-total">Total: ${order.total_price.toFixed(2)}</p>
                    </div>
                    <div className="order-actions">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="accept-button"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="reject-button"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="order-items">
                    <h4 className="items-title">Order Items:</h4>
                    <div className="items-list">
                      {order.items.map((item) => (
                        <div key={item.id} className="order-item">
                          <span>{item.animal_name}</span>
                          <span className="item-price">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="shipping-info">
                      <p>Shipping Address: {order.shipping_address}</p>
                      <p>Phone: {order.phone_number}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {orders.length === 0 && (
                <p className="no-orders">No orders found</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  </CloudinaryContext>
);
};

export default FarmerDashboard;
