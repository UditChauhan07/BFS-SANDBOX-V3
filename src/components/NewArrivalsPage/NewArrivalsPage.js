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
  const [productBrandId, setProductBrandId] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadEffect, setEffect] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterData, setFilterData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const PageSize = 10;

  const allOrdersEmpty = pagination.every(item => item.content.length <= 0);

  useEffect(() => {
    if (filterData && filterData.length > 0) {
      const startIndex = (currentPage - 1) * PageSize;
      const endIndex = currentPage * PageSize;
      const newValues = filterData.flatMap((month) => month?.content).slice(startIndex, endIndex);
      setPagination([{ content: newValues }]);
    } else {
      setPagination([{ content: [] }]);
    }
  }, [filterData, currentPage, PageSize]);

  useEffect(() => {
    let temp = true;
    products.forEach((month) => {
      month.content.forEach((item) => {
        if (!brand || brand === item.brand) {
          temp = false;
        }
      });
    });
    setIsEmpty(temp);
  }, [brand, products]);

  useEffect(() => {
    if (loadEffect) setLoaded(true);
    let newFilterData;

    if (!month) {
      newFilterData = products;
    } else {
      newFilterData = products.map((months) => {
        const filteredContent = months.content.filter((item) => {
          if (month) {
            if (brand && brand !== "All") {
              return brand === item.ManufacturerName__c && item.date.toLowerCase().includes(month.toLowerCase());
            }
            return item.date.toLowerCase().includes(month.toLowerCase());
          }
          return true;
        });
        return { ...months, content: filteredContent };
      }).filter(months => months.content.length > 0); // Remove months with no content
    }

    setFilterData(newFilterData);
    setEffect(loadEffect + 1);
    setCurrentPage(1); // Reset to the first page when filters change
    setTimeout(() => {
      setLoaded(false);
    }, 500);
  }, [month, brand, products]);

  const [imageLoading, setImageLoading] = useState({});
  const handleImageLoad = (imageId) => {
    setImageLoading((prevLoading) => ({ ...prevLoading, [imageId]: false }));
  };

  const resetHandler = () => {
    setProductDetailId();
    setProductBrandId();
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
                    onClick={() => setModalShow(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => setModalShow(false)}
        />
      ) : null}
      <section>
        <div>
          {loaded ? <Loading height={"70vh"} /> : allOrdersEmpty ? (
            <div className="row d-flex flex-column justify-content-center align-items-center lg:min-h-[300px] xl:min-h-[400px]">
              <div className="col-4">
                <p className="m-0 fs-2 text-center font-[Montserrat-400] text-[14px] tracking-[2.20px] text-center">
                  No data found
                </p>
              </div>
            </div>
          ) : (
            <div className={Styles.dGrid}>
              {pagination.map((month, index) => {
                if (month.content.length) {
                  return month.content.map((product) => {
                    if (!brand || brand === product.ManufacturerName__c) {
                      let price = 'NA';
                      if (product.usdRetail__c) {
                        if (product.usdRetail__c.includes("$")) {
                          let priceSplit = product.usdRetail__c.split('$');
                          if (priceSplit.length === 2) {
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
                        <div className={`${Styles.cardElement} cardHover`} key={product.Id}>
                          <div className={`last:mb-0 mb-4 ${Styles.HoverArrow}`}>
                            <div className={` border-[#D0CFCF] flex flex-col gap-4 ${Styles.ImgHover1}`}>
                              {imageLoading[product.id] ? (
                                <LoaderV2 width={100} height={100} />
                              ) : (
                                <img key={product.Id} className="zoomInEffect" src={product.ProductImage ?? "\\assets\\images\\dummy.png"} alt={product.Name} height={212} width={212} onClick={() => {
                                  setProductDetailId(product.Id);
                                  setProductBrandId(product.ManufacturerId__c);
                                }} onLoad={() => handleImageLoad(product.Id)} />
                              )}
                            </div>
                          </div>
                          <Link to={'/Brand/' + product.ManufacturerId__c} style={{ color: '#000' }}>
                            <p className={Styles.brandHolder}>{product?.ManufacturerName__c}</p>
                          </Link>
                          <p
                            className={`${Styles.titleHolder} linkEffect`}
                            onClick={() => {
                              setProductDetailId(product.Id);
                              setProductBrandId(product.ManufacturerId__c);
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
              })}
            </div>
          )}
        </div>
        <ProductDetails productId={productDetailId} setProductDetailId={resetHandler} ManufacturerId={productBrandId} isAddtoCart={false} />
      </section>
      {!loaded && (
        <Pagination
          className="pagination-bar"
          currentPage={currentPage || 0}
          totalCount={filterData.flatMap((month) => month?.content)?.length || 0}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
}

export default NewArrivalsPage;
