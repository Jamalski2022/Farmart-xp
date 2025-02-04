import React, { useState } from "react";
import axios from "axios";

const AnimalForm = ({ fetchAnimals }) => {
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    breed: "",
    price: "",
    image_url: "",
  });

  const handleAddAnimal = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/animals", newAnimal, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setNewAnimal({ name: "", breed: "", price: "", image_url: "" }); // Clear form
      fetchAnimals(); // Re-fetch the updated list of animals
    } catch (error) {
      console.error("Error adding animal:", error);
    }
  };

  return (
    <form onSubmit={handleAddAnimal}>
      <input type="text" placeholder="Name" value={newAnimal.name} onChange={(e) => setNewAnimal({ ...newAnimal, name: e.target.value })} required />
      <input type="text" placeholder="Breed" value={newAnimal.breed} onChange={(e) => setNewAnimal({ ...newAnimal, breed: e.target.value })} required />
      <input type="number" placeholder="Price" value={newAnimal.price} onChange={(e) => setNewAnimal({ ...newAnimal, price: e.target.value })} required />
      <input type="text" placeholder="Image URL" value={newAnimal.image_url} onChange={(e) => setNewAnimal({ ...newAnimal, image_url: e.target.value })} required />
      <button type="submit">Add Animal</button>
    </form>
  );
};

export default AnimalForm;
