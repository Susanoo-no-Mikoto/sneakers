import React from 'react';
import { Link } from 'react-router-dom';

import { useCart } from '../hooks/useCart';

function Header(props) {
  const { totalPrice } = useCart();

  return (
    <header className="d-flex justify-between align-center p-45">
      <Link to="/">
        <div className="d-flex align-center">
          <img width={40} height={40} src="/img/logo.png" alt="Logotype" />
          <div>
            <h3 className="text-uppercase">React Sneakers</h3>
            <p className="opacity-5">Магазин лучших кросовок</p>
          </div>
        </div>
      </Link>
      <ul className="d-flex">
        <li className="mr-30 cu-p" onClick={props.onClickCart}>
          <img width={18} height={18} className="mr-15 mt-10" src="/img/cart.svg" alt="Cart" />
          <span>{totalPrice} руб.</span>
        </li>
        <li className="cu-p mr-30 mt-10">
          <Link to="/favorites">
            <img width={18} height={18} src="/img/favorites.svg" alt="Favorites" />
          </Link>
        </li>
        <li className="cu-p mr-30 mt-10">
          <Link to="/orders">
            <img width={18} height={18} src="/img/user.svg" alt="User" />
          </Link>
        </li>
      </ul>
    </header>
  );
}

export default Header;
