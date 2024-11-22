import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App = () => {
  const position = [-26.292977, -48.848306];

  const categories = ["food", "shelter", "emergency", "helpCenter", "caps"];

  const [markers, setMarkers] = useState([
    {
      position: [-26.304408, -48.846383],
      title: "Centro de Ajuda",
      description: "Local de assistência para pessoas em necessidade.",
      category: "helpCenter",
      hours: [{ from: "09:00", to: "18:00" }],
      info: "Oferece suporte psicológico e assistencial.",
    }
  ]);

  const [activeFilters, setActiveFilters] = useState({
    food: true,
    shelter: true,
    emergency: true,
    helpCenter: true,
    caps: true,
  });

  const [showFilters, setShowFilters] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // Estado para armazenar um novo marcador enquanto está sendo adicionado
  const [newMarker, setNewMarker] = useState({
    position: null,
    title: '',
    description: '',
    category: categories[0],
    hours: [],
    info: '',
  });

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

  // Filtra os marcadores com base nos filtros ativos
  const filteredMarkers = markers.filter((marker) => {
    const categoryKey = marker.category;
    return activeFilters[categoryKey];
  });

  const handleMapClick = (e) => {
    if (isAddingMarker) {
      setNewMarker((prev) => ({
        ...prev,
        position: [e.latlng.lat, e.latlng.lng],
      }));
      setShowModal(true);
      setIsAddingMarker(false);
    }
  };

  const handleAddMarker = () => {
    setIsAddingMarker(true);
  };

  const handleCancel = () => {
    setNewMarker({
      position: null,
      title: '',
      description: '',
      category: categories[0],
      hours: [],
      info: '',
    });
    setShowModal(false);
    setIsAddingMarker(false);
  };

  const handleSaveMarker = () => {
    if (newMarker.title && newMarker.position) {
      const newMarkerData = { ...newMarker };
      setMarkers((prevMarkers) => [...prevMarkers, newMarkerData]);

      setShowModal(false);
      setIsAddingMarker(false);
      setNewMarker({
        position: null,
        title: '',
        description: '',
        category: categories[0],
        hours: [],
        info: '',
      });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  };

  const handleAddSchedule = () => {
    setNewMarker((prev) => ({
      ...prev,
      hours: [...prev.hours, { from: '', to: '' }],
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedHours = [...newMarker.hours];
    updatedHours[index][field] = value;
    setNewMarker((prev) => ({ ...prev, hours: updatedHours }));
  };

  const SetMapBounds = ({ bounds }) => {
    const map = useMap();
    map.setMaxBounds(bounds);
    map.on('click', handleMapClick);
    return null;
  };

  return (
    <div className="app-container">
      <button className="toggle-filters-button" onClick={toggleFilters}>
        {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
      </button>

      {showFilters && (
        <div className="filter-box">
          <h1 className="project-title">Conectar e Ajudar: Mapa Solidário</h1>
          {categories.map((category, index) => (
            <label key={index}>
              <input
                type="checkbox"
                name={category}
                checked={activeFilters[category]}
                onChange={() => handleFilterChange(category)}
              /> {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          ))}
          <button className="add-marker-button" onClick={handleAddMarker}>
            Adicionar Marcador
          </button>
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
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="leaflet-popup-content">
                <h2>{marker.title}</h2>
                <p>{marker.description}</p>
                <p><strong>Horário:</strong> {marker.hours.map(h => `${h.from} - ${h.to}`).join(', ')}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Adicionar Marcador</h2>
            <label>
              Título:
              <input
                type="text"
                value={newMarker.title}
                onChange={(e) => setNewMarker({ ...newMarker, title: e.target.value })}
              />
            </label>
            <label>
              Descrição:
              <input
                type="text"
                value={newMarker.description}
                onChange={(e) => setNewMarker({ ...newMarker, description: e.target.value })}
              />
            </label>
            <label>
              Categoria:
              <select
                value={newMarker.category}
                onChange={(e) => setNewMarker({ ...newMarker, category: e.target.value })}
              >
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label>
              Horários de Atendimento:
              {newMarker.hours.map((schedule, index) => (
                <div key={index}>
                  <input
                    type="time"
                    value={schedule.from}
                    onChange={(e) => handleScheduleChange(index, 'from', e.target.value)}
                  />
                  <span> até </span>
                  <input
                    type="time"
                    value={schedule.to}
                    onChange={(e) => handleScheduleChange(index, 'to', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddSchedule}>Adicionar Turno</button>
            </label>
            <label>
              Informações Adicionais:
              <input
                type="text"
                value={newMarker.info}
                onChange={(e) => setNewMarker({ ...newMarker, info: e.target.value })}
              />
            </label>
            <button onClick={handleSaveMarker}>Salvar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
