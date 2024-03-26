import React from "react";
import LogoHeader from "../../All Headers/logoHeader/LogoHeader";
import TopNav from "../../All Headers/topNav/TopNav";
import Header from "../../All Headers/header/Header";
import HelpSection from "../HelpSection";
import Footer from "../Footer";
import Layout from "../../Layout/Layout";
import AppLayout from "../../AppLayout";

const InstagramPage = () => {
  return (
    <AppLayout>
      <div className="row d-flex flex-column justify-content-around align-items-center lg:min-h-[300px] xl:min-h-[400px]">
        <div className="col-4">
          <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">
            Coming Soon...
          </p>
        </div>
      </div>
      {/* <OrderStatusFormSection /> */}
    </AppLayout>
  );
};

export default InstagramPage;
