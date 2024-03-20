import Styles from "./Styles.module.css";
import { DeleteIcon } from "../../lib/svg";
import QuantitySelector from "../BrandDetails/Accordion/QuantitySelector";
import Slider from "../../utilities/Slider";

import { Link } from "react-router-dom";
const ProductDetailCard = ({ product, orders, onPriceChangeHander = null, onQuantityChange = null, isAddtoCart, AccountId }) => {
    if (!product) {
        return null;
    }
    let listPrice = Number(product?.data?.usdRetail__c?.replace('$', '').replace(',', ''));
    let salesPrice = 0;
    let discount = product?.discount?.margin;
    let inputPrice = Object.values(orders)?.find((order) => order.product.Id === product?.data?.Id && order.manufacturer.name === product?.data?.ManufacturerName__c && order.account.id === AccountId)?.product?.salesPrice;
    if (product?.data?.Category__c === "TESTER") {
        discount = product?.discount?.testerMargin
        salesPrice = (+listPrice - (product?.discount?.testerMargin / 100) * +listPrice).toFixed(2)
    } else if (product?.data?.Category__c === "Samples") {
        discount = product?.discount?.sample
        salesPrice = (+listPrice - (product?.discount?.sample / 100) * +listPrice).toFixed(2)
    } else {
        salesPrice = (+listPrice - (product?.discount?.margin / 100) * +listPrice).toFixed(2)
    }
    let fakeProductSlider = [
        { icon: "<svg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 122.88 114.58'><title>product</title><path d='M118.13,9.54a3.25,3.25,0,0,1,2.2.41,3.28,3.28,0,0,1,2,3l.57,78.83a3.29,3.29,0,0,1-1.59,3L89.12,113.93a3.29,3.29,0,0,1-2,.65,3.07,3.07,0,0,1-.53,0L3.11,105.25A3.28,3.28,0,0,1,0,102V21.78H0A3.28,3.28,0,0,1,2,18.7L43.89.27h0A3.19,3.19,0,0,1,45.63,0l72.5,9.51Zm-37.26,1.7-24.67,14,30.38,3.88,22.5-14.18-28.21-3.7Zm-29,20L50.75,64.62,38.23,56.09,25.72,63.17l2.53-34.91L6.55,25.49V99.05l77.33,8.6V35.36l-32-4.09Zm-19.7-9.09L56.12,8,45.7,6.62,15.24,20l16.95,2.17ZM90.44,34.41v71.12l25.9-15.44-.52-71.68-25.38,16Z'/></svg>" }
    ]
    return (
        <div className="container mt-4 product-card-element">
            <div className="d-flex">
                <div className={`${Styles.productimage} col-4`}>
                    {product?.data?.imgSrc.length > 0 ? <Slider data={product?.data?.imgSrc} /> : <Slider data={fakeProductSlider} />}
                </div>
                <div className="col-8 ml-4 product-card-element-holder" >
                   <p style={{ textAlign: 'start' }}><b>By</b>, <b>{product?.data?.ManufacturerName__c}</b></p>
                   <h2 style={{ textAlign: 'start' }}><b>{product?.data?.Name}</b></h2>
                   {product?.discount ? <p style={{ textAlign: 'start',color:"black" }}><span className={Styles.crossed}>{product?.data?.usdRetail__c}</span>&nbsp;${salesPrice}</p> : <p style={{ textAlign: 'start' }}><b>{product?.data?.usdRetail__c}</b></p>}
                   {product?.data?.Description && <p style={{ textAlign: 'start',color:"#898989" }}>{product?.data?.Description}</p>}
                   <hr style={{borderTop:"1px dashed ",fontSize:"20px", color:"black"}}></hr>
                    <p style={{ textAlign: 'start',color:"#898989" }}>Product Code: <b style={{color:"black"}}>{product?.data?.ProductCode}</b></p>
                    <p style={{ textAlign: 'start',color:"#898989"  }}>Product UPC: <b style={{color:"black"}}>{product?.data?.ProductUPC__c}</b></p>
                 <p style={{ textAlign: 'start',color:"#898989"  }}>Min Order QTY: <b style={{color:"black"}}>{product?.data?.Min_Order_QTY__c}</b></p>
                   {product?.data?.Category__c && <p style={{ textAlign: 'start',color:"#898989"  }}>Category: <b style={{color:"black"}}>{product?.data?.Category__c}</b></p>}
                    {product.data?.Collection__c && <p style={{ textAlign: 'start',color:"#898989"  }}>Collection: <b style={{color:"black"}}>{product.data?.Collection__c}</b></p>}
                    {(isAddtoCart && product?.discount) && <>
                    <div className="d-flex gap-4">
                        <QuantitySelector min={product?.data?.Min_Order_QTY__c || 0} value={orders[product?.data?.Id]?.quantity} onChange={(quantity) => {
                                        onQuantityChange(product?.data, quantity, inputPrice || parseFloat(salesPrice), discount);
                                    }} />
                        {orders[product?.data?.Id] ?
                            <>
                      <p style={{ textAlign: 'start' }}>$<input type="number" className={Styles.priceInputHolder} value={inputPrice} placeholder={Number(inputPrice).toFixed(2)}
                                    onChange={(e) => { onPriceChangeHander(product?.data, e.target.value < 10 ? e.target.value.replace("0", "").slice(0, 4) : e.target.value.slice(0, 4) || 0) }} id="limit_input" minLength={0} maxLength={4}
                                    name="limit_input" /></p>
                                <div className="d-flex">
                                    
                                    <button className="ml-4" onClick={() => onQuantityChange(product?.data, 0, inputPrice || parseFloat(salesPrice), discount)}><DeleteIcon fill="red" /></button>
                                </div>
                                <p className="mt-2" style={{ textAlign: 'start' }}>Total: <b>{inputPrice * orders[product?.data?.Id]?.quantity}</b></p>
                            </> :
                            <button className={Styles.button} onClick={() => onQuantityChange(product?.data, product?.data?.Min_Order_QTY__c || 1, inputPrice || parseFloat(salesPrice), discount)}>Add to cart</button>}
                            </div>
                    </>}
                </div>
            </div>
            <hr></hr>
            {(product.data?.Full_Product_Description__c && product.data?.Full_Product_Description__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Full Product Description:</b> {product.data?.Full_Product_Description__c}</p>}
            {(product.data?.Desired_Result__c && product.data?.Desired_Result__c != "N/A") && <div style={{ textAlign: 'start',color:"#898989" }} dangerouslySetInnerHTML={{ __html: `Desired Result: ${product.data?.Desired_Result__c}` }} />}
            {(product.data?.Key_Ingredients__c && product.data?.Key_Ingredients__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Key Ingredients:</b> {product.data?.Key_Ingredients__c}</p>}
            {(product.data?.Full_Ingredients_List__c && product.data?.Full_Ingredients_List__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}> <b style={{color:"black"}}>Ingredients List:</b> {product.data?.Full_Ingredients_List__c}</p>}
            {(product.data?.Size_Volume_Weight__c && product.data?.Size_Volume_Weight__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Size (Volume/Weight):</b> {product.data?.Size_Volume_Weight__c}</p>}
            {(product.data?.Skin_Tone__c && product.data?.Skin_Tone__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Skin Tone:</b> {product.data?.Skin_Tone__c}</p>}
            {(product.data?.Skin_Type__c && product.data?.Skin_Type__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Skin Type:</b> {product.data?.Skin_Type__c}</p>}
            {(product.data?.Travel_or_Full_Size__c && product.data?.Travel_or_Full_Size__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Product Size:</b> {product.data?.Travel_or_Full_Size__c}</p>}
            {(product?.data?.Newness_Alias__c && product.data?.Newness_Alias__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Product Newness Name:</b> {product?.data?.Newness_Alias__c}</p>}
            {(product?.data?.Newness_Start_Date__c && product.data?.Newness_Start_Date__c != "N/A") && <p style={{ textAlign: 'start' ,color:"#898989"}}><b style={{color:"black"}}>Product Newness Start Date:</b> {product?.data?.Newness_Start_Date__c}</p>}
            {(product?.data?.Newness_Report_End_Date__c && product.data?.Newness_Report_End_Date__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Product Newness End Date:</b> {product?.data?.Newness_Report_End_Date__c}</p>}
            {(product?.data?.Season__c && product.data?.Season__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Season:</b> {product?.data?.Season__c},</p>}
            {(product?.data?.CreatedDate && product.data?.CreatedDate != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Create Date:</b> {new Date(product?.data?.CreatedDate).toDateString()}</p>}
            {(product?.data?.Launch_Date__c && product.data?.Launch_Date__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Launch Date:</b> {product?.data?.Launch_Date__c}</p>}
            {(product?.data?.Ship_Date__c && product.data?.Ship_Date__c != "N/A") && <p style={{ textAlign: 'start',color:"#898989" }}><b style={{color:"black"}}>Ship Date:</b> {product?.data?.Ship_Date__c}</p>}
            {/* <p style={{ textAlign: 'start' }}>Product Edit Date: {new Date(product?.data?.LastModifiedDate).toDateString()},</p> */}
            {(product.data?.Point_of_difference_1__c || product.data?.Point_of_difference_2__c || product.data?.Point_of_difference_3__c) && <p style={{ textAlign: 'start',color:"#898989" }}><ol>
                {product.data?.Point_of_difference_1__c && <li>Point of difference #1: {product.data?.Point_of_difference_1__c}</li>}
                {product.data?.Point_of_difference_2__c && <li>Point of difference #2: {product.data?.Point_of_difference_2__c}</li>}
                {product.data?.Point_of_difference_3__c && <li>Point of difference #3: {product.data?.Point_of_difference_3__c}</li>}
            </ol></p>}
            {product.data?.Usage_and_Application_Tips__c && <p style={{ textAlign: 'start',color:"#898989" }}>{product.data?.Usage_and_Application_Tips__c}
                <ol>
                    {product.data?.Use_it_with_Option_1__c && <li>Use it with (Option #1): {product.data?.Use_it_with_Option_1__c}</li>}
                    {product.data?.Use_it_with_Option_2__c && <li>Use it with (Option #2): {product.data?.Use_it_with_Option_2__c}</li>}
                    {product.data?.Use_it_with_Option_3__c && <li>Use it with (Option #3): {product.data?.Use_it_with_Option_3__c}</li>}
                </ol>
            </p>}
        </div>
     
  );
};
export default ProductDetailCard;
