import React, { useState } from "react";
import Styles from "./style.module.css";
import { CloseButton } from "../../../lib/svg";


const SelectBrandModel = ({ brands, onClose = null, onChange = null }) => {


  return (
    <>
      <div className="px-[68px] pb-[67px] pt-[40px] max-w-[900px]">
        <section>
          <div className="d-flex align-items-center justify-content-between gap-5 mb-4">
          <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] text-center">Choose the Manufacturer</h1>
            <button type="button" onClick={onClose}>
              <CloseButton />
            </button>
          </div>

          <div className={Styles.BrandInRadio}>
            <div className={Styles.ModalResponsive}>
              {brands?.map((brand, index) => (
                <div className={Styles.BrandName} key={index}>
                  <input
                    type="radio"
                    name="brand_names"
                    onChange={() => {
                      if (onChange) { onChange(brand) }
                    }}
                    id={brand.ManufacturerName__c || brand.Name}
                  />
                  <label htmlFor={brand.ManufacturerName__c || brand.Name}>{brand.ManufacturerName__c || brand.Name}</label>
                </div>
              ))}
            </div>

            {/* <div className={Styles.BrandButton}> */}
            {/* <button className={Styles.Button1} onClick={onClose}>
                CANCEL
              </button> */}
            {/* <button
                className={Styles.Button2}
                onClick={() => {
                  if (selectedBrandManufacturer) {
                    navigate(`/product`);
                  } else {
                    setModalOpen(true);
                  }
                }}
              >
                SUBMIT
              </button> */}
            {/* </div> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default SelectBrandModel;
