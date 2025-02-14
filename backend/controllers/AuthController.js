import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import  Admin  from "../models/adminModel.js";

dotenv.config(); 

class Auth {
  static async register(req, res) {
    try {
      const { email, name, surname, secondname, password } = req.body;

      let user = await Admin.findOne({ email });
      if (user) return res.status(400).json({ message: "Email уже зарегистрирован" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

      user = new Admin({
        email,
        password: hashedPassword,
        name,
        surname,
        secondname,
        isVerified: false,
        verificationToken,
      });

      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const verificationLink = `http://localhost:${process.env.PORT}/verify?token=${verificationToken}`;
      await transporter.sendMail({
        from: '"innovative-college" <no-reply@yourapp.com>',
        to: email,
        subject: "Подтвердите вашу почту",
        text: `Нажмите на ссылку для подтверждения: ${verificationLink}`,
      });

      res.status(201).json({ message: "Регистрация успешна! Проверьте email для верификации." });
    } catch (error) {
      res.status(500).json({ message: "Ошибка сервера", error });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;
      if (!token) return res.status(400).json({ message: "Отсутствует токен" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await Admin.findOne({ email: decoded.email });

      if (!user) return res.status(400).json({ message: "Пользователь не найден" });
      if (user.isVerified) return res.status(400).json({ message: "Email уже подтверждён" });

      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      res.json({ message: "Email подтверждён успешно!" });
    } catch (error) {
      res.status(400).json({ message: "Неверный или просроченный токен", error });
    }
  }
  
    static async login(req, res) {
      try {
        const { email, password } = req.body;
  
        const user = await Admin.findOne({ email });
        if (!user) return res.status(400).json({ message: "Пользователь не найден" });
  
        if (!user.isVerified) return res.status(400).json({ message: "Email не подтверждён" });
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });
  
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  
        res.json({ message: "Вход успешен", token, user: {
           email: user.email,
           name: user.name, 
           surname: user.surname,  
           secondname: user.secondname
          }});
      } catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
      }
    }
}

export default Auth;
