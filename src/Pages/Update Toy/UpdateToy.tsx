import React, { useState } from "react";
import Loading from "../../Components/Loading/Loading";
import axiosInstance from "../../utils/axiosInstance";
import { setLoading, setError } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";
import { CiSearch } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { IToy } from "../../types/School";
import { GET_TOY_BY_ID } from "../../utils/restEndPoints";
import ToyForm from "../../Components/ToyFrom/ToyForm";

const UpdateToy: React.FC = () => {

  const [toyId, setToyId] = useState<string>("");
  const [toy, setToy] = useState<IToy>();
  const dispatch = useDispatch();
  console.log(toy)


  const findToy = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`${GET_TOY_BY_ID}/${toyId}`);
      setToy(response.data.toy);
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
      dispatch(setLoading(false));
    }
  }


  return (
    <Loading>
      <div className={`w-full flex items-center justify-center mt-2 ${!toy && 'calc-height'}`}>
        <div className={`flex w-[42%]  items-center border  justify-between p-2 rounded-md shadow-lg`}>
          <input
            type='search'
            placeholder='Find Toy By Id...'
            className='p-2 outline-none w-full '
            onChange={(e) => setToyId(e.target.value)}
          />
          <button
            className='border p-2 bg-green-500 text-white flex items-center text-sm gap-1'
            onClick={findToy}
          >
            {/* <span>Search</span> */}
            <CiSearch className='mt-1 text-2xl rounded-md' />
          </button>
        </div>
      </div>
        {toy && <ToyForm title='Update Toy' toy={toy} setToy={setToy} />}
    </Loading>
  );
};

export default UpdateToy;
