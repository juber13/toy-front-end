import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { IToy } from '../../types/School';
import { setBackdrop, setError, setLoading } from '../../redux/slices/statusSlice';
import axiosInstance from '../../utils/axiosInstance';
import { DELETE_TOY_FROM_STOCK_BY_ID, GET_ALL_TOYS_FROM_STOCK } from '../../utils/restEndPoints';
import { toast } from 'react-toastify';
import Loading from '../../Components/Loading/Loading';
import ToyTable from '../../Components/ToyTable';

const Stock: React.FC = () => {
    const [toys, setToys] = useState<{ toy: IToy; quantity: string }[]>([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchToys = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axiosInstance.get(GET_ALL_TOYS_FROM_STOCK);
                setToys(response.data.toys.map((item: any) => ({ quantity: item.quantity, toy: item.toy })));
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

    const deleteToyFromStock = async (id: string) => {
        console.log(id)
        try {
            dispatch(setBackdrop(true));
            const response = await axiosInstance.delete(`${DELETE_TOY_FROM_STOCK_BY_ID}/${id}`);
            toast.success(response.data.message);
            setToys(prevList => prevList.filter(item => item.toy.id != id));
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

    return (
        <Loading>
            <ToyTable from='Stock' deleteToyFromStock={deleteToyFromStock} setToys={setToys} toys={toys.map(toy => ({ toy: toy.toy, quantity: toy.quantity }))} />;
        </Loading>
    );
}

export default Stock