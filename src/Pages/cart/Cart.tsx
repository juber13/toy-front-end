import { useSelector } from 'react-redux';
import { CiShoppingCart } from "react-icons/ci";
import { RootState } from '../../redux/store';
import Loading from '../../Components/Loading/Loading';
import CartItems from '../../Components/CartItems';
import Calculation from '../../Components/CalculationTotal';
import { useEffect, useState } from 'react';

const Cart: React.FC = () => {
  const [currentCart, setCurrentCart] = useState('Home');
  const homeCartItems = useSelector((state: RootState) => state.home.homeCartItems) || [];
  const stockCartItems = useSelector((state: RootState) => state.stock.stockCartItems) || [];
  const [vendorCartItems, setVendorCartItems] = useState(homeCartItems);
 

  useEffect(() => {  
    if (currentCart === "Home") {
      setVendorCartItems(homeCartItems);
    } else {
      setVendorCartItems(stockCartItems);
    }
  }, [currentCart, homeCartItems, stockCartItems]);

  const handleCartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentCart(e.target.value);
  };

  return (
    <Loading>
    <div className='max-w-7xl m-auto mt-1ca bg-white shadow-xl gap-3 p-4'>
        <div className='flex justify-end w-full mb-4'>
          <select
            value={currentCart}
            onChange={handleCartChange}
            className='border border-gray-300 p-2 rounded-md'
          >
            <option value="Home">Home</option>
            <option value="Stock">Stock</option>
          </select>
        </div>
        <div className='flex gap-10'>
        {
          vendorCartItems.length === 0 ? (
            <div className='w-full flex  calc-height items-center justify-center text-2xl font-[400]'>
              Please add some toys <CiShoppingCart className='mt-2 w-[30px]' />
            </div>
          ) : (
            <>
              <CartItems currentCart={currentCart} />
              <Calculation currentCart={currentCart} />
            </>
          )
        }
        </div>
      </div>
    </Loading>
  );
}

export default Cart;
