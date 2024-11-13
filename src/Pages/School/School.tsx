import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { SCHOOL } from "../../utils/restEndPoints";
import { useDispatch } from "react-redux";
import { setError, setLoading } from "../../redux/slices/statusSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import './School.css'
import Loading from "../../Components/Loading/Loading";
import {ISchoolDetails} from '../../types/School'
import { BiSearch } from "react-icons/bi";

const School: React.FC = () => {
  const dispatch = useDispatch();
  const [schoolList, setSchoolList] = useState<ISchoolDetails[]>([]);
  const [searchType, setSearchType] = useState<string>("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(SCHOOL);
      console.log("API Response:", response.data.schools);

      if (Array.isArray(response.data.schools)) {
        setSchoolList(response.data.schools);
      } else {
        console.error("Expected an array but got:", typeof response.data);
        setSchoolList([]);
      }
    } catch (error: any) {
      console.log(error.response.data.error);
      console.log(error.response.status);
      if (error.response) {
        dispatch(
          setError({
            statusCode: error.response.status,
            message: error.response.data.error,
          })
        );
      } else {
        toast.error("Server is Down");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


    const filteredSchool = schoolList?.filter((school) => {
     return school.nameOfSchoolInstitution?.toLowerCase().includes(searchType.toLowerCase()) 
  });


  return (
    <Loading>
      <>
        <div className='filter w-[90%] m-auto mt-3 border p-2 rounded-md flex items-center '>
          <input
            type='text'
            className='p-2 text-sm w-full outline-none placeholder:font-semibold'
            placeholder='Name of School...'
            onChange={(e) => setSearchType(e.target.value)}
          />
          <BiSearch className='text-2xl' />
        </div>
        <div className='w-[90%] m-auto flex flex-wrap gap-5 mt-5 pb-10'>
          <table className='p-4 w-full text-sm'>
            <thead>
              <tr className='border p-2 font-[400]'>
                <th className='p-2 font-[600] border'>Code Name</th>
                <th className='p-2 font-[600] border'>School Name</th>
                <th className='p-2 font-[600] border'>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchool?.map((school) => {
                return (
                  <tr
                    key={school._id}
                    className={`border text-center text-sm cursor-pointer $`}
                    onClick={() => navigate(`/school/${school._id}`)}
                  >
                    <td className='border p-2'>{school.code}</td>
                    <td className='border p-2'>
                      {school.nameOfSchoolInstitution}
                    </td>
                    <td className='border p-2'>
                      {school.fullAddressWithPinCode}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSchool.length === 0 && (
            <div className='w-full flex justify-center items-center'>
              <h1 className='text-2xl font-bold'>No School Found</h1>
            </div>
          )}
        </div>
      </>
    </Loading>
  );
};

export default School;
