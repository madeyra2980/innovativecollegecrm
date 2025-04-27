import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dates.css';
import ScheduleModal from '../Schedule/ScheduleModal.jsx';

const Dates = () => {

  // Состояния компонента
  const [dates, setDates] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);

  // Определение смен и временных слотов
  const shifts = {
    '1 смена': ['1 урок 8:00 - 9:20', '2 урок 9:40 - 11:00', '3 урок 11:20 - 12:40'],
    '2 смена': ['4 урок 13:00 - 14:20', '5 урок 14:40 - 16:00', '6 урок 16:20 - 17:40']
  };

  // Загрузка данных с сервера
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Параллельная загрузка всех необходимых данных
      const [datesRes, schedulesRes, groupsRes, subjectsRes, teachersRes] = await Promise.all([
        axios.get('http://localhost:8080/api/dates'),
        axios.get('http://localhost:8080/api/schedules'),
        axios.get('http://localhost:8080/api/groups'),
        axios.get('http://localhost:8080/api/subjects'),
        axios.get('http://localhost:8080/api/teachers')
      ]);

      // Обновление состояний с проверкой на массив
      setDates(Array.isArray(datesRes.data?.dates) ? datesRes.data.dates : []);
      setSchedules(Array.isArray(schedulesRes.data?.schedules) ? schedulesRes.data.schedules : []);
      setGroups(Array.isArray(groupsRes.data) ? groupsRes.data : []);
      
      // Особенная обработка subjects, так как структура ответа может отличаться
      const subjectsData = subjectsRes.data?.subjects || subjectsRes.data;
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      
      setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);

    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, []);

  // Форматирование даты для сравнения
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Получение расписания для конкретной даты
  const getSchedulesForDate = (date) => {
    const dateStr = formatDate(date);
    return schedules.filter(schedule => {
      if (!schedule.date) return false;
      return formatDate(schedule.date) === dateStr;
    });
  };

  // Группировка расписания по сменам и временным слотам
  const groupByShift = (items) => {
    const result = {};
    
    Object.keys(shifts).forEach(shift => {
      result[shift] = {};
      shifts[shift].forEach(timeSlot => {
        result[shift][timeSlot] = items.filter(item => item.time === timeSlot);
      });
    });

    return result;
  };

  // Обработчики событий
  const handleEmptySlotClick = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedDate(currentDate);
    setScheduleToEdit(null);
    setIsModalOpen(true);
  };

  const handleLessonClick = (e, lesson) => {
    e.stopPropagation();
    setScheduleToEdit(lesson);
    setIsModalOpen(true);
  };

  const handleSubmitSuccess = () => {
    fetchData();
    setIsModalOpen(false);
  };

  // Получение данных для текущей даты
  const schedulesForCurrentDate = getSchedulesForDate(currentDate);
  const grouped = groupByShift(schedulesForCurrentDate);

  // Рендер временных слотов
  const renderTimeSlots = () => {
    if (!grouped || Object.keys(grouped).length === 0) {
      return <div className="no-data">Нет данных о расписании на выбранную дату</div>;
    }

    return Object.entries(grouped).map(([shift, timeSlots]) => (
      <div key={shift} className="shift-section">
        <h4>{shift}</h4>
        <div className="time-slots">
          {Object.entries(timeSlots).map(([time, lessons]) => (
            <div 
              key={time} 
              className="time-slot"
              onClick={() => handleEmptySlotClick(time)}
            >
              <div className="time-header">{time}</div>
              <div className="lessons-container">
                {lessons && lessons.length > 0 ? (
                  lessons.map(lesson => (
                    <div 
                      key={lesson._id} 
                      className="lesson-card"
                      onClick={(e) => handleLessonClick(e, lesson)}
                    >
                      <div className="lesson-field">
                        <span className="field-label">Группа:</span> 
                        <span className="field-value">{lesson.group?.name || '-'}</span>
                      </div>
                      <div className="lesson-field">
                        <span className="field-label">Предмет:</span> 
                        <span className="field-value">{lesson.subject?.name || '-'}</span>
                      </div>
                      <div className="lesson-field">
                        <span className="field-label">Преподаватель:</span> 
                        <span className="field-value">{lesson.teacher?.name || '-'}</span>
                      </div>
                      <div className="lesson-field">
                        <span className="field-label">Кабинет:</span> 
                        <span className="field-value">{lesson.room || '-'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-lesson">Нет занятий</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Основной рендер компонента
  return (
    <div className="schedule-calendar">
      <h2>Расписание занятий</h2>
      
      <div className="date-navigation">
  
        <span className="current-date">
          {currentDate.toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
        

      </div>

      <div className="date-section">
        {loading ? (
          <div className="loading">Загрузка расписания...</div>
        ) : (
          renderTimeSlots()
        )}
      </div>

      {isModalOpen && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshSchedules={fetchData}
          scheduleToEdit={scheduleToEdit}
          groups={groups}
          subjects={subjects}
          teachers={teachers}
          initialTime={selectedTimeSlot}
          initialDate={selectedDate}
          currentDate={currentDate}
        />
      )}
    </div>
  );
};

export default Dates;