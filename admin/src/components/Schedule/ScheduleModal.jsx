import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleModal = ({
  isOpen,
  onClose,
  refreshSchedules,
  scheduleToEdit,
  groups = [],
  subjects = [],
  teachers = [],
  dates = [],
}) => {
  const [formData, setFormData] = useState({
    group: '',
    subject: '',
    teacher: '',
    time: '',
    room: '',
    dateId: '',
  });

  useEffect(() => {
    if (scheduleToEdit) {
      setFormData({
        group: scheduleToEdit.group?._id || '',
        subject: scheduleToEdit.subject?._id || '',
        teacher: scheduleToEdit.teacher?._id || '',
        time: scheduleToEdit.time || '',
        room: scheduleToEdit.room || '',
        dateId: scheduleToEdit.date?._id || '',
      });
    } else {
      setFormData({
        group: '',
        subject: '',
        teacher: '',
        time: '',
        room: '',
        dateId: '',
      });
    }
  }, [scheduleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.dateId) {
      alert('Пожалуйста, выберите дату.');
      return;
    }
  
    try {
      // Проверяем, свободна ли выбранная дата
      const dateResponse = await axios.get(`http://localhost:8080/api/dates/${formData.dateId}`);
      const dateData = dateResponse.data;
      
      // Если дата уже занята другим расписанием (и это не текущее расписание при редактировании)
      if (dateData.schedule && (!scheduleToEdit || dateData.schedule !== scheduleToEdit._id)) {
        alert('Эта дата уже занята другим расписанием!');
        return;
      }
  
      let response;
      if (scheduleToEdit) {
        // Если редактируем, сначала освобождаем старую дату (если она изменилась)
        if (scheduleToEdit.date?._id && scheduleToEdit.date._id !== formData.dateId) {
          await axios.put(`http://localhost:8080/api/dates/${scheduleToEdit.date._id}`, {
            schedule: null
          });
        }
        
        response = await axios.put(
          `http://localhost:8080/api/schedules/${scheduleToEdit._id}`,
          formData
        );
      } else {
        response = await axios.post(
          'http://localhost:8080/api/schedules',
          formData
        );
      }
  
      // Привязываем расписание к новой дате
      await axios.put(`http://localhost:8080/api/dates/${formData.dateId}`, {
        schedule: response.data._id
      });
  
      refreshSchedules();
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении расписания:', error);
      alert('Произошла ошибка при сохранении расписания');
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">
          {scheduleToEdit ? 'Редактировать расписание' : 'Добавить расписание'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Выбор даты */}
          <div className="form-group">
            <label>Дата:</label>
            <select
              name="dateId"
              value={formData.dateId}
              onChange={handleChange}
              required
            >
              <option value="">Выберите дату</option>
              {dates.map((d) => (
                <option key={d._id} value={d._id}>
                  {new Date(d.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Группа */}
          <div className="form-group">
            <label>Группа:</label>
            <select
              name="group"
              value={formData.group}
              onChange={handleChange}
              required
            >
              <option value="">Выберите группу</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Предмет */}
          <div className="form-group">
            <label>Предмет:</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Выберите предмет</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Преподаватель */}
          <div className="form-group">
            <label>Преподаватель:</label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
            >
              <option value="">Выберите преподавателя</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Время */}
          <div className="form-group">
            <label>Время:</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Выберите время</option>
              <option value="1 урок 8:00 - 9:20">1 урок 8:00 - 9:20</option>
              <option value="2 урок 9:40 - 11:00">2 урок 9:40 - 11:00</option>
              <option value="3 урок 11:20 - 12:40">3 урок 11:20 - 12:40</option>
            </select>
          </div>

          {/* Аудитория */}
          <div className="form-group">
            <label>Аудитория:</label>
            <input
              type="text"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            {scheduleToEdit ? 'Сохранить' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
