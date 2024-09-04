import React, { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem("Name");
    localStorage.removeItem("Api Data");
    localStorage.removeItem("response");
    localStorage.removeItem("manufacturer");
    localStorage.removeItem("AccountId__c");
    localStorage.removeItem("ManufacturerId__c");
    localStorage.removeItem("Account");
    localStorage.removeItem("address");
    for (var key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if(key!="passwordB2B"&&key!="emailB2B")
        localStorage.removeItem(key);
      }
    }
    window.location.href = "/";
  }, []);
  return <></>;
};

export default Logout;
