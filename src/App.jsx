import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App = () => {
  const position = [-26.292977, -48.848306];

  const markers = [
    {
      position: [-26.304408, -48.846383],
      title: "Centro de Ajuda",
      description: "Local de assistência para pessoas em necessidade.",
      category: "helpCenter",
      hours: "Seg - Sex: 9h - 18h",
      info: "Oferece suporte psicológico e assistencial.",
      imageUrl: "path/to/help_center_image.jpg",
    },
    {
      position: [-26.302204, -48.848773],
      title: "Abrigo Local",
      description: "Abrigo temporário para pessoas em situação de rua.",
      category: "shelter",
      hours: "Aberto 24 horas",
      info: "Oferece comida, cama e suporte.",
      imageUrl: "path/to/shelter_image.jpg",
    },
    {
      position: [-26.292977, -48.848306],
      title: "Emergência",
      description: "Local emergêncial.",
      category: "emergency",
      hours: "Aberto 24 horas",
      info: "Oferece auxilio médico",
      imageUrl: "/emergency_icon.png",
    },
  ];

  const [activeFilters, setActiveFilters] = useState({
    food: true,
    shelter: true,
    emergency: true,
    helpCenter: true,
    caps: true,
  });

  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (category) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [category]: !prevFilters[category],
    }));
  };

  const toggleFilters = () => {
    if (showFilters) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
    setShowFilters(!showFilters);
  };

  const filteredMarkers = markers.filter((marker) => activeFilters[marker.category]);

  const SetMapBounds = ({ bounds }) => {
    const map = useMap();
    map.setMaxBounds(bounds);
    return null;
  };

  return (
    <div className="app-container">
      <button 
        className="toggle-filters-button"
        onClick={toggleFilters}
      >
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {showFilters && (
        <div className="filter-box">
          <h1 className="project-title">Conectar e Ajudar: Mapa Solidário</h1>
          <label>
            <input 
              type="checkbox" 
              name="food" 
              checked={activeFilters.food} 
              onChange={() => handleFilterChange('food')}
            /> Comida Solidária
          </label>
          <label>
            <input 
              type="checkbox" 
              name="shelter" 
              checked={activeFilters.shelter} 
              onChange={() => handleFilterChange('shelter')}
            /> Abrigo
          </label>
          <label>
            <input 
              type="checkbox" 
              name="emergency" 
              checked={activeFilters.emergency} 
              onChange={() => handleFilterChange('emergency')}
            /> Emergência
          </label>
          <label>
            <input 
              type="checkbox" 
              name="helpCenter" 
              checked={activeFilters.helpCenter} 
              onChange={() => handleFilterChange('helpCenter')}
            /> Centros de Ajuda
          </label>
          <label>
            <input 
              type="checkbox" 
              name="caps" 
              checked={activeFilters.caps} 
              onChange={() => handleFilterChange('caps')}
            /> CAPS
          </label>
        </div>
      )}

      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SetMapBounds bounds={[[-26.6, -49.2], [-25.8, -48.5]]} />
        {filteredMarkers.map((marker, index) => (
          <Marker 
            key={index} 
            position={marker.position}
          >
            <Popup>
              <div className="leaflet-popup-content">
                <h2>{marker.title}</h2>
                <p>{marker.description}</p>
                <p><strong>Horário:</strong> {marker.hours}</p>
                <img src={marker.imageUrl} alt={marker.title} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
