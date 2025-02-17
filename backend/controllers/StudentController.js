import StudentModel from '../models/studentModel.js';
import GroupModel from '../models/groupModel.js';

class StudentController { 
    static async postStudent(req, res) {
        try {
            const { name, iin } = req.body;
            
            const existingStudent = await StudentModel.findOne({ iin });
            if (existingStudent) {
                return res.status(400).json({ message: 'Студент с таким ИИН уже существует' });
            }
            
            const newStudent = new StudentModel({ name, iin });
            await newStudent.save();
            
            res.status(201).json({ message: 'Студент успешно добавлен', student: newStudent });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    static async postStudentGroup(req, res) {
        try {
            const { studentId, groupId } = req.body;
            
            const group = await GroupModel.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Группа не найдена' });
            }
            
            const student = await StudentModel.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Студент не найден' });
            }
            
            if (student.group && student.group.toString() === groupId) {
                return res.status(400).json({ message: 'Студент уже состоит в этой группе' });
            }
            
            student.group = groupId;
            await student.save();
            
            if (!group.students.includes(studentId)) {
                group.students.push(studentId);
                await group.save();
            }
            
            res.status(200).json({ message: 'Студент добавлен в группу', student, group });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    static async getStudents(req, res) {
        try {
            const students = await StudentModel.find();
            res.status(200).json({ students });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    static async getStudentById(req, res) {
        try {
            const { id } = req.params;
            const student = await StudentModel.findById(id);
            if (!student) {
                return res.status(404).json({ message: 'Студент не найден' });
            }
            res.status(200).json({ student });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }

    static async deleteStudent(req, res) {
        try {
            const { id } = req.params;
            const student = await StudentModel.findById(id);
            if (!student) {
                return res.status(404).json({ message: 'Студент не найден' });
            }

            if (student.group) {
                const group = await GroupModel.findById(student.group);
                if (group) {
                    group.students = group.students.filter(studentId => studentId.toString() !== id);
                    await group.save();
                }
            }

            await student.deleteOne();
            res.status(200).json({ message: 'Студент удален' });
        } catch (err) {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }
}

export default StudentController;
