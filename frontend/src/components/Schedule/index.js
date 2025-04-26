import React from 'react';
import { useDate } from '../../Context/ContextApp';
import './Schedule.css';

const Schedule = () => {
  const { selectedDate, schedules, loading, error } = useDate(); // Переименовываем dates в schedules

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return <div>Нет данных для отображения</div>;
  }

  return (
    <div>
      <h1>Расписание</h1>
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
            if (!scheduleItem) return null;
            
            // Форматируем дату для отображения
            const formattedDate = scheduleItem.date 
              ? new Date(scheduleItem.date).toLocaleDateString() 
              : 'Не указана';
            
            return (
              <tr key={scheduleItem._id}>
                <td className="date-column">{formattedDate}</td>
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