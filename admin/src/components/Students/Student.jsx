import React, { useState, useEffect } from 'react';
import './StudentTable.css';

// Модальный компонент StudentModal
const StudentModal = ({ isOpen, onClose, refreshStudents, studentToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    iin: ''
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        name: studentToEdit.name,
        iin: studentToEdit.iin
      });
    } else {
      setFormData({ name: '', iin: '' });
    }
  }, [studentToEdit]);

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
      const url = studentToEdit 
        ? `http://localhost:8080/api/students/${studentToEdit._id}`
        : "http://localhost:8080/api/students/";
      
      const method = studentToEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        refreshStudents();
        onClose();
      }
    } catch (error) {
      console.error("Ошибка при сохранении студента:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{studentToEdit ? 'Редактировать студента' : 'Добавить студента'}</h2>
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
            {studentToEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

const Student = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  
  // Состояния для сортировки и фильтрации
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [iinFilter, setIinFilter] = useState('');

  const getStudents = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/students/");
      const data = await res.json();
      const studentsArray = Array.isArray(data) ? data : data.students;
      setStudents(studentsArray || []);
      setFilteredStudents(studentsArray || []);
    } catch (error) {
      console.error("Ошибка при загрузке студентов:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/students/${id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          getStudents();
        }
      } catch (error) {
        console.error("Ошибка при удалении студента:", error);
      }
    }
  };

  const handleEdit = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  // Функция для сортировки студентов
  const sortStudents = (field) => {
    let direction = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredStudents].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(sorted);
  };

  // Функция для фильтрации студентов
  const filterStudents = () => {
    let result = [...students];
    
    // Фильтрация по имени (поиск)
    if (searchTerm) {
      result = result.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Фильтрация по ИИН
    if (iinFilter) {
      result = result.filter(student => 
        student.iin.includes(iinFilter)
      );
    }
    
    // Сортировка
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredStudents(result);
  };

  // Эффект для фильтрации при изменении параметров
  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, iinFilter, sortField, sortDirection]);

  useEffect(() => {
    getStudents();
  }, []);

  return (
    <div className="student-table-container">
      <div className="controls">
        <button 
          className="add-student-button"
          onClick={() => {
            setStudentToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Добавить студента
        </button>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <input
            type="text"
            placeholder="Фильтр по ИИН..."
            value={iinFilter}
            onChange={(e) => setIinFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th onClick={() => sortStudents('name')}>
              ФИО {sortField === 'name' && (
                <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => sortStudents('iin')}>
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
          ) : filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.iin}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(student)}
                  >
                    Редактировать
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(student._id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="empty-message">Нет данных о студентах</td>
            </tr>
          )}
        </tbody>
      </table>

      <StudentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setStudentToEdit(null);
        }}
        refreshStudents={getStudents}
        studentToEdit={studentToEdit}
      />
    </div>
  );
};

export default Student;