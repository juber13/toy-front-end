import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { SCHOOL, SCHOOL_ORDER } from "../../utils/restEndPoints";
import { ISchoolDetails, ISchoolOrder } from "../../types/School";
import { toast } from "react-toastify";
import { setError, setLoading } from "../../redux/slices/statusSlice";
import { useDispatch } from "react-redux";
import Loading from "../../Components/Loading/Loading";
import school from "../../Assests/Images/School.jpg";
import Modal from "../../Components/Modal/Modal";
import InfoSection from "../../Components/InfoSection/InfoSection";
import { InfoItem } from "../../types/School";
import OrderHistoryTable from "../../Components/OrderHistoryTable";
import { VendorOrder } from "../../types/VendorOrder";

const SchoolDetail: React.FC = () => {
  const [schoolData, setSchoolData] = useState<ISchoolDetails>({});
  const [schoolOrders, setSchoolOrder] = useState<VendorOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<ISchoolOrder>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [totalToysQuantity, setTotalToysQuantity] = useState<number>(0);

  useEffect(() => {
    setTotalToysQuantity(schoolOrders.reduce((acc, order) => acc + order.listOfToysSentLink.reduce((acc, toy) => acc + toy.quantity, 0), 0));
  },[schoolOrders]) 






  const fetchData = async () => {
    console.log('afsd')
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`${SCHOOL}/${id}`);
      setSchoolData(response.data.school);
      console.log("School data:", response.data.school);
      const orderResponse = await axiosInstance.get(`${SCHOOL_ORDER}/${id}`);
      console.log("School orders:", orderResponse.data);
      setSchoolOrder(orderResponse.data);
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
  };


  useEffect(() => {
    console.log(schoolData);
    if (Object.keys(schoolData).length === 0) {
      fetchData();
    }
  }, []);

  const schoolPersonInfo: InfoItem[] = [
    { label: "School Id", value: schoolData.id },
    { label: "Principal", value: schoolData.nameOfPrincipalAndManagement },
    { label: "Principal Contact", value: schoolData.contactNumberOfPrincipalManagement },
    { label: "Library Coordinator", value: schoolData.nameOfCoordinatorForLibrary },
    { label: "Coordinator Contact", value: schoolData.contactDetailsOfCoordinatorTeacher },
  ];

  const schoolAddressInfo: InfoItem[] = [
    { label: "District", value: schoolData.district },
    { label: "State", value: schoolData.state },
    { label: "Full Address", value: schoolData.fullAddressWithPinCode },
    { label: "Village Name", value: schoolData.villageNameIfAny },
  ];

  const classInfo: InfoItem[] = [
    { label: "Students (Balwadi - class 1)", value: schoolData.numberOfStudentsBalwadiClass1 },
    { label: "Students (class 2 - class 4)", value: schoolData.numberOfStudentsClass2To4 },
    { label: "Students (class 5 and above)", value: schoolData.numberOfStudentsClass5AndAbove },
  ];

  const otherDetailsInfo: InfoItem[] = [
    { label: "Safekeeping Cupboard", value: schoolData.isThereCupboardForSafekeeping },
    { label: "Library Room", value: schoolData.isThereRoomForLibrary },
    { label: "Referred by", value: schoolData.referredBy },
    { label: "Timestamp", value: schoolData.createdAtIST },
  ];

  return (
    <Loading>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          currentOrder={currentOrder}
          setCurrentOrder={setCurrentOrder}
        />
      )}
      <div className='p-8 bg-[#f5f5f5] h-[100vh] overflow-y-auto flex gap-8'>
        <div className='w-2/5 h-full flex items-center justify-center gap-8 bg-white'>
          <img src={school} className='max-h-[80vh]' alt='' />
        </div>
        <div className='w-3/5 overflow-y-auto bg-white h-full p-7'>
          <div id='main'>
            <h1 className='text-3xl font-bold mb-4'>
              {schoolData.nameOfSchoolInstitution}{" "}
              <span>({schoolData.typeOfInstitutionSchool})</span>
            </h1>

            <div className='flex flex-col gap-7 h-full'>
              <InfoSection title="School Person's" info={schoolPersonInfo} />
              <InfoSection title='School Address' info={schoolAddressInfo} />
              <InfoSection title='Class' info={classInfo} />
              <InfoSection title='Other Details' info={otherDetailsInfo} />
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-5xl p-2 m-auto flex items-center justify-between'>
        <h2 className='text-2xl font-bold flex-col'>Orders</h2>
        {schoolOrders?.length > 0 && (
          <div className='w-30 h-10 p-2 shadow-sm items-center flex text-md font-semibold justify-center rounded-md'>
             {totalToysQuantity}
          </div>
        )}
      </div>
      <OrderHistoryTable orders={schoolOrders} />
    </Loading>
  );
};

export default SchoolDetail;
