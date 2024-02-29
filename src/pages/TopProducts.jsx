import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { topProduct } from "../lib/store";

const TopProducts = () => {
  useEffect(()=>{
    topProduct().then((products)=>{
      console.log({products});
    }).catch((err)=>{
      console.log({err});
    })
  },[])
  return (
    <AppLayout>
      <div className="row d-flex flex-column justify-content-around align-items-center lg:min-h-[300px] xl:min-h-[400px]">
        <div className="col-4">
          <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">
            Coming Soon...
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default TopProducts;
