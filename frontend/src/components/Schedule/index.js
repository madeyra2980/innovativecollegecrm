import React from 'react';
import { useDate } from '../../Context/ContextApp';
import './Schedule.css';

const Schedule = () => {
  const { selectedDate, schedules, loading, error } = useDate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указана';
    
    try {
      // Пытаемся обработать строку как ISO дату
      let date = new Date(dateString);
      
      // Если это не сработало, пробуем обработать как timestamp
      if (isNaN(date.getTime())) {
        date = new Date(parseInt(dateString));
      }
      
      // Если всё ещё невалидно, возвращаем ошибку
      if (isNaN(date.getTime())) {
        console.error('Невалидная дата:', dateString);
        return 'Неверный формат';
      }
      
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Ошибка форматирования даты:', e);
      return 'Ошибка даты';
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  if (!schedules || !Array.isArray(schedules)){
    return <div>Некорректные данные расписания</div>;
  }

  if (schedules.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div className="schedule-container">
      <h1>Расписание на {selectedDate ? formatDate(selectedDate) : 'выбранную дату'}</h1>
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Группа</th>
            <th>Предмет</th>
            <th>Преподаватель</th>
            <th>Время</th>
            <th>Аудитория</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((scheduleItem) => {
            if (!scheduleItem) {
              console.warn('Пустой элемент расписания');
              return null;
            }
            
            return (
              <tr key={scheduleItem._id || Math.random()}>
                <td className="date-column">{formatDate(scheduleItem.date)}</td>
                <td className="group-column">{scheduleItem.group?.name || 'Не указано'}</td>
                <td className="subject-column">{scheduleItem.subject?.name || 'Не указано'}</td>
                <td className="teacher-column">{scheduleItem.teacher?.name || 'Не указано'}</td>
                <td className="time-column">{scheduleItem.time || 'Не указано'}</td>
                <td className="room-column">{scheduleItem.room || 'Не указано'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;