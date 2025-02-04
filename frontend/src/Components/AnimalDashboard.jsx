import React, { useState, useEffect } from "react";
import axios from "axios";
import AnimalForm from "./AnimalForm";
import AnimalList from "./AnimalList";

const AnimalDashboard = () => {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    fetchAnimals(); // Fetch animals when the component mounts
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/animals", {
        withCredentials: true,
      });
      setAnimals(response.data);
    } catch (error) {
      console.error("Error fetching animals:", error);
    }
  };

  return (
    <div>
      <h2>Animal Dashboard</h2>
      <AnimalForm fetchAnimals={fetchAnimals} /> {/* Pass fetchAnimals as a prop */}
      <AnimalList animals={animals} />
    </div>
  );
};

export default AnimalDashboard;
