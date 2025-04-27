import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Group/Group.css';
import ScheduleModal from './ScheduleModal';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getSchedules = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/schedules');
      console.log(res.data);
      
      // Извлекаем массив schedules из объекта ответа
      const schedulesArray = Array.isArray(res.data.schedules) ? res.data.schedules : [];
      setSchedules(schedulesArray);
      setFilteredSchedules(schedulesArray);
    } catch (error) {
      console.error('Ошибка при загрузке расписания:', error);
      setSchedules([]);
      setFilteredSchedules([]);
    }
  };

  const getGroups = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/groups');
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Ошибка при загрузке групп:', error);
      setGroups([]);
    }
  };

  const getSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/subjects');
      const data = Array.isArray(res.data) ? res.data : (res.data?.subjects || []);
      setSubjects(data);
    } catch (error) {
      console.error('Ошибка при загрузке предметов:', error);
      setSubjects([]);
    }
  };

  const getTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/teachers');
      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Ошибка при загрузке преподавателей:', error);
      setTeachers([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить это расписание?')) {
      try {
        await axios.delete(`http://localhost:8080/api/schedules/${id}`);
        getSchedules();
      } catch (error) {
        console.error('Ошибка при удалении расписания:', error);
      }
    }
  };

  const handleEdit = (schedule) => {
    setScheduleToEdit(schedule);
    setIsModalOpen(true);
  };

  const filterSchedules = () => {
    const result = Array.isArray(schedules) ? [...schedules] : [];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return result.filter(schedule => {
        const groupName = schedule.group?.name?.toLowerCase() || '';
        const subjectName = schedule.subject?.name?.toLowerCase() || '';
        const teacherName = schedule.teacher?.name?.toLowerCase() || '';
        const room = schedule.room?.toLowerCase() || '';

        return (
          groupName.includes(term) ||
          subjectName.includes(term) ||
          teacherName.includes(term) ||
          room.includes(term)
        );
      });
    }

    return result;
  };

  useEffect(() => {
    setFilteredSchedules(filterSchedules());
  }, [schedules, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          getSchedules(),
          getGroups(),
          getSubjects(),
          getTeachers()
        ]);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="group-table-container">
      <div className="controls">
        <button
          className="add-group-button"
          onClick={() => {
            setScheduleToEdit(null);
            setIsModalOpen(true);
          }}
        >
          Добавить расписание
        </button>

        <div className="search-filter">
          <input
            type="text"
            placeholder="Поиск по группе, предмету, преподавателю или аудитории..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <table className="group-table">
        <thead>
          <tr>
            <th>Группа</th>
            <th>Предмет</th>
            <th>Преподаватель</th>
            <th>Время</th>
            <th>Аудитория</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="loading-message">Загрузка данных...</td>
            </tr>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.map(schedule => (
              <tr key={schedule._id}>
                <td>{schedule.group?.name || '-'}</td>
                <td>{schedule.subject?.name || '-'}</td>
                <td>{schedule.teacher?.name || '-'}</td>
                <td>{schedule.time || '-'}</td>
                <td>{schedule.room || '-'}</td>
                <td className="actions-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(schedule)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(schedule._id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-message">Нет данных о расписании</td>
            </tr>
          )}
        </tbody>
      </table>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setScheduleToEdit(null);
        }}
        refreshSchedules={getSchedules}
        scheduleToEdit={scheduleToEdit}
        groups={groups}
        subjects={subjects}
        teachers={teachers}
      />
    </div>
  );
};

export default Schedule;