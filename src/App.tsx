import React from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Header from './components/Header';
import Drawer from './components/Drawer';

import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

export type Item = {
  id: number;
  title: string;
  imageUrl: string;
  price: string;
};
export type GlobalContext = {
  items: Item[];
  cartItems: Item[];
  isItemAdded: (id: number) => boolean;
  isItemFavorite: (id: number) => boolean;
  setCartOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setCartItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export const AppContext = React.createContext<GlobalContext>({
  items: [],
  cartItems: [],
  isItemAdded: (id) => false,
  isItemFavorite: (id) => false,
  setCartOpened: (value: React.SetStateAction<boolean>) => false,
  setCartItems: (value: React.SetStateAction<Item[]>) => [],
});

function App() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [cartItems, setCartItems] = React.useState<Item[]>([]);
  const [favorites, setFavorites] = React.useState<Item[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [cartOpened, setCartOpened] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [cartRespones, favoritesRespones, itemsRespones] = await Promise.all([
          axios.get('https://json-server-rxer.onrender.com/cart'),
          axios.get('https://json-server-rxer.onrender.com/favorites'),
          axios.get('https://json-server-rxer.onrender.com/items'),
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

  const onAddToCart = async (obj: Item) => {
    try {
      if (cartItems.find((favObj: Item) => favObj.id === obj.id)) {
        setCartItems((prev) => prev.filter((item: Item) => item.id !== obj.id));
        await axios.delete(`https://json-server-delta-sable.vercel.app/api/cart/${obj.id}`);
      } else {
        setCartItems((prev) => [...prev, obj]);
        await axios.post('https://json-server-delta-sable.vercel.app/api/cart', obj);
      }
    } catch (error) {
      alert('Не удалось добавить товар в корзину');
      console.error(error);
    }
  };

  const onRemoveItem = async (id: number) => {
    try {
      setCartItems((prev) => prev.filter((item: Item) => item.id !== id));
      await axios.delete(`https://json-server-delta-sable.vercel.app/api/cart/${id}`);
    } catch (error) {
      alert('Не удалось удалить товар из корзины!');
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj: Item) => {
    try {
      if (favorites.find((favObj: Item) => favObj.id === obj.id)) {
        setFavorites((prev) => prev.filter((item: Item) => item.id !== obj.id));
        await axios.delete(`https://json-server-rxer.onrender.com/favorites/${obj.id}`);
      } else {
        setFavorites((prev) => [...prev, obj]);
        await axios.post(`https://json-server-rxer.onrender.com/favorites`, obj);
      }
    } catch (error) {
      alert('Не удалост добавить в закладки');
      console.error(error);
    }
  };

  const onChangeSearchInput = (event: any) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id: number) => {
    return cartItems.some((obj: Item) => obj.id === id);
  };

  const isItemFavorite = (id: number) => {
    return favorites.some((obj: Item) => obj.id === id);
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
