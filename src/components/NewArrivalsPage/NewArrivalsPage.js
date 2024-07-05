import React, { useEffect, useState, useMemo } from "react";
import ProductDetails from "../../pages/productDetails";
import Styles from "./NewArrivals.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "../Pagination/Pagination";
import { Link } from "react-router-dom";
import ModalPage from "../Modal UI";
import StylesModal from "../Modal UI/Styles.module.css";
import Loading from "../Loading";
import LoaderV2 from "../loader/v2";
function NewArrivalsPage({ productList, brand, month, isLoaded, to = null }) {
  const [products, setProducts] = useState(productList);
  const [modalShow, setModalShow] = useState(false);
  const [productDetailId, setProductDetailId] = useState();

  const [isEmpty, setIsEmpty] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadEffect,setEffect]=useState(0)
  // ...............
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState([]);

  let PageSize = 10;
  const [pagination, setpagination] = useState([]);
  const allOrdersEmpty = pagination.every(item => item.content.length <= 0);
  useEffect(() => {
    if (!filterData || filterData.length === 1) {
      console.error("Product list is empty or undefined.");
      return;
    }
    const startIndex = (currentPage - 1) * PageSize;
    const endIndex = currentPage * PageSize;
    const newValues = filterData?.flatMap((month) => month?.content).slice(startIndex, endIndex);
    setpagination([{ content: newValues }]);
    console.log(newValues);
  }, [filterData, PageSize, currentPage]);
  // ............
  useEffect(() => {
    let temp = true;
    products.map((month) => {
      month.content.map((item) => {
        if (!brand || brand == item.brand) {
          temp = false;
        }
      });
      setIsEmpty(temp);
    });
  }, [brand]);

  useEffect(() => {
    if (loadEffect) setLoaded(true)
    if (!month) {
      setFilterData(products);
    } else {
      const newValues = products?.map((months) => {
        const filterData = months.content?.filter((item) => {
          if (month) {
            if (brand && brand !== "All") {
              if (brand == item.ManufacturerName__c) {
                return item.date.toLowerCase().includes(month.toLowerCase());
              }
            } else {
              return item.date.toLowerCase().includes(month.toLowerCase());
            }
            // return match.includes(month.toUpperCase() )
          }
        });
        // Create a new object with filtered content
        return { ...months, content: filterData };
      });

      setFilterData(newValues);
    }
    setEffect(loadEffect+1)
    setTimeout(() => {
      setLoaded(false)
    }, 500);
  }, [month, brand]);

  const [imageLoading, setImageLoading] = useState({});
  const handleImageLoad = (imageId) => {
    setImageLoading((prevLoading) => ({ ...prevLoading, [imageId]: false }));
  };
  return (
    <>
      {modalShow ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Cart</h1>
                <p className={` ${StylesModal.ModalContent}`}>This product will be available soon. Please check back later</p>
                <div className="d-flex justify-content-center">
                  <button
                    className={`${StylesModal.modalButton}`}
                    onClick={() => {
                      setModalShow(false);
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => {
            setModalShow(false);
          }}
        />
      ) : null}
      <section>
        <div>
          <div className={Styles.dGrid}>
            {loaded ? <div style={{ width: '100%' }}> <Loading height={'50%'} /></div> : allOrdersEmpty ? (
              <div className={`${Styles.NodataContent} `}>No data found</div>
            ) :
              pagination?.map((month, index) => {
                if (month.content.length) {
                  return month.content.map((product) => {
                    if (!brand || brand == product.ManufacturerName__c) {
                      let price = 'NA';
                      if (product.usdRetail__c) {
                        if (product.usdRetail__c.includes("$")) {
                          let priceSplit = product.usdRetail__c.split('$')
                          if (priceSplit.length == 2) {
                            priceSplit = priceSplit[1].trim();
                            price = "$" + parseFloat(priceSplit).toFixed(2);
                          } else {
                            price = product.usdRetail__c;
                          }
                        } else {
                          price = "$" + parseFloat(product.usdRetail__c).toFixed(2);
                        }
                      }
                      return (

                        <div className={`${Styles.cardElement} cardHover`}>
                          <div className={`last:mb-0 mb-4 ${Styles.HoverArrow}`}>
                            <div className={` border-[#D0CFCF] flex flex-col gap-4   ${Styles.ImgHover1}`}>
                              {/* {isLoaded ? <img className={Styles.imgHolder} onClick={() => { setProductDetailId(product.Id) }} src={product?.[product.ProductCode]?.ContentDownloadUrl ?? product.image} /> : <LoaderV2 />} */}
                              {imageLoading[product.id] ? (
                                <LoaderV2 width={100} height={100} />
                              ) : (
                                <img key={product.Id} src={product.ProductImage ?? "\\assets\\images\\dummy.png"} alt={product.Name} height={212} width={212} onClick={() => {
                                  setProductDetailId(product.Id);
                                }} onLoad={() => handleImageLoad(product.Id)} />
                              )}
                            </div>
                          </div>
                          <p className={Styles.brandHolder}>{product?.ManufacturerName__c}</p>

                          <p
                            className={`${Styles.titleHolder} linkEffect`}
                            onClick={() => {
                              setProductDetailId(product.Id);
                            }}
                          >
                            {product?.Name?.substring(0, 15)}...
                          </p>
                          <p className={Styles.priceHolder}>{price}</p>
                          {to ? (
                            <Link className={Styles.linkHolder}>
                              <p className={Styles.btnHolder}>
                                add to Cart <small className={Styles.soonHolder}>coming soon</small>
                              </p>
                            </Link>
                          ) : (
                            <div onClick={() => setModalShow(true)} className={Styles.linkHolder}>
                              <p className={Styles.btnHolder}>
                                add to Cart <small className={Styles.soonHolder}>coming soon</small>
                              </p>
                            </div>
                          )}
                        </div>

                      );
                    }
                  });
                }
              })
            }
          </div>
        </div>
        <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} isAddtoCart={false} />
      </section>
      {!loaded &&
        <Pagination
          className="pagination-bar"
          currentPage={currentPage || 0}
          totalCount={filterData?.flatMap((month) => month?.content)?.length || 0}
          pageSize={PageSize || 0}
          onPageChange={(page) => setCurrentPage(page)}
        />}
    </>
  );
}

export default NewArrivalsPage;
