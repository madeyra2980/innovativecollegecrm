import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
const User = require("../models/adminModel");

class Auth {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Проверяем, существует ли пользователь
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Неверный email или пароль" });

      // Проверяем верификацию
      if (!user.isVerified) return res.status(400).json({ message: "Подтвердите email" });

      // Проверяем пароль
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Неверный email или пароль" });

      // Генерируем токен
      const authToken = jwt.sign({ id: user._id }, "your-secret-key", { expiresIn: "1d" });

      res.json({ message: "Успешный вход", token: authToken });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  }
}

module.exports = Auth;
