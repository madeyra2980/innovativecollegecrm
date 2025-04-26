import React, { useState, useEffect } from 'react';
import './Group.css';

// Модальный компонент GroupModal
const GroupModal = ({ isOpen, onClose, refreshGroups, groupToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
  });

  useEffect(() => {
    if (groupToEdit) {
      setFormData({
        name: groupToEdit.name,
      });
    } else {
      setFormData({ name: '',  });
    }
  }, [groupToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = groupToEdit 
        ? `http://localhost:8080/api/groups/${groupToEdit._id}`
        : "http://localhost:8080/api/groups/";
      
      const method = groupToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        refreshGroups();
        onClose();
      }
    } catch (error) {
      console.error("Ошибка при сохранении группы:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{groupToEdit ? 'Редактировать группу' : 'Добавить группу'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название группы:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
         
          <button type="submit" className="submit-button">
            {groupToEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToEdit, setGroupToEdit] = useState(null);
  
  // Состояния для сортировки и фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [yearFilter, setYearFilter] = useState('');

  const getGroups = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/groups/");
      const data = await res.json();
      const groupsArray = Array.isArray(data) ? data : data.groups;
      setGroups(groupsArray || []);
      setFilteredGroups(groupsArray || []);
    } catch (error) {
      console.error("Ошибка при загрузке групп:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту группу?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          getGroups();
        }
      } catch (error) {
        console.error("Ошибка при удалении группы:", error);
      }
    }
  };

  const handleEdit = (group) => {
    setGroupToEdit(group);
    setIsModalOpen(true);
  };

  // Функция для сортировки групп
  const sortGroups = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredGroups].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredGroups(sorted);
  };

  // Функция для фильтрации групп
  const filterGroups = () => {
    let result = [...groups];
    
    // Фильтрация по названию группы
    if (searchTerm) {
      result = result.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтрация по году
    if (yearFilter) {
      result = result.filter(group => 
        group.year.toString().includes(yearFilter)
      );
    }
    
    // Сортировка
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredGroups(result);
  };

  // Эффект для фильтрации при изменении параметров
  useEffect(() => {
    filterGroups();
  }, [groups, searchTerm, yearFilter, sortField, sortDirection]);

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <div className="group-table-container">
      <div className="controls">
        <button 
          className="add-group-button"
          onClick={() => {
            setGroupToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Добавить группу
        </button>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <input
            type="text"
            placeholder="Фильтр по году..."
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <table className="group-table">
        <thead>
          <tr>
            <th onClick={() => sortGroups('name')}>
              Название {sortField === 'name' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => sortGroups('specialty')}>
            Действия {sortField === 'specialty' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="loading-message">Загрузка данных...</td>
            </tr>
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <tr key={group._id}>
                <td>{group.name}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(group)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(group._id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-message">Нет данных о группах</td>
            </tr>
          )}
        </tbody>
      </table>

      <GroupModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setGroupToEdit(null);
        }}
        refreshGroups={getGroups}
        groupToEdit={groupToEdit}
      />
    </div>
  );
};

export default Group;