import React from 'react';
import { AppContext } from '../../App';
import ContentLoader from 'react-content-loader';
import styles from './Card.module.scss';

function Card({ onFavorite, id, imageUrl, title, price, onPlus, favorited, loading = false }) {
  const { isItemAdded, isItemFavorite } = React.useContext(AppContext);
  const [isFavorite, setIsFavorite] = React.useState(favorited);

  const onClickPlus = () => {
    onPlus({ id, title, imageUrl, price });
  };

  const onClickFavorite = () => {
    onFavorite({ id, title, imageUrl, price });
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={150}
          height={187}
          viewBox="0 0 150 187"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb">
          <rect x="0" y="1" rx="10" ry="10" width="150" height="90" />
          <rect x="0" y="125" rx="3" ry="3" width="90" height="15" />
          <rect x="0" y="155" rx="8" ry="8" width="80" height="25" />
          <rect x="110" y="150" rx="8" ry="8" width="32" height="32" />
          <rect x="0" y="105" rx="3" ry="3" width="150" height="15" />
        </ContentLoader>
      ) : (
        <>
          <div className={styles.favorite}>
            {onFavorite && (
              <img
                src={isItemFavorite(id) ? 'img/heart-liked.svg' : 'img/heart-unliked.svg'}
                alt="Unliked"
                onClick={onClickFavorite}
              />
            )}
          </div>
          <img width="100%" height={135} src={imageUrl} alt="Sneakers"></img>
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price}</b>
            </div>
            {onPlus && (
              <img
                className={styles.plus}
                src={isItemAdded(id) ? 'img/btn-checked.svg' : 'img/btn-plus.svg'}
                alt="Plus"
                onClick={onClickPlus}></img>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Card;
