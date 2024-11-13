import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VendorOrder } from "../types/VendorOrder";
import OrderHistoryFilters from "./OrderHistoryFilters";


interface MyComponentProps {
  orders?: VendorOrder[];
}

const OrderHistoryTable: React.FC<MyComponentProps> = ({ orders = [] }) => {
  const [filterOrders, setFilterOrders] = useState<VendorOrder[]>(orders);
  const navigate = useNavigate();
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const params = url.pathname.split("/")[1];
  console.log(params);

  useEffect(() => {
    if (JSON.stringify(filterOrders) !== JSON.stringify(orders)) {
      setFilterOrders(orders);
    }
  }, [orders]);




  return (
    <div className='pb-10'>
      {params !== "school" &&
        <OrderHistoryFilters orders={orders} setFilterOrders={setFilterOrders} />
      }
      <div className='table-container sm:max-w-5xl m-auto mt-4 w-[90%] shadow-lg rounded-md overflow-scroll sm:overflow-hidden overflow-y-hidden'>
        <table className='p-4 w-full text-sm'>
          <thead>
            <tr className='border p-3 font-[400]'>
              <th className='p-3 font-[600] border'>Index</th>
              <th className='p-3 font-[600] border'>Brand</th>
              <th className='p-3 font-[600] border'>SubBrand</th>
              <th className='p-3 font-[600] border'>From</th>
              <th className='p-3 font-[600] border'>To</th>
              <th className='p-3 font-[600] border'>Status</th>
            </tr>
          </thead>
          <tbody>
            {filterOrders.map((item, index: number) => (
              <tr
                key={item.id}
                className={`border text-center text-xs ${index % 2 !== 0 ? "bg-gray-100" : ""
                  } hover:bg-gray-200 cursor-pointer`}
                onClick={() => navigate(`/order-details/${item.id}`)}
              >
                <td className='border p-2'>{index + 1}</td>
                <td className='border p-2'>{item.brand}</td>
                <td className='border p-2'>{item.subBrand}</td>
                <td className='border p-2'>{item.from}</td>
                <td className='border p-2'>{item.to}</td>
                <td className='border p-2 flex gap-2 items-center justify-center'>
                  {item.status.length <= 0
                    ? "Not Provided"
                    : item.status[item.status.length - 1].status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='mt-4 text-center text-2xl pb-5'>
          {filterOrders.length <= 0 && "No Match found!"}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryTable;
