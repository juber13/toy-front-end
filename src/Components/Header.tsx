import { Link, useLocation , useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import cookies from "js-cookie";
import {
  HOME,
  ORDER_HISTORY,
  ADD_TOY,
  UPDATE_TOY,
  STOCK,
  SCHOOL,
  CART,
} from "../utils/routes";
import { FaPlus } from "react-icons/fa6";
import { setBackdrop, setError } from "../redux/slices/statusSlice";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { CiShoppingCart } from "react-icons/ci";
import { LuSchool } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { CiBoxes } from "react-icons/ci";
import shikshaImg from '../Assests/Images/shiksha.png';


const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get current location
  const navigate = useNavigate();
  const token = cookies.get("token");

  const handleActive = (path: string) => {
    return location.pathname == path ? "border-2 bg-gray-400 border-black-500 text-white font-bold" : ""; // Dynamically set active class
  };

  const addNewSchoolData = async () => {
    try {
      dispatch(setBackdrop(true));
      const response = await axiosInstance.post(SCHOOL);
      toast.success(response.data.message);
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

  const hadleCookie = () => {
    cookies.remove("token");
       navigate("/");
  };

  return (
    <div className='bg-white sticky w-[100%]  top-0 shadow-md p-2 font-[300] text-gray-600 flex gap-1  items-center justify-between'>
      <Link
        to={HOME}
        className={`font-semibold sm:text-md text-xs`}
      >
        <img src={shikshaImg} className="w-20 bg-cover h-13 object-contain" alt="sampoorna-logo" />
      </Link>


      <div className={`flex gap-2 items-center ${!token && "hidden"}`}> 
        <button
          onClick={addNewSchoolData}
          className={`border flex gap-2 border-gray-400  sm:p-2   sm:text-xs items-center rounded-md  text-gray-700 font-semibold }`}
        >
          Add new Schools
          <LuSchool className='relative' />
        </button>

        <Link
          to={STOCK}
          className={`flex gap-2 border border-gray-400 sm:p-2 sm:text-xs items-center rounded-md  text-gray-700 font-medium ${handleActive(STOCK)}`}
        >
          <span>Stock</span>
          <CiBoxes className='relative' />
        </Link>

        <Link
          to={SCHOOL}
          className={`flex gap-2 border border-gray-400 sm:p-2  sm:text-xs items-center rounded-md  text-gray-700 font-medium ${handleActive(SCHOOL)}`}
        >
          <span>Schools</span>
          <LuSchool className='relative' />
        </Link>

        <Link
          to={ADD_TOY}
          className={`flex gap-2 border border-gray-400 sm:p-2  sm:text-xs items-center rounded-md  text-gray-700 font-medium ${handleActive(ADD_TOY)}`}
        >
          <span>Add Toy</span>
          <FaPlus className='relative' />
        </Link>

        <Link
          to={UPDATE_TOY}
          className={`flex gap-2 border border-gray-400 sm:p-2 sm:text-xs items-center rounded-md  text-gray-700 font-medium ${handleActive(UPDATE_TOY)}`}
        >
          <span>Update Toy</span>
          <MdOutlineEdit className='relative' />
        </Link>

        <Link
          to={ORDER_HISTORY}
          className={` border p-2  rounded-md text-xs  border-gray-400 font-semibold  ${handleActive(ORDER_HISTORY)}`}
        >
          Order History
        </Link>

        <Link to={`${CART}`}>
          <CiShoppingCart className='sm:text-3xl text-sm  relative border border-gray-400 rounded-md' />
        </Link>
        {token && <button onClick={hadleCookie} className="text-xs border p-2 border-gray-400 font-semibold rounded-md">Logout</button>}
      </div>
    </div>
  );
};

export default Header;

