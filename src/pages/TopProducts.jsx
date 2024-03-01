import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/AppLayout";
import { ShareDrive, getProductImageAll, topProduct } from "../lib/store";
import Loading from "../components/Loading";
import TopProductCard from "../components/TopProductCard";
import { FilterItem } from "../components/FilterItem";
import FilterSearch from "../components/FilterSearch";
import { useManufacturer } from "../api/useManufacturer";
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const TopProducts = () => {
  const { data: manufacturers } = useManufacturer();
  const [topProductList, setTopProductList] = useState({ isLoaded: false, data: [], message: null });
  const [monthList, setMonthList] = useState([])
  const d = new Date();
  let monthIndex = d.getMonth();
  const [manufacturerFilter, setManufacturerFilter] = useState("a0O3b00000p4F4HEAU");
  const [selectedMonth, setSelectedMonth] = useState(monthIndex + 1);
  const [searchText, setSearchText] = useState();
  const [productImages, setProductImages] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    btnHandler(true);
    let indexMonth = [];
    let helperArray = [];
    months.map((month, i) => {
      if (i <= monthIndex) {
        helperArray.push({ label: month, value: i + 1 })
      } else {
        indexMonth.push({ label: month, value: i + 1 })
      }
    })
    let finalArray = indexMonth.concat(helperArray)
    setMonthList(finalArray)
  }, [])

  // const topProductData = useMemo(() => {
  //   return (
  //     topProductList.data1
  //       ?.filter(
  //         (product) =>
  //           !searchText ||
  //           searchText === product.Name
  //       )
  //     // Search by account filter
  //     // ?.filter((product) => {
  //     //   return (
  //     //     !filterValue?.search?.length ||
  //     //     order.AccountName?.toLowerCase().includes(
  //     //       filterValue?.search?.toLowerCase()
  //     //     )
  //     //   );
  //     // })
  //   );
  // }, [searchText, topProductList, selectedMonth]);
  const SearchData = ({ selectedMonth, manufacturerFilter }) => {
    let data = ShareDrive();
    if (!data) {
      data = {};
    }
    if (manufacturerFilter) {
      if (!data[manufacturerFilter]) {
        data[manufacturerFilter] = {};
      }
      if (Object.values(data[manufacturerFilter]).length > 0) {
        setIsLoaded(true)
        setProductImages({ isLoaded: true, images: data[manufacturerFilter] })
      } else {
        setProductImages({ isLoaded: false, images: {} })
      }
    }
    topProduct({ month: selectedMonth, manufacturerId: manufacturerFilter }).then((products) => {
      let result = products.data.sort(function (a, b) {
        return b.Sales - a.Sales;
      });
      setTopProductList({ isLoaded: true, data: result, message: products.message })
      if (result.length > 0) {
        let productCode = "";
        result?.map((product, index) => {
          productCode += `'${product.ProductCode}'`
          if (result.length - 1 != index) productCode += ', ';
        })
        getProductImageAll({ rawData: { codes: productCode } }).then((res) => {
          if (res) {
            if (data[manufacturerFilter]) {
              data[manufacturerFilter] = { ...data[manufacturerFilter], ...res }
            } else {
              data[manufacturerFilter] = res
            }
            ShareDrive(data)
            setProductImages({ isLoaded: true, images: res });
            setIsLoaded(true)
          } else {
            setIsLoaded(true)
            setProductImages({ isLoaded: true, images: {} });
          }
        }).catch((err) => {
          console.log({ err });
        })
      }
    }).catch((err) => {
      console.log({ err });
    })
  }
  const btnHandler = (reset = false) => {
    setIsLoaded(false)
    setTopProductList({ isLoaded: false, data: [], message: null })
    if (reset) {
      setSelectedMonth(monthIndex + 1);
      setManufacturerFilter("a0O3b00000p4F4HEAU");
      setSearchText('');
      SearchData({ selectedMonth: monthIndex + 1, manufacturerFilter: "a0O3b00000p4F4HEAU" })
    } else {
      SearchData({ selectedMonth, manufacturerFilter })
    }
  }
  return (
    <AppLayout filterNodes={<>
      <FilterItem
        minWidth="220px"
        label="Manufacturer"
        name="Manufacturer1"
        value={manufacturerFilter}
        options={manufacturers?.data?.map((manufacturer) => ({
          label: manufacturer.Name,
          value: manufacturer.Id,
        }))}
        onChange={(value) => setManufacturerFilter(value)}
      />
      <FilterItem
        label="Month"
        name="Month"
        value={selectedMonth}
        options={monthList}
        onChange={(value) => setSelectedMonth(value)}
      />
      {/* <FilterSearch
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="Search By Product"
        minWidth="167px"
      /> */}
      <button
        className="border px-2.5 py-1 leading-tight"
        onClick={() => { btnHandler() }}
      >
        Search
      </button>
      <button
        className="border px-2.5 py-1 leading-tight"
        onClick={() => { btnHandler(true) }}
      >
        CLEAR ALL
      </button>
    </>
    }>
      {!topProductList.isLoaded ? <Loading /> : (topProductList.data.length == 0 && topProductList.message) ?
        <div className="row d-flex flex-column justify-content-around align-items-center lg:min-h-[300px] xl:min-h-[400px]">
          <div className="col-4">
            <p className="m-0 fs-2 font-[Montserrat-400] text-[14px] tracking-[2.20px]">
              {topProductList.message}
            </p>
          </div>
        </div>
        :
        <TopProductCard data={topProductList.data} isLoaded={isLoaded} productImages={productImages} to={'/my-retailers'}/>}
    </AppLayout>
  );
};

export default TopProducts;
