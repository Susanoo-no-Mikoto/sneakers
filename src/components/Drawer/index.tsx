import React, { MouseEventHandler } from 'react';
import axios from 'axios';

import Info from '../Info';
import { useCart } from '../../hooks/useCart';
import { Item } from '../../App';

import styles from './Drawer.module.scss';

type DrawerProps = {
  onClose: MouseEventHandler;
  items: Item[];
  onRemove: (id: number) => Promise<void>;
  opened: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Drawer: React.FC<DrawerProps> = ({ onClose, items = [], onRemove, opened }) => {
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState<number[]>();
  const [isOrderComplite, setIsOrderComplite] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onClickOrder = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post('https://json-server-delta-sable.vercel.app/api/orders', {
        items: cartItems,
      });
      setOrderId(data.id);
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        await axios.delete(`https://json-server-delta-sable.vercel.app/api/cart/${item.id}`);
        await delay(700);
      }

      setIsOrderComplite(true);
      setCartItems([]);
    } catch (error) {
      alert('Не удалось создать заказ!');
      console.error(error);
    }
    setIsLoading(false);
  };

  const scrollController = {
    disabledScroll() {
      document.body.style.cssText = 'overflow: hidden';
    },
    enableScroll() {
      document.body.style.cssText = 'overflow: auto';
    },
  };

  return (
    <div
      className={`${styles.overlay} ${opened ? styles.overlayVisible : ''} ${
        opened ? scrollController.disabledScroll() : scrollController.enableScroll()
      }`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Корзина <img onClick={onClose} className="cu-p" src="img/btn-remove.svg" alt="Close" />
        </h2>
        {items.length > 0 ? (
          <div className={styles.wrapperItems}>
            <div className={styles.items}>
              {items.map((obj) => (
                <div key={obj.id} className={styles.cartItem}>
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className={styles.cartItemImg}></div>
                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} руб.</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className={styles.removeBtn}
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className={styles.cartTotalBlock}>
              <ul>
                <li>
                  <span>Итого:</span>
                  <div></div>
                  <b>{totalPrice} руб. </b>
                </li>
                <li>
                  <span>Налог 5%:</span>
                  <div></div>
                  <b>{Math.round(totalPrice * 0.05)} руб. </b>
                </li>
              </ul>
              <button disabled={isLoading} onClick={onClickOrder} className={styles.greenButton}>
                Оформить заказ
                <img src="img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </div>
        ) : (
          <Info
            title={isOrderComplite ? 'Заказ оформлен!' : 'Корзина пустая'}
            description={
              isOrderComplite
                ? `Ваш заказ #${orderId} скоро будет передан курьерской доставке`
                : 'Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ.'
            }
            image={isOrderComplite ? 'img/complete-order.svg' : 'img/empty-cart.png'}
          />
        )}
      </div>
    </div>
  );
};

export default Drawer;
