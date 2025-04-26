import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Schedule = () => {
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    group: '',
    subject: '',
    teacher: '',
    time: '',
    room: '',
    date: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/groups').then(res => setGroups(res.data));
    axios.get('http://localhost:8080/api/subjects').then(res => setSubjects(res.data.subjects || res.data)); 
    axios.get('http://localhost:8080/api/teachers').then(res => setTeachers(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      // Отправляем все данные одним запросом
      await axios.post('http://localhost:8080/api/schedules', {
        group: formData.group,
        subject: formData.subject,
        teacher: formData.teacher,
        time: formData.time,
        room: formData.room,
        date: formData.date // Добавляем дату в основной запрос
      });

      setMessage('✅ Расписание успешно добавлено');
      setFormData({ group: '', subject: '', teacher: '', time: '', room: '', date: '' });
    } catch (err) {
      console.error('Ошибка при добавлении:', err.response?.data || err.message);
      setMessage(`❌ Ошибка при добавлении расписания: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Добавить расписание</h2>
      {message && <div className={`mb-4 text-center text-sm ${message.includes('✅') ? 'text-green-500' : 'text-red-500'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input 
          name="date" 
          type="date" 
          value={formData.date} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          required 
        />

        <select 
          name="group" 
          value={formData.group} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          required
        >
          <option value="">Выберите группу</option>
          {groups.map(g => (
            <option key={g._id} value={g._id}>{g.name}</option>
          ))}
        </select>

        <select 
          name="subject" 
          value={formData.subject} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          required
        >
          <option value="">Выберите предмет</option>
          {subjects.map(s => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <select 
          name="teacher" 
          value={formData.teacher} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          required
        >
          <option value="">Выберите преподавателя</option>
          {teachers.map(t => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <input 
          name="time" 
          type="time" 
          value={formData.time} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          placeholder="Время (например, 08:00)" 
          required 
        />

        <input 
          name="room" 
          type="text" 
          value={formData.room} 
          onChange={handleChange}
          className="w-full border p-2 rounded" 
          placeholder="Аудитория" 
          required 
        />

        <button 
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default Schedule;