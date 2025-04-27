import React, { useState, useEffect } from 'react';
import '../Group/Group.css';

// Модальное окно для добавления/редактирования
const SubjectModal = ({ isOpen, onClose, refreshSubjects, subjectToEdit }) => {
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({ name: subjectToEdit.name });
    } else {
      setFormData({ name: '' });
    }
  }, [subjectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = subjectToEdit 
        ? `http://localhost:8080/api/subjects/${subjectToEdit._id}`
        : 'http://localhost:8080/api/subjects/';
      
      const method = subjectToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        refreshSubjects();
        onClose();
      }
    } catch (error) {
      console.error('Ошибка при сохранении предмета:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{subjectToEdit ? 'Редактировать предмет' : 'Добавить предмет'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название предмета:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {subjectToEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Subject = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const getSubjects = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/subjects/');
      const data = await res.json();
      const subjectsArray = Array.isArray(data) ? data : data.subjects;
      setSubjects(subjectsArray || []);
      setFilteredSubjects(subjectsArray || []);
    } catch (error) {
      console.error('Ошибка при загрузке предметов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот предмет?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/subjects/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          getSubjects();
        }
      } catch (error) {
        console.error('Ошибка при удалении предмета:', error);
      }
    }
  };

  const handleEdit = (subject) => {
    setSubjectToEdit(subject);
    setIsModalOpen(true);
  };

  const sortSubjects = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredSubjects].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubjects(sorted);
  };

  const filterSubjects = () => {
    let result = [...subjects];

    if (searchTerm) {
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubjects(result);
  };

  useEffect(() => {
    filterSubjects();
  }, [subjects, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <div className="group-table-container">
      <div className="">
        <button 
          className="add-group-button"
          onClick={() => {
            setSubjectToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Добавить предмет
        </button>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="group-table">
        <thead>
          <tr>
            <th onClick={() => sortSubjects('name')}>
              Название {sortField === 'name' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="2" className="loading-message">Загрузка данных...</td>
            </tr>
          ) : filteredSubjects.length > 0 ? (
            filteredSubjects.map(subject => (
              <tr key={subject._id}>
                <td>{subject.name}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(subject)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(subject._id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="empty-message">Нет данных о предметах</td>
            </tr>
          )}
        </tbody>
      </table>

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubjectToEdit(null);
        }}
        refreshSubjects={getSubjects}
        subjectToEdit={subjectToEdit}
      />
    </div>
  );
};

export default Subject;
