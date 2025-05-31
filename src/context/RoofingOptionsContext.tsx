import React, { createContext, useContext, useState } from 'react';

const defaultOptions = [
  {
    key: 'good',
    label: 'Good Option',
    title: 'Standard Quality',
    description: 'Reliable and affordable roofing solution with quality materials that provide excellent protection for your home.',
    warranty: '10-year manufacturer warranty on materials, 2-year workmanship warranty',
    imageUrl: 'https://via.placeholder.com/150',
    pricePerSquare: 625,
    pricePerSquareUnder16: 675,
  },
  {
    key: 'better',
    label: 'Better Option',
    title: 'Premium Quality',
    description: 'Enhanced roofing system with superior materials and advanced installation techniques for long-lasting durability.',
    warranty: '20-year manufacturer warranty on materials, 5-year workmanship warranty',
    imageUrl: 'https://via.placeholder.com/150',
    pricePerSquare: 770,
    pricePerSquareUnder16: 820,
  },
  {
    key: 'best',
    label: 'Best Option',
    title: 'Elite Quality',
    description: 'Top-of-the-line roofing system with premium materials, cutting-edge technology, and expert craftsmanship.',
    warranty: '30-year manufacturer warranty on materials, 10-year workmanship warranty',
    imageUrl: 'https://via.placeholder.com/150',
    pricePerSquare: 866,
    pricePerSquareUnder16: 925,
  },
];

const RoofingOptionsContext = createContext<any>(null);

export const RoofingOptionsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [options, setOptions] = useState(defaultOptions);
  return (
    <RoofingOptionsContext.Provider value={{ options, setOptions }}>
      {children}
    </RoofingOptionsContext.Provider>
  );
};

export const useRoofingOptions = () => useContext(RoofingOptionsContext); 