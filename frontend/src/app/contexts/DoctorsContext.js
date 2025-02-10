import React, { createContext, useState } from 'react';

// Create the context
export const DoctorsContext = createContext();

// Provider component
export const DoctorsProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);

  // Function to update doctors
  const updateDoctors = (newList) => {
    setDoctors(newList);
  };

  return (
    <DoctorsContext.Provider value={{ doctors, updateDoctors }}>
      {children}
    </DoctorsContext.Provider>
  );
};