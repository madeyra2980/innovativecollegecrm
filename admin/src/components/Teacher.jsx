import React, { useState } from 'react';
import axios from 'axios';

const Teacher = () => {
  const [name, setName] = useState('');
  const [iin, setIIN] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/teachers', { name, iin });
      setMessage('Преподаватель добавлен успешно');
      setName('');
      setIIN('');
    } catch (error) {
      setMessage('Ошибка при добавлении преподавателя');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Добавить преподавателя</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="ФИО"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-4 py-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="ИИН"
          value={iin}
          onChange={(e) => setIIN(e.target.value)}
          className="border rounded px-4 py-2 w-full"
          required
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">
          Добавить
        </button>
        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Teacher;
