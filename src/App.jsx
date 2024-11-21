import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const App = () => {
  const position = [-26.292977, -48.848306];
  const categories = ["Comida Solidária", "Abrigo", "Emergência", "Centros de Ajuda", "CAPS"];

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
    const categoryKey = marker.category.toLowerCase();
    return activeFilters[categoryKey];
  });

  const handleMapClick = (e) => {
    if (isAddingMarker) {
      setNewMarker((prev) => ({
        ...prev,
        position: [e.latlng.lat, e.latlng.lng],
      }));
      setShowModal(true);
      setIsAddingMarker(false); // Reseta o estado para não permitir múltiplos cliques
    }
  };

  const handleAddMarker = () => {
    setIsAddingMarker(true);
  };

  const handleCancel = () => {
    // Reseta o estado do marcador novo e fecha o modal
    setNewMarker({
      position: null,
      title: '',
      description: '',
      category: categories[0],
      hours: [],
      info: '',
    });
    setShowModal(false);
    setIsAddingMarker(false); // Permite manipulação do mapa novamente
  };

  const handleSaveMarker = () => {
    if (newMarker.title && newMarker.position) {
      // Adiciona o novo marcador à lista de marcadores
      const newMarkerData = {
        ...newMarker,
        category: newMarker.category.toLowerCase().replace(/\s+/g, ''),
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarkerData]);

      // Fecha o modal e reseta o estado
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
