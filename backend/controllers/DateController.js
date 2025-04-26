import DateModel from "../models/dateModel.js";

class DateController {
    // ✅ Создать новую дату
    static async createDate(req, res) {
        try {
            const { date, schedule } = req.body;

            if (!date || !schedule) {
                return res.status(400).json({ message: "Все поля обязательны" });
            }

            const newDate = new DateModel({
                date,
                schedule
            });

            await newDate.save();
            res.status(201).json({ message: "Дата создана", date: newDate });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить все даты
    static async getAllDates(req, res) {
        try {
            const dates = await DateModel.find().populate({
                path: "schedule",
                populate: [
                    { path: "group", select: "name" },
                    { path: "subject", select: "name" },
                    { path: "teacher", select: "name" }
                ]
            });
                        res.status(200).json({ dates });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить дату по ID
    static async getDateById(req, res) {
        try {
            const { id } = req.params;
            const date = await DateModel.findById(id).populate("schedule");

            if (!date) {
                return res.status(404).json({ message: "Дата не найдена" });
            }

            res.status(200).json({ date });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Обновить дату по ID
    static async updateDate(req, res) {
        try {
            const { id } = req.params;
            const { date, schedule } = req.body;

            // Проверка наличия всех полей
            if (!date || !schedule) {
                return res.status(400).json({ message: "Все поля обязательны" });
            }

            const updatedDate = await DateModel.findByIdAndUpdate(
                id,
                { date, schedule },
                { new: true }
            ).populate("schedule");

            if (!updatedDate) {
                return res.status(404).json({ message: "Дата не найдена" });
            }

            res.status(200).json({ message: "Дата обновлена", date: updatedDate });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Удалить дату по ID
    static async deleteDate(req, res) {
        try {
            const { id } = req.params;

            const deletedDate = await DateModel.findByIdAndDelete(id);

            if (!deletedDate) {
                return res.status(404).json({ message: "Дата не найдена" });
            }

            res.status(200).json({ message: "Дата удалена" });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }
}

export default DateController;