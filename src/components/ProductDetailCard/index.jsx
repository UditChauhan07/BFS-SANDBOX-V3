import Styles from "./Styles.module.css";
import { DeleteIcon } from "../../lib/svg";
import QuantitySelector from "../BrandDetails/Accordion/QuantitySelector";
import Slider from "../../utilities/Slider";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateConvert } from "../../lib/store";
import Loading from "../Loading";

const ProductDetailCard = ({
  product,
  orders,
  onPriceChangeHander = null,
  onQuantityChange = null,
  isAddtoCart,
  AccountId,
  toRedirect,
  setStoreSet = null,
  accountId = null,
  accounts = 0,
  autoSelectCheck = false,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {}, [orders]);

  if (!product) {
    return null;
  }

  const listPrice = Number(product?.data?.usdRetail__c?.replace("$", "").replace(",", ""));
  let salesPrice = 0;
  let discount = product?.discount?.margin;

  let inputPrice = Object.values(orders)?.find(
    (order) =>
      order.product.Id === product?.data?.Id &&
      order.manufacturer.name === product?.data?.ManufacturerName__c &&
      order.account.id === (AccountId || accountId.value)
  )?.product?.salesPrice;

  if (product?.data?.Category__c === "TESTER") {
    discount = product?.discount?.testerMargin;
    salesPrice = (listPrice - (discount / 100) * listPrice).toFixed(2);
  } else if (product?.data?.Category__c === "Samples") {
    discount = product?.discount?.sample;
    salesPrice = (listPrice - (discount / 100) * listPrice).toFixed(2);
  } else {
    salesPrice = (listPrice - (discount / 100) * listPrice).toFixed(2);
  }

  const fakeProductSlider = [
    {
      src: "\\assets\\images\\dummy.png",
    },
  ];

  const autoSelectQty = () => {
    onQuantityChange(product?.data, product?.data?.Min_Order_QTY__c, inputPrice || parseFloat(salesPrice), discount);
  };

  return (
    <div className="container mt-4 product-card-element">
      <div className="d-flex">
        <div className={`${Styles.productimage} col-4`} style={{ flex: "40% 1" }}>
          {product?.data?.imgSrc?.length > 0 ? (
            <Slider data={product?.data?.imgSrc} />
          ) : (
            <Slider data={fakeProductSlider} />
          )}
        </div>
        <div className="col-8 ml-4 product-card-element-holder" style={{ flex: "60% 1" }}>
          <p style={{ textAlign: "start" }}>
            <b>BY</b>,{" "}
            <Link to={`/Brand/${product.data.ManufacturerId__c}`} className={Styles.brandHolder}>
              <b>{product?.data?.ManufacturerName__c}</b>
            </Link>
          </p>
          <h2 className={Styles.nameHolder}>{product?.data?.Name}</h2>
          <p className={Styles.priceHolder}>
            ${parseFloat(salesPrice).toFixed(2)}&nbsp;
            <span className={Styles.crossed}>{product?.data?.usdRetail__c}</span>
          </p>

          {product?.data?.Description && (
            <p className={Styles.descHolder}>
              {product.data.Description.length > 750 ? (
                isDescriptionExpanded ? (
                  product.data.Description
                ) : (
                  product.data.Description.substring(0, 750) + "..."
                )
              ) : (
                product.data.Description
              )}
              {product.data.Description.length > 750 && (
                <button
                  style={{ textDecoration: "underline" }}
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? "Learn Less" : "Learn More"}
                </button>
              )}
            </p>
          )}

          {accountId?.label && (
            <p className={Styles.descHolder}>
              Store For: <span>{accountId?.label}</span>
            </p>
          )}

          {orders[product?.data?.Id] ? (
            <div className="d-flex flex-column">
              <p style={{ textAlign: "start" }}>
                $
                <input
                  type="number"
                  className={Styles.priceInputHolder}
                  value={inputPrice}
                  placeholder={Number(inputPrice).toFixed(2)}
                  onChange={(e) => {
                    onPriceChangeHander(
                      product?.data,
                      e.target.value.slice(0, 4) || 0
                    );
                  }}
                  id="limit_input"
                  maxLength={4}
                  name="limit_input"
                />
              </p>

              <div className="d-flex gap-1">
                <QuantitySelector
                  min={product?.data?.Min_Order_QTY__c || 0}
                  value={orders[product?.data?.Id]?.quantity}
                  onChange={(quantity) => {
                    onQuantityChange(product?.data, quantity, inputPrice || parseFloat(salesPrice), discount);
                  }}
                />
                <button
                  className="ml-4"
                  onClick={() => onQuantityChange(product?.data, 0, inputPrice || parseFloat(salesPrice), discount)}
                >
                  <DeleteIcon fill="red" />
                </button>
              </div>

              <p className="mt-3" style={{ textAlign: "start" }}>
                Total: <b>{(inputPrice * orders[product?.data?.Id]?.quantity).toFixed(2)}</b>
              </p>
            </div>
          ) : accounts ? (
            accounts !== "load" ? (
              <Loading />
            ) : isAddtoCart && product?.discount ? (
              <button
                className={Styles.button}
                onClick={() =>
                  onQuantityChange(
                    product?.data,
                    product?.data?.Min_Order_QTY__c || 1,
                    inputPrice || parseFloat(salesPrice),
                    discount
                  )
                }
              >
                Add to cart
              </button>
            ) : (
              <Link className={Styles.button} to={"/my-retailers"}>
                Add to cart
              </Link>
            )
          ) : (
            <small className="text-left w-100 font-['Arial-400'] text-[#FF7F7F] d-block">
              You can't buy this product. Contact your Salesforce Admin.
            </small>
          )}

          <hr style={{ borderTop: "3px dashed #000" }} />

          {product?.data?.ProductCode && (
            <p className={Styles.descHolder}>
              Product Code: <span>{product?.data?.ProductCode}</span>
            </p>
          )}

          {product?.data?.ProductUPC__c && (
            <p className={Styles.descHolder}>
              Product UPC: <span>{product?.data?.ProductUPC__c}</span>
            </p>
          )}

          {product?.data?.Min_Order_QTY__c && (
            <p className={Styles.descHolder}>
              Min Order QTY: <span>{product?.data?.Min_Order_QTY__c}</span>
            </p>
          )}

          {product?.data?.Category__c && (
            <p className={Styles.descHolder}>
              Category: <span>{product?.data?.Category__c}</span>
            </p>
          )}

          {product.data?.Collection__c && (
            <p className={Styles.descHolder}>
              Collection: <span>{product.data?.Collection__c}</span>
            </p>
          )}
        </div>
      </div>

      <hr />

      {product.data?.Full_Product_Description__c && (
        <p className={Styles.descHolder}>
          <span>Full Product Description:</span> {product.data?.Full_Product_Description__c}
        </p>
      )}

      {product.data?.Desired_Result__c && (
        <div
          className={Styles.descHolder}
          dangerouslySetInnerHTML={{ __html: `<span>Desired Result:</span> ${product.data?.Desired_Result__c}` }}
        />
      )}

      {product.data?.Key_Ingredients__c && (
        <p className={Styles.descHolder}>
          <span>Key Ingredients:</span> {product.data?.Key_Ingredients__c}
        </p>
      )}

      {product.data?.Full_Ingredients_List__c && (
        <p className={Styles.descHolder}>
          <span>Ingredients List:</span> {product.data?.Full_Ingredients_List__c}
        </p>
      )}

      {product.data?.Size_Volume_Weight__c && (
        <p className={Styles.descHolder}>
          <span>Size (Volume/Weight):</span> {product.data?.Size_Volume_Weight__c}
        </p>
      )}

      {product.data?.Skin_Tone__c && (
        <p className={Styles.descHolder}>
          <span>Skin Tone:</span> {product.data?.Skin_Tone__c}
        </p>
      )}

      {product.data?.Skin_Type__c && (
        <p className={Styles.descHolder}>
          <span>Skin Type:</span> {product.data?.Skin_Type__c}
        </p>
      )}

      {product.data?.Sun_Protection__c && (
        <p className={Styles.descHolder}>
          <span>Sun Protection:</span> {product.data?.Sun_Protection__c}
        </p>
      )}
    </div>
  );
};

export default ProductDetailCard;
