import React, { createContext, useState, useContext, useEffect } from 'react';

// Создание контекста
const DateContext = createContext();


// Провайдер контекста
export const DateProvider = ({ children }) => {
    const [schedules, setSchedules] = useState([]); // Переименовываем dates в schedules
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/schedules/");
                if (!response.ok) {
                    throw new Error("Ошибка при загрузке данных");
                }
                const data = await response.json();
                setSchedules(data.schedules || []); // Используем data.schedules вместо data.dates
            } catch (err) {
                setError(err.message);
                setSchedules([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DateContext.Provider value={{ 
            selectedDate, 
            setSelectedDate,
            schedules, // Переименовываем dates в schedules
            loading, 
            error
        }}>
            {children}
        </DateContext.Provider>
    );
};

// Хук для использования контекста в компонентах
export const useDate = () => useContext(DateContext);
