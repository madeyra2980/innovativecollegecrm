import GroupModel from "../models/groupModel.js";
import StudentModel from "../models/studentModel.js";

class GroupController {
    // Создание группы
    static async PostGroup(req, res) {
        try {
            const { name, students } = req.body;

            // Проверяем, существует ли уже группа с таким именем
            const existingGroup = await GroupModel.findOne({ name });
            if (existingGroup) {
                return res.status(400).json({ message: "Группа с таким именем уже существует" });
            }

            // Проверяем, существуют ли все студенты
            const validStudents = await StudentModel.find({ _id: { $in: students } });
            if (validStudents.length !== students.length) {
                return res.status(400).json({ message: "Некоторые студенты не найдены" });
            }

            // Создаем новую группу
            const newGroup = new GroupModel({ name, students });
            await newGroup.save();

            res.status(201).json({ message: "Группа успешно создана", group: newGroup });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // Получение всех групп
    static async getGroups(req, res) {
        try {
            const groups = await GroupModel.find().populate("students", "name iin");
            res.status(200).json(groups);
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // Получение группы по ID
    static async getGroupById(req, res) {
        try {
            const { id } = req.params;
            const group = await GroupModel.findById(id).populate("students", "name iin");

            if (!group) {
                return res.status(404).json({ message: "Группа не найдена" });
            }

            res.status(200).json(group);
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // Обновление группы
    static async updateGroup(req, res) {
        try {
            const { id } = req.params;
            const { name, students } = req.body;

            // Проверяем, существуют ли все студенты
            const validStudents = await StudentModel.find({ _id: { $in: students } });
            if (validStudents.length !== students.length) {
                return res.status(400).json({ message: "Некоторые студенты не найдены" });
            }

            const updatedGroup = await GroupModel.findByIdAndUpdate(
                id,
                { name, students },
                { new: true }
            );

            if (!updatedGroup) {
                return res.status(404).json({ message: "Группа не найдена" });
            }

            res.status(200).json({ message: "Группа обновлена", group: updatedGroup });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }

    // Удаление группы
    static async deleteGroup(req, res) {
        try {
            const { id } = req.params;
            const group = await GroupModel.findById(id);

            if (!group) {
                return res.status(404).json({ message: "Группа не найдена" });
            }

            await group.remove();
            res.status(200).json({ message: "Группа удалена" });
        } catch (err) {
            res.status(500).json({ message: "Ошибка сервера", error: err.message });
        }
    }
}

export default GroupController;
