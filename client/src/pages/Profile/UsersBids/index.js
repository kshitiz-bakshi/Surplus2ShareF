import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import { GetAllBids } from "../../../apicalls/product";
import Divider from "../../../components/Divider";
import moment from "moment";

function Bids() {
  const { user } = useSelector((state) => state.users);
  const [bidsData, setBidsData] = useState();
  const dispatch = useDispatch();

  async function getData() {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-primary">Requests</h1>

      {bidsData < 1 && (
        <>
          <h1 className="text-xl text-gray-500">There are no requests</h1>
        </>
      )}
      {bidsData &&
        bidsData.map((bid) => {
          return (
            <div className="border border-solid border-gray-500 p-2 rounded-lg">
              <h1>Food Item : {bid.product.name}</h1>
              <h1>Donor : {bid.seller.name}</h1>
              <h1>Offered Time to Pickup : {bid.bidAmount} minutes</h1>
              <h1>
                Request Date : {moment(bid.createdAt).format("DD-MM-YY hh:mm A")}
              </h1>
              <h1>Message : {bid.message}</h1>
            </div>
          );
        })}
    </div>
  );
}

export default Bids;
