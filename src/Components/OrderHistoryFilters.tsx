/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { VendorOrder, VendorOrderStatus } from "../types/VendorOrder";


const OrderHistoryFilters: React.FC<{orders: VendorOrder[];setFilterOrders: React.Dispatch<React.SetStateAction<VendorOrder[]>>}> = ({ orders, setFilterOrders }) => {

  const [to, setTo] = useState<string>("all");
  const [fromTo, setFromTo] = useState<string>("all");
  const [orderStatus, setOrderStatus] = useState<VendorOrderStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const matchOrderBrandOrSubBrand = (orderName: string) => {
    return (
      searchQuery === "" ||
      orderName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = () => {
    setFilterOrders(
      orders.filter(
        (order) =>
          (matchOrderBrandOrSubBrand(order.brand) || matchOrderBrandOrSubBrand(order.subBrand)) &&
          (orderStatus === undefined ||(order.status.length > 0 ? order.status[order.status.length - 1].status === orderStatus: false)) &&
          (fromTo === "all" || order.from === fromTo) &&
          (to === "all" || order.to === to)
      )
    );
  };

  useEffect(() => {
    handleSearch()
  },[searchQuery , fromTo , orderStatus , to])

  return (
    <div className='filters flex sm:flex-row flex-col mt-2 sm:max-w-5xl m-auto gap-2 w-[90%] justify-between'>
      <div className='pl-2 flex gap-2'>
        <input
          type='text'
          placeholder='Brand Or SubBrand...'
          className='text-xs outline-none border p-2 rounded-sm flex-1'
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className='border rounded-sm block text-[12px] outline-none p-1'
          onChange={(e) =>
            setOrderStatus(
              e.target.value === "All"
                ? undefined
                : VendorOrderStatus[
                    e.target.value as keyof typeof VendorOrderStatus
                  ]
            )
          }
        >
          {["All", ...Object.keys(VendorOrderStatus)].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          name='from'
          className='border rounded-sm block w-full p-3 text-xs outline-none'
          onChange={(e) => setFromTo(e.target.value)}
        >
          <option  disabled selected>
            From
          </option>
          <option value='all'>all</option>
          <option value='vendor'>vendor</option>
          <option value='ngo'>ngo</option>
        </select>

        <select
          name='to'
          className='border rounded-sm block w-full p-3 text-xs outline-none'
          onChange={(e) => setTo(e.target.value)}
        >
          <option  disabled selected>
            To
          </option>
          <option value='all'>all</option>
          <option value='school'>school</option>
          <option value='ngo'>ngo</option>
        </select>
      </div>
    </div>
  );
};

export default OrderHistoryFilters;
