import { IToy, Level } from "../types/School";
import { useDispatch, useSelector } from "react-redux";
import { ShowVendorOrder } from "../types/VendorOrder";
import { RootState } from "../redux/store";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { removeItemFromHomeCart, setItemToHomeCart } from "../redux/slices/homeCartSlice";
import { removeItemFromStockCart, setItemToStockCart } from "../redux/slices/stockCartSlice";
import { setBackdrop, setError } from "../redux/slices/statusSlice";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { UPDATE_STOCK } from "../utils/restEndPoints";
import { CiTrash } from "react-icons/ci";


interface MyComponentProps {
  toys: { toy: IToy; quantity?: string }[];
  from: string;
  setToys?: React.Dispatch<React.SetStateAction<{
    toy: IToy;
    quantity: string;
  }[]>>;
  deleteToyFromStock?: (id: string) => Promise<void>
}

const ToyTable: React.FC<MyComponentProps> = ({ toys, from, setToys, deleteToyFromStock }) => {
  const [selectedToy, setSelectedToy] = useState<{ toy: IToy; quantity?: string } | null>(null);
  const [showModel, setShowModel] = useState<boolean>(false);
  const [editQuantity, setEditQuantity] = useState<boolean>(false);
  const [newQuantity, setNewQuantity] = useState<number>();
  const [totalToysQuantity, setTotalToysQuantity] = useState<number>(0);


  const vendorCartItems: ShowVendorOrder[] = useSelector((state: RootState) => from === "Home" ? state.home.homeCartItems : state.stock.stockCartItems);
  const [inputValue, setInputValue] = useState<string>("");
  const [levelValue, setLevelValue] = useState<string>("all");
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  console.log(toys);


  useEffect(() => {
    const totalQuantity = toys.reduce((total, toy) => total + (Number(toy.quantity) || 0), 0);
    setTotalToysQuantity(totalQuantity);
  }, [toys]);

  const handleEdit = () => {
    setEditQuantity(true);
    setNewQuantity(Number(selectedToy?.quantity) || 0);

  };

  const handleQtyUpdate = async () => {
    try {
      dispatch(setBackdrop(true));
      const response = await axiosInstance.post(UPDATE_STOCK, {
        toyId: selectedToy?.toy.id,
        quantity: newQuantity,
      }
      );
      console.log(response.data);
      toast.success(response.data.message);
      setEditQuantity(false);
      if (setToys) {
        setToys(prevList => {
          console.log(prevList.map(toy =>
            toy.toy.id == response.data.stock.toy ? { toy: toy.toy, quantity: response.data.stock.quantity } : toy
          ));
          return prevList.map(toy =>
            toy.toy.id == response.data.stock.toy ? { toy: toy.toy, quantity: response.data.stock.quantity } : toy
          )
        });
        setSelectedToy(prev => prev ? ({ ...prev, quantity: response.data.stock.quantity }) : prev);
      }
    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error,
          })
        );
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setBackdrop(false));
    }
  };



  const addToCart = (toy: IToy | undefined) => {
    if (toy) {
      const isExists = vendorCartItems.find((item) => item.toy.id === toy.id);
      if (!isExists) {
        if (from === 'Home') {
          dispatch(setItemToHomeCart({ toy, quantity: 1 }));
        } else {
          dispatch(setItemToStockCart({ toy, quantity: 1 }));
        }
      }
    }
  };

  const showToyDetails = (e: React.MouseEvent<HTMLTableRowElement>, toy: IToy, quantity?: string) => {
    const target = e.target as HTMLTableCellElement;
    if (target.id !== "trash-btn" && target.id !== "delete-btn") {
      console.log(target)
      console.log("added");
      setSelectedToy({ toy, quantity });
      setShowModel(true);
    }
  };
  const filteredToys = toys?.filter((item) => {
    const matchesInput =
      item.toy.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.toy.brand?.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.toy.subBrand?.toLowerCase().includes(inputValue.toLowerCase());

    const matchesLevel = levelValue.toLowerCase() === "all" || item.toy.level?.toLowerCase() === levelValue.toLowerCase();
    return matchesInput && matchesLevel;
  });

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModel(false);
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);

  return (
    <>
      <div className='filters w-[90%] m-auto mt-4 border p-2 flex gap-2 items-center rounded-md table-toy '>
        <input
          type='text'
          className={`p-2 text-sm flex-1 outline-none placeholder:font-semibold`}
          placeholder='Name , Brand or SubBrand'
          onChange={(e) => setInputValue(e.target.value)}
        />
        <span>Level</span>
        <select
          name='level'
          onChange={(e) => setLevelValue(e.target.value)}
          className='border p-2 text-sm'
        >
          {Object.keys(Level).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {pathname !== "/" && (
          <div
            className={`p-2 border shadow-sm items-center flex text-sm font-semibold justify-center rounded-md ${
              pathname === "/stock" ? "w-fit" : "w-full" // Adjust width for different routes
            }`}
          >
            {toys?.length && `${toys.length} - ${totalToysQuantity}`}
          </div>
        )}
      </div>
      <div className='w-[90%] m-auto flex flex-wrap gap-5 mt-5 pb-10'>
        <table className='p-4 w-full text-sm'>
          <thead>
            <tr className='border p-3 font-[600]'>
              <th className='p-3  border'>Toy Id </th>
              <th className='p-3  border'>Name</th>
              <th className='p-3  border'>Code Name</th>
              <th className='p-3  border'>Brand</th>
              <th className='p-3  border'>SubBrand</th>
              <th className='p-3  border'>Price</th>
              <th className='p-3  border'>Level</th>
              {pathname !== "/" && <th className='p-3 border'>Quantity</th>}
              {deleteToyFromStock && <th className='p-3 border'>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredToys?.map((item) => {
              const isInCart = vendorCartItems.some(
                (cartItem) => cartItem.toy.id === item.toy.id
              );
              return (
                <tr
                  key={item.toy.id}
                  className={`border text-center text-sm cursor-pointer ${
                    isInCart ? "!bg-green-200" : ""
                  }`}
                  onClick={(e) => showToyDetails(e, item.toy, item.quantity)}
                >
                  <td className='border p-2'>{item.toy.id}</td>
                  <td className='border p-2'>{item?.toy?.name || "Not Provided"}</td>
                  <td className='border p-2'>{item.toy.codeName}</td>
                  <td className='border p-2'>{item.toy.brand}</td>
                  <td className='border p-2'>{item.toy.subBrand}</td>
                  <td className='border p-2'>{item.toy.price}</td>
                  <td className='border p-2'>
                    {item.toy.level || "Not Provided"}
                  </td>
                  {pathname !== "/" && (
                    <td className='border p-2'>{item.quantity}</td>
                  )}
                  {deleteToyFromStock && (
                    <td
                      className='p-3 font-[600] flex items-center justify-center'
                      id='trash-btn'
                    >
                      <CiTrash
                        className='text-center text-red-600 '
                        id='delete-btn'
                        onClick={() => deleteToyFromStock(item.toy.id ?? "")}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredToys?.length === 0 && (
          <div className='w-full h-full flex justify-center items-center'>
            <h1 className='text-xl font-semibold'>No Items Found</h1>
          </div>
        )}
      </div>
      {/* Modal */}
      {showModel && (
        <div
          className='fixed bg-[rgba(0,0,0,0.6)] z-10 inset-0 p-3 flex items-center justify-center gap-2'
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
            <div className='single-toy border rounded-md shadow-md sm:w-[500px] p-8 bg-white h-auto'>
              <h1 className='font-[400] text-2xl text-center mb-3'>
                {selectedToy?.toy?.name}
              </h1>
              <div className='flex flex-col gap-2 p-2'>
                <p className='font-[300] flex justify-between items-center'>
                  <strong className='text-[16px] font-semibold'>
                    Price:{" "}
                    <span className='font-[300]'>
                      {selectedToy?.toy?.price}
                    </span>
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
                    <span className='font-[300]'>
                      {selectedToy?.toy?.brand}
                    </span>
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
                      {selectedToy?.toy?.learn?.length
                        ? selectedToy?.toy?.learn.join(", ")
                        : "Not Provided"}
                    </span>
                  </strong>
                </p>
                <p
                  className={`font-[300] flex justify-between ${
                    editQuantity ? "items-start" : "items-center"
                  } `}
                >
                  <strong
                    className={`text-[16px] font-semibold ${selectedToy?.quantity==undefined && "hidden"
                      }`}
                  >
                    Quantity:{" "}
                    <span className='font-[300]'>
                      {editQuantity ? (
                        <>
                          <input
                            type='number'
                            value={newQuantity ?? selectedToy?.quantity ?? ""}
                            onChange={(e) =>
                              setNewQuantity(Number(e.target.value))
                            }
                            className='border p-1 rounded-md w-20'
                          />
                          <br />
                          <button
                            onClick={() => setEditQuantity(false)}
                            className='bg-red-400 text-xs border p-1 rounded-md text-white'
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        selectedToy?.quantity
                      )}
                      <button
                        onClick={editQuantity ? handleQtyUpdate : handleEdit}
                        className='border text-xs bg-green-400 ml-3 mt-3 p-1 rounded-md text-white'
                      >
                        {editQuantity ? "Save" : "updateQty"}
                      </button>
                    </span>
                  </strong>
                  <strong className='text-[16px] font-semibold'>
                    SubBrand:{" "}
                    <span className='font-[300]'>
                      {selectedToy?.toy?.subBrand}
                    </span>
                  </strong>
                </p>
                <p className='font-[300] flex justify-between items-center'>
                  <p className='font-[300] flex justify-between items-center'>
                    <strong className='text-[16px] font-semibold'>
                      CatelougePageNumber:{" "}
                      <span className='font-[300]'>
                        {selectedToy?.toy?.cataloguePgNo}
                      </span>
                    </strong>
                  </p>
                </p>
                <p className='font-[300] flex justify-between items-center'>
                  <strong className='text-[16px] font-semibold'>
                    ID:{" "}
                    <span className='font-[300]'>{selectedToy?.toy?.id}</span>
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
                {vendorCartItems.some(
                  (item) => item.toy.id === selectedToy?.toy?.id
                ) ? (
                  <button
                    onClick={() =>
                      from === "Stock"
                        ? dispatch(
                            removeItemFromStockCart(selectedToy?.toy?.id ?? "")
                          )
                        : dispatch(
                            removeItemFromHomeCart(selectedToy?.toy?.id ?? "")
                          )
                    }
                    className='bg-gray-200 p-2 ml rounded-md w-fit hover:bg-gray-800 hover:text-white font-medium'
                  >
                    Remove From Cart
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(selectedToy?.toy ?? undefined)}
                    className='bg-gray-200 p-2 ml rounded-md w-fit hover:bg-gray-800 hover:text-white font-medium'
                  >
                    Add To Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToyTable;
