import React, { useState } from "react";
import { ISchoolOrder } from "../../types/School";
import axiosInstance from "../../utils/axiosInstance";
import { UPDATE_SCHOOL_ORDER } from "../../utils/restEndPoints";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentOrder: ISchoolOrder | undefined;
  setCurrentOrder: React.Dispatch<React.SetStateAction<ISchoolOrder | undefined>>;
}

const Modal: React.FC<ModalProps> = ({
  setShowModal,
  currentOrder,
  setCurrentOrder,
}) => {
  const [isEdit, setisEdit] = useState<boolean>(false);
  const dispatch = useDispatch();

  const updateOrder = async (listOfToysSentLink: any) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.put(`${UPDATE_SCHOOL_ORDER}`, { order: currentOrder });
      console.log("Put response:", response.data);
      console.log("ListOFToysSentLink", listOfToysSentLink)
      setCurrentOrder(response.data.order);
      toast.success(response.data.message);
    } catch (error: any) {
      if (error.response) {
        console.error("Error:", error.response.data.error);
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error
          })
        );
      } else {
        console.error("Server is Down.");
        toast.error("Server is Down");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOtherChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCurrentOrder((prevValue) => prevValue ? ({ ...prevValue, [name]: value }) : prevValue);
  };


  const handleToyArrayChanges = (index: number, quantity: number) => {
    setCurrentOrder((prevValue) => {
      if (!prevValue) return prevValue;
      const listOfToysSentLink = prevValue.listOfToysSentLink ?? [];

      listOfToysSentLink[index].quantity = quantity;

      return { ...prevValue, listOfToysSentLink };
    });
  };

  const handleSave = () => {
    // updateOrder();
    const listOfToysSentLink = (currentOrder?.listOfToysSentLink ?? []).filter((item) => item.quantity && item.quantity > 0);


    updateOrder(listOfToysSentLink).then(() => {
      console.log("Updated currentOrder:", currentOrder);
    });

    setisEdit(false);
  };

  const handleCancelButtonClick = () => {
    console.log("clicked")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative h-5/6 w-[98%]">
        <div className="flex flex-col justify-between h-[94%] items-center py-8 px-5">
          <div className="flex justify-between w-full">
            <span className="flex flex-col bg-[#f3f3f3] rounded-lg py-2 px-4">
              <span>Date of Dispatch :</span>
              {isEdit ? (
                <input
                  type="text"
                  name="dateOfDispatch"
                  placeholder="Date of Dispatch"
                  className="outline-none border-black border rounded-lg py-1 px-1 w-[190px]"
                  value={currentOrder?.dateOfDispatch || ""}
                  onChange={handleOtherChanges}
                />
              ) : (
                <span>{currentOrder?.dateOfDispatch}</span>
              )}
            </span>
            <span className="flex flex-col bg-[#f3f3f3] rounded-lg py-2 px-4">
              <span>Mode of Dispatch :</span>
              {isEdit ? (
                <input
                  type="text"
                  name="modeOfDispatch"
                  placeholder="Mode of Dispatch"
                  className="outline-none border-black border rounded-lg py-1 px-1 w-[190px]"
                  value={currentOrder?.modeOfDispatch || ""}
                  onChange={handleOtherChanges}
                />
              ) : (
                <span>{currentOrder?.modeOfDispatch}</span>
              )}
            </span>
          </div>

          {/* table */}
          <div
            id="table"
            className="flex max-h-[280px] overflow-y-auto flex-col w-full border border-black"
          >
            <div
              id="head"
              className="flex items-center border-black border-b bg-[#97b8f9] font-semibold"
            >
              <div className="w-[5%] flex justify-center border-r border-black py-3">
                srNo
              </div>
              <div className="w-[10%] flex justify-center border-r border-black py-3">
                Category
              </div>
              <div className="w-[10%] flex justify-center border-r border-black py-3">
                Brand
              </div>
              <div className="w-[13%] flex justify-center border-r border-black py-3">
                Sub-Brand
              </div>
              <div className="w-[6%] flex justify-center border-r border-black py-3">
                Price
              </div>
              <div className="w-[10%] flex justify-center border-r border-black py-3">
                Name
              </div>
              <div className="w-[10%] flex justify-center border-r border-black py-3">
                Level
              </div>
              <div className="w-[7%] flex justify-center border-r border-black py-3">
                Quantity
              </div>
              <div className="w-[20%] flex justify-center border-r border-black py-3">
                Learn
              </div>
              <div className="w-[7%] flex justify-center border-r border-black py-3">
                Link
              </div>
            </div>

            <div id="body">
              {currentOrder?.listOfToysSentLink?.map((toyObject, index) => (
                <div
                  key={toyObject.id}
                  id="row"
                  className={`flex w-full items-center ${index % 2 == 0 ? "bg-[#fce99e]" : "bg-[#bef9b9]"
                    }`}
                >
                  <div className="w-[5%] px-1 flex justify-center border-r border-black py-3">
                    {toyObject.toy.id}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[10%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.category}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[10%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.brand}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[13%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.subBrand}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[6%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.price}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[10%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.name}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[10%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto"
                  >
                    {toyObject.toy.level}
                  </div>
                  <div className="w-[7%] px-1 flex justify-center border-r border-black py-3 overscroll-x-auto">
                    {isEdit ? (
                      <input
                        type="number"
                        className="w-full outline-none border-black border rounded-lg px-1"
                        name="quantity"
                        value={toyObject.quantity}
                        onChange={(e) =>
                          handleToyArrayChanges(index, Number(e.target.value))
                        }
                      />
                    ) : (
                      toyObject.quantity
                    )}
                  </div>
                  <div
                    id="hideScrollbar"
                    className="w-[20%] px-1 flex justify-center border-r border-black py-3 overflow-auto overscroll-x-auto"
                  >
                    {toyObject.toy.learn?.map((learn, learnIndex) => (
                      <span key={learnIndex}>
                        {learn}
                        {(toyObject.toy.learn?.length && learnIndex < toyObject.toy.learn?.length - 1)
                          ? ", "
                          : ""}
                      </span>
                    ))}
                  </div>
                  <div className="w-[7%] px-1 flex justify-center border-r border-black py-3">
                    {
                      <a className="text-blue-700 underline" href={toyObject.toy.link} target="_blank">
                        Youtube
                      </a>
                    }
                  </div>
                  <div className="w-[2%] px-1 flex justify-center">
                    <button>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between w-full">
            <span className="flex flex-col bg-[#f3f3f3] rounded-lg py-2 px-4">
              <span>Tracking Details:</span>
              {isEdit ? (
                <input
                  type="text"
                  name="trackingDetails"
                  placeholder="Tracking Details"
                  className="outline-none border-black border rounded-lg py-1 px-1 w-[190px]"
                  value={currentOrder?.trackingDetails || ""}
                  onChange={handleOtherChanges}
                />
              ) : (
                <span>{currentOrder?.trackingDetails}</span>
              )}
            </span>
            <span className="flex flex-col bg-[#f3f3f3] rounded-lg py-2 px-4">
              <span>Date of Delivery :</span>
              {isEdit ? (
                <input
                  type="text"
                  name="dateOfDelivery"
                  placeholder="Date of Delivery"
                  className="outline-none border-black border rounded-lg py-1 px-1 w-[190px]"
                  value={currentOrder?.dateOfDelivery || ""}
                  onChange={handleOtherChanges}
                />
              ) : (
                <span>{currentOrder?.dateOfDelivery}</span>
              )}
            </span>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center gap-7 justify-center">
            {isEdit ? (
              <button onClick={handleSave} className="bg-green-500 text-white font-semibold px-4 py-1 rounded-lg">
                Save
              </button>
            ) : (
              <button onClick={() => { setisEdit(true) }} className="bg-blue-500 text-white font-semibold px-4 py-1 rounded-lg">
                Edit
              </button>
            )}
            <button onClick={handleCancelButtonClick} className="bg-red-500 text-white font-semibold px-4 py-1 rounded-lg">
              Cancel
            </button>
          </div>
        </div>

        {/* button */}
        <button
          className=" hover:bg-red-100 absolute top-4 right-5"
          onClick={() => setShowModal(false)}
        >
          <span className="material-icons text-2xl">❌</span>
        </button>
      </div>
    </div>
  );
};

export default Modal;
