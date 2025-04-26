import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Контакты</h3>
          <address className="footer-address">
            <p>071400, Казахстан, г. Семей</p>
            <p>ул. Джамбула, 20</p>
          </address>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Телефоны</h3>
          <ul className="footer-contacts">
            <li>Тел.: <a href="tel:+77222445618">(7222) 44-56-18</a></li>
            <li>Тел./факс: <a href="tel:+77222304020">(7222) 30-40-20</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">Электронная почта</h3>
          <p>
            <a href="mailto:semey@innovativecollege.kz" className="footer-email">
              semey@innovativecollege.kz
            </a>
          </p>
        </div>

        <div className="footer-column">
          <h3 className="footer-title">International</h3>
          <address className="footer-address">
            <p>071400, Semey, Kazakhstan</p>
            <p>20 Dzhambula str.</p>
          </address>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Innovative College. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;