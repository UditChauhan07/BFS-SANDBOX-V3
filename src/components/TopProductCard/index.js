import { useEffect, useState } from "react";
import Styles from "./index.module.css";
import { ShareDrive, getProductImageAll } from "../../lib/store";
import LoaderV2 from "../loader/v2";
import { Link } from "react-router-dom";
import ProductDetails from "../../pages/productDetails";

const TopProductCard = ({ data, productImages, to = null }) => {
  const [productDetailId, setProductDetailId] = useState(null);
  
  useEffect(() => {}, [productDetailId, productImages]);
  return (
    <section>
      <div>
        <div className={Styles.dGrid}>
          {data.map((product) => {
            let listPrice = Number(product?.usdRetail__c?.replace("$", "").replace("-", "").replace(",", "") || 0);
            return (
              <div className={Styles.cardElement}>
                <div className={Styles.salesHolder}>
                  <svg class="salesIcon" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ccc" stroke-width="5" stroke-dasharray="283" stroke-dashoffset="283">
                      {" "}
                      <animate attributeName="stroke-dashoffset" from="283" to="0" dur="2s" fill="freeze" />{" "}
                    </circle>{" "}
                    <text
                      x="50%"
                      y="50%"
                      dominant-baseline="middle"
                      text-anchor="middle"
                      fill="#6a6a6a"
                      font-family="Montserrat-500"
                      font-size="30px"
                      line-height="42px"
                      text-shadow="2px 2px 2px rgba(0, 0, 0, 0.5)"
                      text-transform="uppercase"
                    >
                      <tspan className={`${Styles.ProductSales}`}>{product.Sales}</tspan>{" "}
                    </text>{" "}
                  </svg>
                </div>
                {productImages?.isLoaded ? (
                  <img
                    className={Styles.imgHolder}
                    onClick={() => {
                      setProductDetailId(product.Id);
                    }}
                    src={productImages?.images?.[product.ProductCode]?.ContentDownloadUrl ?? "/assets/images/makeup1.png"}
                  />
                ) : (
                  <LoaderV2 />
                )}
                <p className={Styles.brandHolder}>{product?.ManufacturerName__c}</p>
                <p
                  className={Styles.titleHolder}
                  onClick={() => {
                    setProductDetailId(product.Id);
                  }}
                >
                  {product?.Name.substring(0, 20)}...
                </p>
                <p className={Styles.priceHolder}>$&nbsp;{listPrice.toFixed(2)}</p>
                {to && (
                  <Link to={to} className={Styles.linkHolder}>
                    <p className={Styles.btnHolder}>add to Cart</p>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <ProductDetails productId={productDetailId} setProductDetailId={setProductDetailId} />
    </section>
  );
};
export default TopProductCard;
