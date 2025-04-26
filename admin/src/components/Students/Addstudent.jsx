import React, { useState } from 'react';
import axios from 'axios';
import './StudentTable.css'; // Импортируем CSS файл

const Addstudent = () => {
  const [name, setName] = useState('');
  const [iin, setIIN] = useState('');
  const [groupId, setGroupId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/students', { name, iin });
      setMessage('Студент добавлен успешно');
      setName('');
      setIIN('');
      setGroupId('');
    } catch (error) {
      setMessage('Ошибка при добавлении студента');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <input
        type="text"
        placeholder="ФИО"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="add-student-input"
        required
      />
      <input
        type="text"
        placeholder="ИИН"
        value={iin}
        onChange={(e) => setIIN(e.target.value)}
        className="add-student-input"
        required
      />
      <button type="submit" className="add-student-button">
        Добавить
      </button>
      {message && <p className="add-student-message">{message}</p>}
    </form>
  );
};

export default Addstudent;