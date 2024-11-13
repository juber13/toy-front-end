import { useParams } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import { VendorOrder, VendorOrderStatus, VendorOrderStatusInfo } from "../../types/VendorOrder";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  GET_VENDOR_ORDER_BY_ID,
  UPDATE_VENDOR_ORDER,
  STOCK,
  GET_OTHER_PRODUCTS_BY_ORDER_ID,
  ADD_OTHER_PRODUCT_BY_ORDER_ID,
  DELETE_OTHER_PRODUCT_BY_ID,

} from "../../utils/restEndPoints";
import { IOtherProduct } from "../../types/VendorOrder";
import { setError, setBackdrop, setLoading } from "../../redux/slices/statusSlice";
import { useNavigate } from "react-router-dom";
import _ from 'lodash';
import { CiTrash } from "react-icons/ci";


const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [orderDetails, setOrderDetails] = useState<VendorOrder | null>(null);
  const [newStatus, setNewStatus] = useState<VendorOrderStatusInfo>({ timestamps: '', personName: '', contactNumber: '', status: VendorOrderStatus.PENDING });
  const [otherProducts, setOtherProducts] = useState<IOtherProduct[]>([]);
  const [newOtherProduct, setNewOtherProduct] = useState<IOtherProduct>({ item: '', quantity: 0, order: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderRef = useRef<VendorOrder | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(`${GET_VENDOR_ORDER_BY_ID}/${id}`);
      const clonedData = _.cloneDeep(response.data);
      setOrderDetails(response.data);
      orderRef.current = clonedData;
    }
    fetchData();
  }, []);

  console.log(orderDetails);

  // get others products
  useEffect(() => {
    const getOtherProducts = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axiosInstance.get(`${GET_OTHER_PRODUCTS_BY_ORDER_ID}/${id}`);
        setOtherProducts(response.data.otherProducts);
        console.log(response.data.otherProducts);
      } catch (error: any) {
        dispatch(setLoading(false));
        if (error.response) {
          dispatch(
            setError({
              statusCode: error.response.status,
              message: error.response.data.error,
            })
          );
          toast.error(error.response.data.error || "An error occurred."); // Use specific error message if available
        } else {
          toast.error("Server is Down.");
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    getOtherProducts();
  }, [id]);

  //  add other product by id
  const addOtherProduct = async () => {
    if (!newOtherProduct.item || !newOtherProduct.quantity) {
      toast.error("Name and quantity are required");
      return;
    }
    try {
      dispatch(setBackdrop(true));
      const response = await axiosInstance.post(`${ADD_OTHER_PRODUCT_BY_ORDER_ID}/${id}`, { ...newOtherProduct, order: id });
      setOtherProducts([...otherProducts, response.data.otherProduct]);
      console.log(response.data.otherProduct);
      setNewOtherProduct({ item: '', quantity: 0, order: '' });
      toast.success("Other product added successfully");
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error,
          })
        );
        toast.error(error.response.data.error || "An error occurred."); // Use specific error message if available
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setBackdrop(false));
    }
  };


  // delete other product by id
  const deleteOtherProduct = async (orderId?: string) => {
    try {
      dispatch(setBackdrop(true));
      const res = await axiosInstance.delete(`${DELETE_OTHER_PRODUCT_BY_ID}/${orderId}`);
      console.log(res)
      setOtherProducts(prev => prev.filter(otherProduct => otherProduct.id !== orderId));
      toast.success("Other product deleted successfully");
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error,
          })
        );
        toast.error(error.response.data.error || "An error occurred."); // Use specific error message if available
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setBackdrop(false));
    }
  };

  const updateOrderStatus = async () => {
    try {
      dispatch(setBackdrop(true));
      const response = await axiosInstance.put(`${UPDATE_VENDOR_ORDER}/${id}`, {
        order: orderDetails
      });
      setOrderDetails(response.data.order);
      orderRef.current = _.cloneDeep(response.data.order)
      toast.success(response.data.message);
    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        toast.error("Server is Down.");
      }
      setOrderDetails(orderRef.current);
    } finally {
      setEditMode(false);
      dispatch(setBackdrop(false));
    }
  };

  const addNewStatus = async () => {
    try {
      if (newStatus.contactNumber == '' || newStatus.personName == '' || newStatus.timestamps == '') {
        toast.error("All fields are required for adding new Status.");
        return;
      }
      dispatch(setBackdrop(true));
      const response = await axiosInstance.put(`${UPDATE_VENDOR_ORDER}/${id}`, {
        order: { ...orderDetails, status: [...(orderDetails?.status ?? []), newStatus] }
      });
      setOrderDetails(response.data.order);
      toast.success(response.data.message);
      setNewStatus({ timestamps: '', personName: '', contactNumber: '', status: VendorOrderStatus.PENDING });
    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      setEditMode(false);
      dispatch(setBackdrop(false));
    }
  }

  const addToStock = async () => {
    try {
      dispatch(setBackdrop(true));
      const response = await axiosInstance.post(STOCK, {
        toys: orderDetails?.listOfToysSentLink.map(toy => ({ toy: toy.toy.id, quantity: toy.quantity })),
        orderId: id
      });
      toast.success(response.data.message);
      window.location.reload();
    } catch (error: any) {
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        toast.error("Server is Down.");
      }
    } finally {
      dispatch(setBackdrop(false));
    }
  }

  const handleStatusUpdate = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { name, value } = e.target;
    setOrderDetails(prevValue => {
      if (!prevValue) return prevValue;
      const status = prevValue?.status ?? [];
      status[index] = { ...status[index], [name]: value };
      return { ...prevValue, status };
    });
  }

  return (
    <Loading>
      <div className='pb-10 mt-24'>
        <div className='toys-details-container grid grid-cols-1 mt-4 max-w-[90%] gap-4 m-auto pb-8'>
          <div className='top-box-container flex w-full gap-2'>
            <div className=' shadow-lg rounded-md border p-8 bg-blue-50 flex-1'>
              <div className='flex justify-between items-center'>
                <h2 className='text-xl mb-3'>Order Details</h2>
              </div>

              <div className='card grid grid-cols-2 bg-white border p-2'>
                <p className='p-1 font-[300] flex flex-col m-1'>
                  <strong>Brand </strong>
                  <span className='text-sm'>{orderDetails?.brand}</span>
                </p>

                <p className='p-1 font-[300] flex flex-col'>
                  <strong>subBrand </strong>
                  <span className='text-sm'>{orderDetails?.subBrand}</span>
                </p>

                <p className='p-1 font-[300] flex flex-col items-start'>
                  {orderDetails?.to == "ngo" && (
                    <button
                      onClick={() => addToStock()}
                      className={`text-xs border bg-green-500 flex items-start t p-2 text-white rounded-md  }`}
                      disabled={orderDetails?.isAddedOrRemovedFromTheStock}
                    >
                      {orderDetails?.isAddedOrRemovedFromTheStock
                        ? "Added To Stock"
                        : "Add To stock"}
                    </button>
                  )}

                  {orderDetails?.to == "school" && (
                    <p className='p-1 font-[300] flex items-center gap-2'>
                      <strong>School Id </strong>
                      <span className='text-sm'>{orderDetails?.id}</span>
                    </p>
                  )}

                  {orderDetails?.to == "school" && (
                    <div className="flex gap-3 m-1">
                      <strong>School</strong>
                      <button
                        onClick={() =>
                          navigate(`/school/${orderDetails?.school}`)
                        }
                        className={`text-xs border bg-green-500 flex items-start t p-2 text-white rounded-md  }`}
                        disabled={orderDetails?.isAddedOrRemovedFromTheStock}
                      >
                        Visit to school
                      </button>
                    </div>
                  )}
                </p>

                <p className='p-1 font-[300] flex gap-3 text-sm w-full '>
                  <span className='font-semibold'>From</span>{" "}
                  {orderDetails?.from} <span className='font-semibold'>To</span>{" "}
                  {orderDetails?.to}
                </p>
              </div>
            </div>

            {/* next element */}
            <div className=' shadow-lg rounded-md border p-8 bg-blue-50 flex-1 h-[300px] overflow-x-hidden overflow-y-auto'>
              <div className='justify-between items-center '>
                <h2 className='text-xl mb-3'>Other Items</h2>
                <div className='bg-white'>
                  <table className='w-full border'>
                    <thead>
                      <tr className='text-md '>
                        <th className='p-1 font-[400] border'>Item</th>
                        <th className='p-1 font-[400] border'>Quantity</th>
                        <th className='p-1 font-[400] border'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='text-center w-full'>
                      {otherProducts?.map((otherProduct) => (
                        <tr
                          key={otherProduct.id}
                          className='text-center text-sm'
                        >
                          <td className='border p-1'>{otherProduct.item}</td>
                          <td className='border p-1'>
                            {otherProduct.quantity}
                          </td>
                          <td
                            className='border p-2 flex cursor-pointer items-center justify-center text-red-600 text-md'
                            onClick={() => deleteOtherProduct(otherProduct?.id)}
                          >
                            <CiTrash />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className='border p-1'>
                          <input
                            className='border border-gray-300 w-full  rounded-md p-2 text-sm outline-none placeholder:font-semibold'
                            type='text'
                            placeholder='Item Name...'
                            name='item'
                            value={newOtherProduct?.item}
                            onChange={(e) =>
                              setNewOtherProduct((prev) => ({
                                ...prev,
                                item: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className='border p-1'>
                          <input
                            className='border border-gray-300 w-full  rounded-md p-2  text-sm outline-none placeholder:font-semibold'
                            type='number'
                            placeholder='Quantity'
                            name='quantity'
                            value={newOtherProduct?.quantity}
                            onChange={(e) => {
                              setNewOtherProduct((prev) => ({
                                ...prev,
                                quantity:
                                  e.target.value == ""
                                    ? 0
                                    : parseInt(e.target.value),
                              }));
                            }}
                          />
                        </td>
                        <td className='text-center'>
                          <button
                            className='bg-green-500 text-sm text-white rounded-md p-2 font-[300] hover:bg-green-700 ml-auto mt-3 mb-3'
                            onClick={addOtherProduct}
                          >
                            Add Item
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* next element */}

          <div className='status-container shadow-lg rounded-md border p-8 bg-blue-50 mt-4'>
            <div className='w-full flex justify-between items-center'>
              <h2 className='text-xl mb-3'>Order Status</h2>
                <button
                  className='bg-green-500 text-xs rounded-md p-2 text-white font-medium mb-3'
                  onClick={() =>
                    editMode ? updateOrderStatus() : setEditMode(!editMode)
                  }
                >
                  {editMode ? "Save Details" : "Update Details"}
                </button>
            </div>
            <table className='p-4 w-full text-sm bg-white'>
              <thead>
                <tr>
                  <th className='p-3 font-[500] border'>TimeStamps</th>
                  <th className='p-3 font-[500] border'>Person Name</th>
                  <th className='p-3 font-[500] border'>Contact Number</th>
                  <th className='p-3 font-[500] border'>Status</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails?.status?.map((item, index: number) => {
                  return (
                    <tr
                      className={`border text-center text-sm ${
                        index % 2 !== 0 ? "bg-gray-100" : ""
                      } hover:bg-gray-200 cursor-pointer`}
                    >
                      <td className='border p-2'>
                        {!editMode ? (
                          <span>{item.timestamps || "Not Provided"}</span>
                        ) : (
                          <input
                            type='datetime-local'
                            name='timestamps'
                            className='border rounded-md shadow-md block w-full p-2 text-sm mt-1 outline-none'
                            value={item.timestamps}
                            onChange={(e) => handleStatusUpdate(e, index)}
                          />
                        )}
                      </td>

                      <td className='border p-1'>
                        {!editMode ? (
                          <span>{item.personName || "Not Provided"}</span>
                        ) : (
                          <input
                            type='text'
                            name='personName'
                            className='border rounded-md shadow-md block w-full p-2 text-sm mt-1 outline-none'
                            value={item.personName}
                            onChange={(e) => handleStatusUpdate(e, index)}
                          />
                        )}
                      </td>

                      <td className='border p-1'>
                        {!editMode ? (
                          <span>{item.contactNumber || "Not Provided"}</span>
                        ) : (
                          <input
                            type='text'
                            name='contactNumber'
                            className='border rounded-md shadow-md block w-full p-2 text-sm mt-1 outline-none'
                            value={item.contactNumber}
                            onChange={(e) => handleStatusUpdate(e, index)}
                          />
                        )}
                      </td>

                      <td className='border p-1'>
                        {!editMode ? (
                          <span>{item.status}</span>
                        ) : (
                          <select
                            value={item.status}
                            className='outline-none p-1 rounded-md'
                            name='status'
                            onChange={(e) => handleStatusUpdate(e, index)}
                          >
                            {Object.keys(VendorOrderStatus).map((ele) => (
                              <option value={ele}>{ele}</option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td>
                    <input
                      className='border border-gray-300 w-full  rounded-sm p-3 text-sm outline-none'
                      type='datetime-local'
                      placeholder='TimeStamps'
                      name='timestamps'
                      value={newStatus.timestamps}
                      onChange={(e) =>
                        setNewStatus((prev) => ({
                          ...prev,
                          timestamps: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className='border border-gray-300 w-full  rounded-sm p-3 text-sm outline-none placeholder:font-semibold'
                      type='text'
                      placeholder='Person name'
                      name='personName'
                      value={newStatus.personName}
                      onChange={(e) =>
                        setNewStatus((prev) => ({
                          ...prev,
                          personName: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className='border border-gray-300 w-full  rounded-sm p-3  text-sm outline-none placeholder:font-semibold'
                      type='number'
                      placeholder='Contact number'
                      name='contactNumber'
                      value={newStatus.contactNumber}
                      onChange={(e) =>
                        setNewStatus((prev) => ({
                          ...prev,
                          contactNumber: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td>
                    <select
                      name='status'
                      className='text-sm border border-gray-300 w-full p-3'
                      value={newStatus.status}
                      onChange={(e) =>
                        setNewStatus((prev) => ({
                          ...prev,
                          status:
                            VendorOrderStatus[
                              e.target.value as keyof typeof VendorOrderStatus
                            ],
                        }))
                      }
                    >
                      {Object.keys(VendorOrderStatus).map((orderType) => (
                        <option key={orderType} value={orderType}>
                          {orderType}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} className='text-center'>
                    <button
                      className={`bg-green-500 text-sm text-white rounded-md p-2 font-[300] hover:bg-green-700 ml-auto mt-3 mb-3 disabled:cursor-not-allowed`}
                      onClick={addNewStatus}
                      disabled={!editMode ? false : true}
                    >
                      Add Status
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className='table-container-details overflow-scroll overflow-y-hidden m-auto mt-1 w-[90%] shadow-lg rounded-md border bg-blue-50 sm:p-4 p-2'>
          <h2 className='text-xl mb-3'>Toys Details</h2>
          <table className='p-4 w-full text-sm bg-white'>
            <thead>
              <tr>
                <th className='p-3 font-[500] border'>Id</th>
                <th className='p-3 font-[500] border'>Toy Name</th>
                <th className='p-3 font-[500] border'>Brand</th>
                <th className='p-3 font-[500] border'>subBrand</th>
                <th className='p-3 font-[500] border'>Price</th>
                <th className='p-3 font-[500] border'>Quantity</th>
                <th className='p-3 font-[500] border'>Category</th>
                <th className='p-3 font-[500] border'>Level</th>
                <th className='p-3 font-[500] border'>Learn</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.listOfToysSentLink?.map((item, index: number) => {
                const { toy } = item;
                return (
                  <tr
                    key={toy.id}
                    className={`border text-center text-sm ${
                      index % 2 !== 0 ? "bg-gray-100" : ""
                    } hover:bg-gray-200 cursor-pointer`}
                  >
                    <td className='border p-1'>{toy.id}</td>
                    <td className='border p-1'>{toy.name ? toy.name : "Not Provided"}</td>
                    <td className='border p-1'>{toy.brand ? toy.brand : "Not Provided"}</td>
                    <td className='border p-1'>{toy.subBrand ? toy.subBrand : "Not Provided"}</td>
                    <td className='border p-1'>{item.price  ? item.price : "Not Provided"}</td>
                    <td className='border p-1'>{item.quantity ? item.quantity : "Not Provided"}</td>
                    <td className='border p-2'>{toy.category ? toy.category : "Not Provided"}</td>
                    <td className='border p-2'>
                      {toy.level ? toy.level : "Not Provided"}
                    </td>
                    <td className='border p-2'>
                      {toy.learn?.length !== 0
                        ? toy.learn?.join(" , ")
                        : "Not Provided"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Loading>
  );
};

export default OrderDetails;
