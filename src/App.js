import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

export const AppContext = React.createContext({});

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    async function fethData() {
      const cartRespones = await axios.get('http://localhost:3001/cart');
      const favoritesRespones = await axios.get('http://localhost:3001/favorites');
      const itemsRespones = await axios.get('http://localhost:3001/items');
      const dataOrders = await axios.get('http://localhost:3001/orders');

      setIsLoading(false);

      setCartItems(cartRespones.data);
      setFavorites(favoritesRespones.data);
      setOrders(dataOrders.data);
      setItems(itemsRespones.data);
    }
    fethData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      if (cartItems.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`http://localhost:3001/cart/${obj.id}`);
        setCartItems((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post('http://localhost:3001/cart', obj);
        setCartItems((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить товар в корзину');
    }
  };

  const onRemoveItem = (id) => {
    axios.delete(`http://localhost:3001/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(`http://localhost:3001/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post(`http://localhost:3001/favorites`, obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалост добавить в закладки');
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => obj.id === id);
  };

  const isItemFavorite = (id) => {
    return favorites.some((obj) => obj.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        items,
        cartItems,
        isItemAdded,
        isItemFavorite,
        setCartOpened,
        setCartItems,
      }}>
      <div className="wrapper clear">
        {cartOpened && (
          <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} />
        )}
        <Header onClickCart={() => setCartOpened(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
                isLoading={isLoading}
                items={items}
              />
            }></Route>

          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onChangeSearchInput={onChangeSearchInput}
                onAddToFavorite={onAddToFavorite}
                onAddToCart={onAddToCart}
              />
            }></Route>

          <Route path="/orders" element={<Orders orders={orders} />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
