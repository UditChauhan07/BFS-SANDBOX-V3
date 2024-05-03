import React, { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import LaunchCalendar from "../components/LaunchCalendar/LaunchCalendar";
import { FilterItem } from "../components/FilterItem";
import html2pdf from "html2pdf.js";
import { MdOutlineDownload } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import { CloseButton } from "../lib/svg";
import { GetAuthData, getMarketingCalendar, getMarketingCalendarPDF, getMarketingCalendarPDFV2, getMarketingCalendarPDFV3, originAPi } from "../lib/store";
import Loading from "../components/Loading";
import { useManufacturer } from "../api/useManufacturer";
const fileExtension = ".xlsx";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

const MarketingCalendar = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [isLoaded, setIsloaed] = useState(false);
  const [isPDFLoaded, setPDFIsloaed] = useState(false);
  const [pdfLoadingText, setPdfLoadingText] = useState(".");
  const [productList, setProductList] = useState([]);
  let brands = [
    { value: null, label: "All" },
    { value: "AERIN", label: "AERIN" },
    { value: "ARAMIS", label: "ARAMIS" },
    { value: "Bobbi Brown", label: "Bobbi Brown" },
    { value: "Bumble and Bumble", label: "Bumble and Bumble" },
    { value: "BY TERRY", label: "BY TERRY" },
    { value: "Byredo", label: "Byredo" },
    { value: "Diptyque", label: "Diptyque" },
    { value: "ESTEE LAUDER", label: "ESTEE LAUDER" },
    { value: "Kevyn Aucoin Cosmetics", label: "Kevyn Aucoin Cosmetics" },
    { value: "L'Occitane", label: "L'Occitane" },
    { value: "Maison Margiela", label: "Maison Margiela" },
    { value: "Miriam Quevedo", label: "Miriam Quevedo" },
    { value: "Re-Nutriv", label: "Re-Nutriv" },
    { value: "ReVive", label: "ReVive" },
    { value: "RMS Beauty", label: "RMS Beauty" },
    { value: "Smashbox", label: "Smashbox" },
    { value: "Victoria Beckham Beauty", label: "Victoria Beckham Beauty" },
  ];

  useEffect(() => {
    GetAuthData().then((user) => {
      getMarketingCalendar({ key: user.x_access_token }).then((productRes) => {
        setProductList(productRes)
        setIsloaed(true)
        setTimeout(() => {

          var element = document.getElementById("May");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 2000);
      }).catch((err) => console.log({ err }))
    }).catch((e) => console.log({ e }))
  }, [isLoaded])
  const [month, setMonth] = useState("");
  let months = [
    { value: null, label: "All" },
    { value: "JAN", label: "JAN" },
    { value: "FEB", label: "FEB" },
    { value: "MAR", label: "MAR" },
    { value: "APR", label: "APR" },
    { value: "MAY", label: "MAY" },
    { value: "JUN", label: "JUN" },
    { value: "JULY", label: "JULY" },
    { value: "AUG", label: "AUG" },
    { value: "SEP", label: "SEP" },
    { value: "OCT", label: "OCT" },
    { value: "NOV", label: "NOV" },
    { value: "DEC", label: "DEC" },
    { value: "TBD", label: "TBD" },
  ];
  const generatePdf = () => {
    const element = document.getElementById('CalenerContainer'); // The HTML element you want to convert
    // element.style.padding = "10px"
    let filename = `Marketing Calender `;
    if (brand) {
      filename = brand + " "
    }
    filename += new Date();
    const opt = {
      margin: 1,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };
  // .............

  const LoadingEffect = () => {
    const intervalId = setInterval(() => {
      if (pdfLoadingText.length > 6) {
        setPdfLoadingText('.');
      } else {
        setPdfLoadingText(prev => prev + '.');
      }
      if (pdfLoadingText.length > 12) {
        setPdfLoadingText('');
      }
    }, 1000);
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 10000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }

  const { data: manufacturers } = useManufacturer();
  const generatePdfServerSide = (version=0) => {
    setPDFIsloaed(true);
    LoadingEffect();
    GetAuthData().then((user) => {
      let manufacturerId = null;
      manufacturers.data.filter(item => { if (item?.Name?.toLowerCase() == brand?.toLowerCase()) { manufacturerId = item.Id } })
      if (version == 1) {
        getMarketingCalendarPDFV2({ key: user.x_access_token, manufacturerId, month }).then((file) => {
          if (file) {
            const a = document.createElement('a');
            a.href = originAPi + "/download/" + file + "/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          } else {
            const a = document.createElement('a');
            a.href = originAPi + "/download/blank.pdf/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          }
        }).catch((pdfErr) => {
          console.log({ pdfErr });
        })
      }else if (version == 2) {
        getMarketingCalendarPDFV3({ key: user.x_access_token, manufacturerId, month }).then((file) => {
          if (file) {
            const a = document.createElement('a');
            a.href = originAPi + "/download/" + file + "/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          } else {
            const a = document.createElement('a');
            a.href = originAPi + "/download/blank.pdf/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          }
        }).catch((pdfErr) => {
          console.log({ pdfErr });
        })
      }
       else {
        getMarketingCalendarPDF({ key: user.x_access_token, manufacturerId, month }).then((file) => {
          if (file) {
            const a = document.createElement('a');
            a.href = originAPi + "/download/" + file + "/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          } else {
            const a = document.createElement('a');
            a.href = originAPi + "/download/blank.pdf/1/index";
            // a.target = '_blank'
            setPDFIsloaed(false);
            a.click();
          }
        }).catch((pdfErr) => {
          console.log({ pdfErr });
        })
      }
    }).catch((userErr) => {
      console.log({ userErr });
    })
  }


  const generateXLSX = () => {
    const newValues = productList?.map((months) => {
      const filterData = months.content?.filter((item) => {
        // let match = item.OCDDate.split("/")
        // console.log(match)
        if (month) {
          if (brand) {
            if (brand == item.brand) {
              return item.date.toLowerCase().includes(month.toLowerCase());
            }
          } else {
            return item.date.toLowerCase().includes(month.toLowerCase());
          }
          // return match.includes(month.toUpperCase() )
        } else {
          if (brand) {
            if (brand == item.brand) {
              return true;
            }
          } else {
            return true;
          }
          // If month is not provided, return all items
        }
      });
      // Create a new object with filtered content
      return { ...months, content: filterData };
    });
    let fileData = exportToExcel({ list: newValues });
  };

  const csvData = ({ data }) => {
    let finalData = [];
    if (data.length) {
      data?.map((ele) => {
        if (ele.content.length) {
          ele.content.map((item) => {
            let temp = {};
            temp["MC Month"] = ele.month;
            temp["Product Title"] = item.name;
            temp["Product Description"] = item.description;
            temp["Product Size"] = item.size;
            temp["Product Ship Date"] = item.date;
            temp["Product OCD Date"] = item.OCDDate;
            temp["Product Brand"] = item.brand;
            temp["Product Price"] = item.usdRetail__c;
            finalData.push(temp);
          });
        }
      });
    }
    return finalData;
  };
  const exportToExcel = ({ list }) => {
    const ws = XLSX.utils.json_to_sheet(csvData({ data: list }));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    let filename = `Marketing Calender`;
    if (brand) {
      filename = brand;
    }
    FileSaver.saveAs(data, `${filename} ${new Date()}` + fileExtension);
  };
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="All Brand"
            name="All-Brand"
            value={brand}
            options={brands}
            onChange={(value) => {
              setBrand(value);
            }}
          />
          <FilterItem
            minWidth="220px"
            label="JAN-DEC"
            name="JAN-DEC"
            value={month}
            options={months}
            onChange={(value) => {
              setMonth(value);
            }}
          />
          <button
            className="border px-2 py-1 leading-tight d-grid"
            onClick={() => {
              setBrand("");
              setMonth(null);
              setPDFIsloaed(false);
            }}
          >
            <CloseButton crossFill={'#fff'} height={20} width={20} />
            <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
          </button>
          <div
            className="dropdown dropdown-toggle border px-2 py-1 leading-tight d-flex"
          >
            <div className=" d-grid" role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              <MdOutlineDownload size={16} className="m-auto" />
              <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Download</small>
            </div>
            <ul className="dropdown-menu">
              <li>
                <div className="dropdown-item text-start" style={{ cursor: 'pointer' }} onClick={() => generatePdfServerSide()}>
                  &nbsp;Pdf
                </div>
              </li>
              <li>
                <div className="dropdown-item text-start" style={{ cursor: 'pointer' }} onClick={() => generatePdfServerSide(1)}>
                  &nbsp;PDF Quickview 1
                </div>
              </li>
              <li>
                <div className="dropdown-item text-start" style={{ cursor: 'pointer' }} onClick={() => generatePdfServerSide(2)}>
                  &nbsp;PDF Quickview 2
                </div>
              </li>
              <li>
                <div className="dropdown-item text-start" style={{ cursor: 'pointer' }} onClick={() => generateXLSX()}>
                  &nbsp;XLSX
                </div>
              </li>
            </ul>
          </div>
        </>
      }
    >
      {isPDFLoaded ? <div className="d-flex" style={{ height: '50vh' }}><p className="m-auto">Generating Pdf..<span>{pdfLoadingText}</span></p></div> :
        isLoaded ? <LaunchCalendar brand={brand} month={month} productList={productList} /> : <Loading />}

    </AppLayout>
  );
};

export default MarketingCalendar;
