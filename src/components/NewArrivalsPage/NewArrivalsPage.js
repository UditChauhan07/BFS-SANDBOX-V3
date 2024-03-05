import React, { useEffect, useState, useMemo } from "react";
import ProductDetails from "../../pages/productDetails";
import LoaderV2 from "./../loader/v2";
import Styles from "./NewArrivals.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import ModalPage from "../Modal UI";
import StylesModal from "../Modal UI/Styles.module.css";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function NewArrivalsPage({ productList, brand, month, isLoaded,to=null }) {
  const [products, setProducts] = useState(productList);
  const [modalShow, setModalShow] = useState(false);
  const [productDetailId, setProductDetailId] = useState();

  const [isEmpty, setIsEmpty] = useState(false);
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

  const [filterData, setFilterData] = useState();
  useEffect(() => {
    if (!month) {
      setFilterData(products);
    }
    const newValues = products?.map((months) => {
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
    setFilterData(newValues);
  }, [month, brand]);

  return (
    <>
    {modalShow ? (
        <ModalPage
          open
          content={
            <>
              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${StylesModal.ModalHeader}`}>Cart</h1>
                <p className={` ${StylesModal.ModalContent}`}>This Product Available soon. Please check back later.</p>
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
            {!isEmpty ? (
              productList?.map((month,index) => {
                 if (month.content.length) {
                  return (
                   month.content.map((product) => {
                  if (!brand || brand == product.brand) {
                    return (
                      <div className={Styles.cardElement}>
                         {/* {isLoaded ? <img className={Styles.imgHolder} onClick={() => { setProductDetailId(product.Id) }} src={product?.[product.ProductCode]?.ContentDownloadUrl ?? product.image} /> : <LoaderV2 />} */}
                         <img src={product.image} alt={product.name} />
                        <p className={Styles.brandHolder}>{product?.brand}</p>
                        <p className={Styles.titleHolder} onClick={() => { setProductDetailId(product.Id) }}>{product?.name?.substring(0, 15)}...</p>
                        <p className={Styles.priceHolder}>$ -- . --</p>
                        {to ?
                              <Link className={Styles.linkHolder}><p className={Styles.btnHolder}>add to Cart <small className={Styles.soonHolder}>coming soon</small></p></Link> : <div onClick={() => setModalShow(true)} className={Styles.linkHolder}><p className={Styles.btnHolder}>add to Cart <small className={Styles.soonHolder}>coming soon</small></p></div>}
                      </div>
                    );
            
                   }
                })
              
                  )
              }
              })
            ) : (
             
              <div>No data found</div>
            )}
          </div>
        </div>
        <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} />
      </section> 
    </>
  );
}

export default NewArrivalsPage;
