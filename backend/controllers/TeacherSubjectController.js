import teacherSubject from "../models/teacherSubject";

class TeacherSubjectController { 
    static async TeacherSubjectPost(req, res) { 
        try {
            const { name, iin, subjects } = req.body;

            const existingTeacher = await teacherSubject.findOne({ name });
            if (existingTeacher) {
                return res.status(400).json({ message: "Учитель уже существует" });
            }

            const newTeacher = new teacherSubject({ name, iin, subjects });

            await newTeacher.save();
            res.status(201).json({ message: "Учитель успешно добавлен", teacher: newTeacher });

        } catch (error) {
            console.error("Ошибка при добавлении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера", error });
        }
    }

    static async TeacherSubjectGet(req, res) { 
        try {
            const teachers = await teacherSubject.find(); 
            res.json(teachers);
        } catch (error) {
            console.error("Ошибка при получении списка учителей:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherSubjectUpdateById(req, res) { 
        try {
            const { id } = req.params;
            const { name, iin, subjects } = req.body;

            const updatedTeacher = await teacherSubject.findByIdAndUpdate(
                id,
                { name, iin, subjects },
                { new: true }
            );

            if (!updatedTeacher) {
                return res.status(404).json({ message: "Учитель не найден" });
            }

            res.json({ message: "Учитель обновлён", teacher: updatedTeacher });

        } catch (error) {
            console.error("Ошибка при обновлении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherSubjectUpdateByName(req, res) { 
        try {
            const { name } = req.params;
            const { iin, subjects } = req.body;

            const updatedTeacher = await teacherSubject.findOneAndUpdate(
                { name },
                { iin, subjects },
                { new: true }
            );

            if (!updatedTeacher) {
                return res.status(404).json({ message: "Учитель не найден" });
            }

            res.json({ message: "Учитель обновлён", teacher: updatedTeacher });

        } catch (error) {
            console.error("Ошибка при обновлении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherSubjectDeleteById(req, res) { 
        try {
            const { id } = req.params;

            const deletedTeacher = await teacherSubject.findByIdAndDelete(id);
            if (!deletedTeacher) {
                return res.status(404).json({ message: "Учитель не найден" });
            }

            res.json({ message: "Учитель удалён успешно" });

        } catch (error) {
            console.error("Ошибка при удалении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherSubjectDeleteByName(req, res) { 
        try {
            const { name } = req.params;

            const deletedTeacher = await teacherSubject.findOneAndDelete({ name });
            if (!deletedTeacher) {
                return res.status(404).json({ message: "Учитель не найден" });
            }

            res.json({ message: "Учитель удалён успешно" });

        } catch (error) {
            console.error("Ошибка при удалении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }
}

export default TeacherSubjectController;
