import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {logOut} from '../utils/auth'

function Header({email}) {
  const location = useLocation();
  const navigate = useNavigate();

  function signOut() {
    logOut()
    .then(() => navigate('sign-in'))
    .catch((err) => console.log(err));
  }

  const [mobileEmail, setMobileEmail] = React.useState(false);
  const [mobileLink, setMobileLink] = React.useState(false);

  function handleBurgerClick() {
    setMobileEmail((state) => !state);
    setMobileLink((state) => !state);
  }

  return (
    <header className="header">

      {location.pathname === "/" && <p className={`header__email_mobile  ${mobileEmail ? 'header_mobile_opened' : ''}`}>{email}</p>}
      {location.pathname === "/" && <Link className={`header__link_mobile  ${mobileLink ? 'header_mobile_opened' : ''}`} to='/sign-in' type="button" onClick={signOut}>{'Выйти'}</Link>}
      
      <div className="header__main">
        <div className="header__logo"></div>
        <div className="header__box">
          {location.pathname === "/" && <p className="header__email">{email}</p>}
          {location.pathname === "/" && <Link className="header__link" to='/sign-in' type="button" onClick={signOut}>{'Выйти'}</Link>}
        </div>

        {location.pathname === "/sign-up" && <Link className="header__link header__link_opened" to='/sign-in' type="button">{'Войти'}</Link>}
        {location.pathname === "/sign-in" && <Link className="header__link header__link_opened" to='/sign-up' type="button">{'Регистрация'}</Link>}
        {location.pathname === "/" && <button className='header__burger' type='button' onClick={handleBurgerClick}/>}
      </div>
      
    </header>
  );
}

export default Header;

// Не знаю, как сделать тогл, помогите, пожалуйста!