import { FC, useEffect, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  clearConstructor,
  getConstructorBun,
  getConstructorIngredients
} from '../../features/burger-constructor/burger-constructorSlice';
import {
  cleanOrderResponse,
  getOrderRequest,
  getOrderResponse,
  fetchOrder
} from '../../features/order/orderSlice';
import { useDispatch } from '../../services/store';
import { getIsAuthenticated } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ingredients = useSelector(getConstructorIngredients);
  const bun = useSelector(getConstructorBun);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderResponse);
  const isAuth = useSelector(getIsAuthenticated);

  useEffect(() => {
  if (orderModalData) {
    dispatch(clearConstructor());
  }
}, [orderModalData, dispatch]);

  const constructorItems = {
    bun,
    ingredients
  };

  const ingredientsIds = constructorItems.ingredients.map(
    (ingredient) => ingredient._id
  );

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

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
};

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

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
