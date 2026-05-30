import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getIngredients } from '../../features/burger-ingredients/burger-ingredientsSlice';
import { useParams } from 'react-router-dom';
import { fetchFeed, getFeedOrders } from '../../features/feed/feedSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const ingredients: TIngredient[] = useSelector(getIngredients);
  const { number } = useParams();
  const orders = useSelector(getFeedOrders);
  const orderData = orders.find((order) => order.number === Number(number));
  // const orderData = {
  //   createdAt: '',
  //   ingredients: [],
  //   _id: '',
  //   status: '',
  //   name: '',
  //   updatedAt: 'string',
  //   number: 0
  // };

  const dispatch = useDispatch();
  useEffect(() => {
    if (orders.length === 0) dispatch(fetchFeed());
  }, [dispatch, orders.length]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }
  // console.log(orderInfo.number);
  return <OrderInfoUI orderInfo={orderInfo} />;
};
