import React, { useState } from 'react'
import axios from 'axios';

const Addgroup = () => {

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/groups', { name });
      setMessage('Группа добавлена успешно');
      setName('');
    } catch (error) {
      setMessage('Ошибка при добавлении группы');
    }
  };
  return (
    <div>Addgroup</div>
  )
}

export default Addgroup