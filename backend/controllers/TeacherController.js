import teacher from "../models/teacher.js";

class Teacher { 
    static async TeacherPost(req, res) { 
        try {
            const { name, iin,  } = req.body;
            const existingTeacher = await teacher.findOne({ name });
            if (existingTeacher) {
                return res.status(400).json({ message: "Учитель уже существует" });
            }
            const newTeacher = new teacher({ name, iin });
            await newTeacher.save();
            res.status(201).json({ message: "Учитель успешно добавлен", teacher: newTeacher });
        } catch (error) {
            console.error("Ошибка при добавлении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера", error });
        }
    }

    static async TeacherGet(req, res) { 
        try {
            const teachers = await teacher.find(); 
            res.json(teachers);
        } catch (error) {
            console.error("Ошибка при получении списка учителей:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherUpdateById(req, res) { 
        try {
            const { id } = req.params;
            const { name } = req.body;

            const updatedTeacher = await teacher.findByIdAndUpdate(
                id,
                { name, iin },
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

    static async TeacherUpdateByName(req, res) { 
        try {
            const { name } = req.params;
            const { iin } = req.body;

            const updatedTeacher = await teacher.findOneAndUpdate(
                { name },
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

    static async TeacherDeleteById(req, res) { 
        try {
            const { id } = req.params;

            const deletedTeacher = await teacher.findByIdAndDelete(id);
            if (!deletedTeacher) {
                return res.status(404).json({ message: "Учитель не найден" });
            }

            res.json({ message: "Учитель удалён успешно" });

        } catch (error) {
            console.error("Ошибка при удалении учителя:", error);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    static async TeacherDeleteByName(req, res) { 
        try {
            const { name } = req.params;

            const deletedTeacher = await teacher.findOneAndDelete({ name });
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

export default Teacher;
