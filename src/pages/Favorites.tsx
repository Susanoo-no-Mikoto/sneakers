import Card from '../components/Card';
import { Item } from '../App';

type FavoritesProps = {
  favorites: Item[];
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  onChangeSearchInput: (event: any) => void;
  onAddToCart: (obj: Item) => Promise<void>;
  onAddToFavorite: (obj: Item) => Promise<void>;
};

const Favorites = ({
  favorites,
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart,
  onAddToFavorite,
}: FavoritesProps) => {
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Мои закладки'}</h1>
        <div className="search-block d-flex">
          <img src="img/search.svg" alt="Search" />
          {searchValue && (
            <img
              onClick={() => setSearchValue('')}
              className="clear cu-p"
              src="img/btn-remove.svg"
              alt="Clear"
            />
          )}
          <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
        </div>
      </div>

      <div className="wrapperCard">
        {favorites
          .filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
          .map((item, index) => (
            <Card
              key={index}
              onFavorite={(obj) => onAddToFavorite(obj)}
              onPlus={(obj) => onAddToCart(obj)}
              favorited
              {...item}
            />
          ))}
      </div>
    </div>
  );
};

export default Favorites;
