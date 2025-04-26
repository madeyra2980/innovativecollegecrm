import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import Student from './components/Students/Student';
import Group from './components/Group';
import Schedule from './components/Schedule';
import Subject from './components/Subject';
import Teacher from './components/Teacher';
import logo from './assets/logo.png';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-container">
          <div className="logo-container">
            <img src={logo} alt="Логотип учебного заведения" className="logo-img" />
            <span className="logo-text">Учебный портал</span>
          </div>
          
          <nav className="main-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/addstudent" className="nav-link">Студенты</Link>
              </li>
              <li className="nav-item">
                <Link to="/addgroup" className="nav-link">Группы</Link>
              </li>
              <li className="nav-item">
                <Link to="/addsubject" className="nav-link">Предметы</Link>
              </li>
              <li className="nav-item">
                <Link to="/addteacher" className="nav-link">Преподаватели</Link>
              </li>
              <li className="nav-item">
                <Link to="/addschedule" className="nav-link">Расписание</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/addstudent" element={<Student/>} />
          <Route path="/addgroup" element={<Group />} />
          <Route path="/addsubject" element={<Subject />} />
          <Route path="/addteacher" element={<Teacher />} />
          <Route path="/addschedule" element={<Schedule />} />
        </Routes>
      </main>

      <Footer/>
    </div>
  );
}

export default App;