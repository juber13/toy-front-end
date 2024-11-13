import Loading from './Loading/Loading'
import { ShowVendorOrder } from '../types/VendorOrder';
import { RootState } from '../redux/store'
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromHomeCart } from '../redux/slices/homeCartSlice';
import { CiTrash } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { IToy } from '../types/School';
import { removeItemFromStockCart } from '../redux/slices/stockCartSlice';

const CartItems: React.FC<{ currentCart: string }> = ({ currentCart }) => {
  const vendorCartItems: ShowVendorOrder[] = useSelector((state: RootState) =>currentCart === "Home"? state.home.homeCartItems: state.stock.stockCartItems
  );
  
  const [selectedToy, setSelectedToy] = useState<{ toy: IToy; } | null>(null);
  const [showModel, setShowModel] = useState<boolean>(false);
  const dispatch = useDispatch();

  const showToyDetails = (e: React.MouseEvent<HTMLTableRowElement>, toy: IToy,) => {
    const target = e.target as HTMLButtonElement;
    if (target.id !== "trash-btn") {
      setSelectedToy({ toy });
      setShowModel(true);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key == "Escape") {
        setShowModel(false);
      }
    }

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  return (
    <Loading>
      <div className='item-details flex flex-col items-center gap-3  flex-1'>
        <table className='p-4 w-full text-sm'>
          <thead>
            <tr className='border p-3 font-[400]'>
              <th className='p-3 font-[600] border'>Name</th>
              <th className='p-3 font-[600] border'>Brand</th>
              <th className='p-3 font-[600] border'>SubBrand</th>
              <th className='p-3 font-[600] border'>Price</th>
              <th className='p-3 font-[600] border'>Remove</th>
            </tr>
          </thead>
          <tbody>
            {vendorCartItems?.map((item) => {
              return (
                <tr
                  key={item.toy.id}
                  className={`border text-center text-xs cursor-pointer `}
                  onClick={(e) => showToyDetails(e, item.toy)}
                >
                  <td className='border p-2'>{item.toy.name ? item.toy.name : "Not Provided"}</td>
                  <td className='border p-2'>{item.toy.brand}</td>
                  <td className='border p-2'>{item.toy.subBrand}</td>
                  <td className='border p-2'>{item.toy.price}</td>
                  <td
                    className='text-center flex items-center justify-center mt-2'
                    id='trash-btn'
                  >
                    <CiTrash
                      className='cursor-pointer text-lg text-red-400'
                      onClick={() =>
                        currentCart == "Home"
                          ? dispatch(removeItemFromHomeCart(item.toy.id ?? ""))
                          : dispatch(removeItemFromStockCart(item.toy.id ?? ""))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* model */}
      <div
        className={`fixed bg-[rgba(0,0,0,0.6)] z-10 inset-0 p-3 flex items-center justify-center gap-2 ${
          showModel ? "block" : "hidden"
        }`}
        onClick={() => setShowModel(false)}
      >
        <div
          className='max-w-5xl h-auto border rounded-md relative'
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className='absolute right-2 top-2 border p-1 cursor-pointer rounded-md text-xs'
            onClick={() => setShowModel(false)}
          >
            Close
          </div>
          <div
            className='single-toy border rounded-md shadow-md sm:w-[500px] p-8 bg-white h-auto'
            key={selectedToy?.toy?.id}
          >
            <h1 className='font-[400] text-2xl text-center mb-3'>
              {selectedToy?.toy?.name}
            </h1>
            <div className='flex flex-col gap-2 p-2'>
              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  Price:{" "}
                  <span className='font-[300]'>{selectedToy?.toy?.price}</span>
                </strong>
                <strong className='text-[16px] font-semibold'>
                  Category:{" "}
                  <span className='font-[300]'>
                    {selectedToy?.toy?.category}
                  </span>
                </strong>
              </p>
              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  Brand:{" "}
                  <span className='font-[300]'>{selectedToy?.toy?.brand}</span>
                </strong>
                <strong className='text-[16px] font-semibold'>
                  Level:{" "}
                  <span className='font-[300] text-sm'>
                    {selectedToy?.toy?.level ?? "Not Provided"}
                  </span>
                </strong>
              </p>
              <hr />
              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  Learn:{" "}
                  <span className='font-[300]'>
                    {selectedToy?.toy?.learn?.length !== 0
                      ? selectedToy?.toy?.learn?.join(", ")
                      : "Not Provided"}
                  </span>
                </strong>
              </p>
              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  SubBrand:{" "}
                  <span className='font-[300]'>
                    {selectedToy?.toy?.subBrand}
                  </span>
                </strong>

                <strong className='text-[16px] font-semibold'>
                  cataloguePageNumber:{" "}
                  <span className='font-[300]'>
                    {selectedToy?.toy?.cataloguePgNo}
                  </span>
                </strong>
              </p>

              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  CodeName:{" "}
                  <span className='font-[300]'>
                    {selectedToy?.toy?.codeName}
                  </span>
                </strong>
              </p>

              <p className='font-[300] flex justify-between items-center'>
                <strong className='text-[16px] font-semibold'>
                  ID: <span className='font-[300]'>{selectedToy?.toy?.id}</span>
                </strong>
              </p>
            </div>
            <div className='w-[95%] m-auto flex items-center gap-2 justify-between pt-2 text-xs'>
              {selectedToy?.toy?.link &&
                selectedToy?.toy?.link !== "Not Provided" && (
                  <a
                    href={selectedToy?.toy?.link}
                    className='text-blue-400 border p-2 rounded-md hover:bg-gray-200 font-medium'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Video Link 
                  </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

export default CartItems;