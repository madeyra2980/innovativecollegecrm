import SubjectModel from "../models/subjectModel.js";

class SubjectController {
    // ✅ Добавить предмет
    static async createSubject(req, res) {
        try {
            const { name } = req.body;

            const existingSubject = await SubjectModel.findOne({ name });
            if (existingSubject) {
                return res.status(400).json({ message: "Предмет с таким именем уже существует" });
            }

            const newSubject = new SubjectModel({ name });
            await newSubject.save();

            res.status(201).json({ message: "Предмет успешно добавлен", subject: newSubject });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить все предметы
    static async getSubjects(req, res) {
        try {
            const subjects = await SubjectModel.find();
            res.status(200).json({ subjects });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Получить предмет по ID
    static async getSubjectById(req, res) {
        try {
            const { id } = req.params;
            const subject = await SubjectModel.findById(id);

            if (!subject) {
                return res.status(404).json({ message: "Предмет не найден" });
            }

            res.status(200).json({ subject });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // ✅ Обновить предмет по ID
    static async updateSubject(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedSubject = await SubjectModel.findByIdAndUpdate(
                id,
                { name },
                { new: true }
            );

            if (!updatedSubject) {
                return res.status(404).json({ message: "Предмет не найден" });
            }

            res.status(200).json({ message: "Предмет обновлен", subject: updatedSubject });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    static async deleteSubject(req, res) {
        try {
            const { id } = req.params;
            const subject = await SubjectModel.findByIdAndDelete(id);

            if (!subject) {
                return res.status(404).json({ message: "Предмет не найден" });
            }

            res.status(200).json({ message: "Предмет удален" });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }
}

export default SubjectController;
