import Card from '../components/Card';
import { Item } from '../App';

type HomeProps = {
  items: Item[];
  searchValue: string;
  setSearchValue: (value: React.SetStateAction<string>) => void;
  onChangeSearchInput: (event: any) => void;
  onAddToFavorite: (obj: Item) => Promise<void>;
  onAddToCart: (obj: Item) => Promise<void>;
  isLoading: boolean;
};

const Home = ({
  items,
  searchValue,
  isLoading,
  setSearchValue,
  onChangeSearchInput,
  onAddToFavorite,
  onAddToCart,
}: HomeProps) => {
  const renderItems = () => {
    const filtredItems = items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return (isLoading ? [...Array(12)] : filtredItems).map((item, index) => (
      <Card
        key={index}
        loading={isLoading}
        onFavorite={(obj) => onAddToFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        {...item}
      />
    ));
  };
  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
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

      <div className="wrapperCard">{renderItems()}</div>
    </div>
  );
};

export default Home;
