import ScheduleModel from "../models/schedule.js";

class ScheduleController {
    // ✅ Добавить новое расписание
    static async createSchedule(req, res) {
        try {
            const { date, group, subject, teacher, time, room } = req.body;
 
            const newSchedule = new ScheduleModel({
                date,
                group,
                subject,
                teacher,
                time,
                room
            });

            await newSchedule.save();
            res.status(201).json({ message: "Расписание добавлено", schedule: newSchedule });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить все записи расписания
    static async getSchedules(req, res) {
        try {
            const schedules = await ScheduleModel.find()
                .populate("group", "name")
                .populate("subject", "name")
                .populate("teacher", "name");

            res.status(200).json({ schedules });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить расписание по ID
    static async getScheduleById(req, res) {
        try {
            const { id } = req.params;
            const schedule = await ScheduleModel.findById(id)
                .populate("group", "name")
                .populate("subject", "name")
                .populate("teacher", "name");

            if (!schedule) {
                return res.status(404).json({ message: "Расписание не найдено" });
            }

            res.status(200).json({ schedule });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Обновить расписание
    static async updateSchedule(req, res) {
        try {
            const { id } = req.params;
            const { date, group, subject, teacher, time, room } = req.body;

            const updatedSchedule = await ScheduleModel.findByIdAndUpdate(
                id,
                { date, group, subject, teacher, time, room },
                { new: true }
            );

            if (!updatedSchedule) {
                return res.status(404).json({ message: "Расписание не найдено" });
            }

            res.status(200).json({ message: "Расписание обновлено", schedule: updatedSchedule });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Удалить расписание
    static async deleteSchedule(req, res) {
        try {
            const { id } = req.params;
            const schedule = await ScheduleModel.findByIdAndDelete(id);

            if (!schedule) {
                return res.status(404).json({ message: "Расписание не найдено" });
            }

            res.status(200).json({ message: "Расписание удалено" });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }
}

export default ScheduleController;
