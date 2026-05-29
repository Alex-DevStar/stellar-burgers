import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import {
  clearConstructor,
  getConstructorBun,
  getConstructorIngredients
} from '../../features/burger-constructor/burger-constructorSlice';
import {
  cleanOrderResponse,
  getOrderRequest,
  getOrderResponse
} from '../../features/order/orderSlice';
import { useDispatch } from '../../services/store';
import { fetchOrder } from '../../features/order/orderSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();

  const ingredients = useSelector(getConstructorIngredients);

  const constructorItems = {
    bun: useSelector(getConstructorBun),
    ingredients
  };
  const ingredientsIds = constructorItems.ingredients.map(
    (ingredient) => ingredient._id
  );

  const orderRequest = useSelector(getOrderRequest);

  const orderModalData = useSelector(getOrderResponse);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    const orderData = [
      constructorItems.bun._id,
      ...ingredientsIds,
      constructorItems.bun._id
    ];
    dispatch(fetchOrder(orderData));
  };
  const closeOrderModal = () => {
    dispatch(cleanOrderResponse());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price, // Пока используем TIngredient, позже  перейти на TConstructorIngredient
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
