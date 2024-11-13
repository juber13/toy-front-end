import { useEffect, useState } from "react";
import { setError, setLoading } from "../../redux/slices/statusSlice";
import axiosInstance from "../../utils/axiosInstance";
import { TOYS } from "../../utils/restEndPoints";
import { IToy } from "../../types/School";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import Loading from "../../Components/Loading/Loading";
import ToyTable from "../../Components/ToyTable";

const Home: React.FC = () => {
  const [toys, setToys] = useState<IToy[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToys = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axiosInstance.get(TOYS);
        setToys(response.data.toys);
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
    fetchToys();
  }, []);



  return (
    <Loading>
      <ToyTable toys={toys.map(toy => ({ toy }))} from="Home"/>
    </Loading>
  );
}

export default Home;