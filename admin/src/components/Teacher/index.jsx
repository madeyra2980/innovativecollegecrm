import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Group/Group.css';

// Модалка для добавления и редактирования
const TeacherModal = ({ isOpen, onClose, refreshTeachers, teacherToEdit }) => {
  const [formData, setFormData] = useState({ name: '', iin: '' });

  useEffect(() => {
    if (teacherToEdit) {
      setFormData({ name: teacherToEdit.name, iin: teacherToEdit.iin });
    } else {
      setFormData({ name: '', iin: '' });
    }
  }, [teacherToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (teacherToEdit) {
        await axios.put(`http://localhost:8080/api/teachers/${teacherToEdit._id}`, formData);
      } else {
        await axios.post('http://localhost:8080/api/teachers', formData);
      }
      refreshTeachers();
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении преподавателя:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{teacherToEdit ? 'Редактировать преподавателя' : 'Добавить преподавателя'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ФИО:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>ИИН:</label>
            <input
              type="text"
              name="iin"
              value={formData.iin}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {teacherToEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const getTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/teachers');
      const teachersArray = Array.isArray(res.data) ? res.data : res.data.teachers;
      setTeachers(teachersArray || []);
      setFilteredTeachers(teachersArray || []);
    } catch (error) {
      console.error('Ошибка при загрузке преподавателей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      try {
        await axios.delete(`http://localhost:8080/api/teachers/${id}`);
        getTeachers();
      } catch (error) {
        console.error('Ошибка при удалении преподавателя:', error);
      }
    }
  };

  const handleEdit = (teacher) => {
    setTeacherToEdit(teacher);
    setIsModalOpen(true);
  };

  const sortTeachers = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredTeachers].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTeachers(sorted);
  };

  const filterTeachers = () => {
    let result = [...teachers];

    if (searchTerm) {
      result = result.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTeachers(result);
  };

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    getTeachers();
  }, []);

  return (
    <div className="group-table-container">
      <div className="controls">
        <button
          className="add-group-button"
          onClick={() => {
            setTeacherToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Добавить преподавателя
        </button>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по ФИО..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="group-table">
        <thead>
          <tr>
            <th onClick={() => sortTeachers('name')}>
              ФИО {sortField === 'name' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => sortTeachers('iin')}>
              ИИН {sortField === 'iin' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="loading-message">Загрузка данных...</td>
            </tr>
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map(teacher => (
              <tr key={teacher._id}>
                <td>{teacher.name}</td>
                <td>{teacher.iin}</td>
                <td className="actions-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(teacher)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(teacher._id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty-message">Нет данных о преподавателях</td>
            </tr>
          )}
        </tbody>
      </table>

      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTeacherToEdit(null);
        }}
        refreshTeachers={getTeachers}
        teacherToEdit={teacherToEdit}
      />
    </div>
  );
};

export default Teacher;
