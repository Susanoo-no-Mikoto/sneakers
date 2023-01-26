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

  React.useEffect(() => {
    (async () => {
      try {
        const [cartRespones, favoritesRespones, itemsRespones] = await Promise.all([
          axios.get('http://localhost:3001/cart'),
          axios.get('http://localhost:3001/favorites'),
          axios.get('http://localhost:3001/items'),
        ]);

        setIsLoading(false);

        setCartItems(cartRespones.data);
        setFavorites(favoritesRespones.data);
        setItems(itemsRespones.data);
      } catch (error) {
        alert('Ошибка загрузки данных');
        console.error(error);
      }
    })();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      if (cartItems.find((favObj) => favObj.id === obj.id)) {
        setCartItems((prev) => prev.filter((item) => item.id !== obj.id));
        await axios.delete(`http://localhost:3001/cart/${obj.id}`);
      } else {
        setCartItems((prev) => [...prev, obj]);
        await axios.post('http://localhost:3001/cart', obj);
      }
    } catch (error) {
      alert('Не удалось добавить товар в корзину');
      console.error(error);
    }
  };

  const onRemoveItem = async (id) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      await axios.delete(`http://localhost:3001/cart/${id}`);
    } catch (error) {
      alert('Не удалось удалить товар из корзины!');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
        await axios.delete(`http://localhost:3001/favorites/${obj.id}`);
      } else {
        setFavorites((prev) => [...prev, obj]);
        await axios.post(`http://localhost:3001/favorites`, obj);
      }
    } catch (error) {
      alert('Не удалост добавить в закладки');
      console.error(error);
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
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

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

          <Route path="/orders" element={<Orders isLoading={isLoading} />}></Route>
        </Routes>
      </div>
    </AppContext.Provider>
  );
}

export default App;
