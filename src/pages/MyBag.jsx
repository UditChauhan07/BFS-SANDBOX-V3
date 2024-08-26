import React from "react";
import AppLayout from "../components/AppLayout";
import StripePay from "../components/StripePay";
import MyBagFinal from "../components/MyBagFinal";
const MyBag = () => {
  return (
    <AppLayout>
      <MyBagFinal />
      {/* <StripePay PK_KEY={'null'} amount={15}/> */}
    </AppLayout>
  );
};

export default MyBag;