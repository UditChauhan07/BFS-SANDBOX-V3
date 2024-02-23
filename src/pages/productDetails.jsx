import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useEffect, useState } from "react";
import { GetAuthData, getProductDetails, getProductImage, getProductImageAll } from "../lib/store";
import Loading from "../components/Loading";
import QuantitySelector from "../components/BrandDetails/Accordion/QuantitySelector";
import { useBag } from "../context/BagContext";
import ModalPage from "../components/Modal UI";
import { DeleteIcon } from "../lib/svg";

const ProductDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location || {};
    const { orders, setOrders, setOrderQuantity, addOrder, setOrderProductPrice } = useBag();
    const [product, setProduct] = useState({ isLoaded: false, data: [], discount: {} });
    const [replaceCartModalOpen, setReplaceCartModalOpen] = useState(false);
    const [replaceCartProduct, setReplaceCartProduct] = useState({});


    useEffect(() => {
        if (state?.productId) {
            GetAuthData().then((user) => {
                let rawData = { productId: state.productId, key: user.x_access_token, salesRepId: user?.Sales_Rep__c, accountId: localStorage.getItem("AccountId__c") }
                getProductDetails({ rawData }).then((productRes) => {
                        setProduct({ isLoaded: true, data: productRes.data, discount: productRes.discount })
                }).catch((proErr) => {
                    console.log({ proErr });
                })
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            navigate('/product');
        }
    }, [])
    console.log({product});

    const orderSetting = (element, quantity) => {
        setReplaceCartModalOpen(false);
        addOrder(element, quantity, product.discount);
    };
    const onQuantityChange = (element, quantity, salesPrice = null, discount = null) => {
        element.salesPrice = salesPrice;
        if (Object.values(orders).length) {
            if (
                Object.values(orders)[0]?.manufacturer?.name === localStorage.getItem("manufacturer") &&
                Object.values(orders)[0].account.name === localStorage.getItem("Account") &&
                Object.values(orders)[0].productType === (element.Category__c === "PREORDER" ? "pre-order" : "wholesale")
            ) {
                orderSetting(element, quantity);
                setReplaceCartModalOpen(false);
            } else {
                setReplaceCartModalOpen(true);
                setReplaceCartProduct({ element, quantity });
            }
        } else {
            orderSetting(element, quantity);
        }
    };
    let listPrice = Number(product?.data?.usdRetail__c?.replace('$', '').replace(',', ''));
    let salesPrice = 0;
    let discount = product?.discount?.margin;
    let inputPrice = Object.values(orders)?.find((order) => order.product.Id === product?.data?.Id && order.manufacturer.name === product?.data?.ManufacturerName__c && order.account.name === localStorage.getItem("Account"))?.product?.salesPrice;
    if (product?.data?.Category__c === "TESTER") {
        discount = product?.discount?.testerMargin
        salesPrice = (+listPrice - (product?.discount?.testerMargin / 100) * +listPrice).toFixed(2)
    } else if (product?.data?.Category__c === "Samples") {
        discount = product?.discount?.sample
        salesPrice = (+listPrice - (product?.discount?.sample / 100) * +listPrice).toFixed(2)
    } else {
        salesPrice = (+listPrice - (product?.discount?.margin / 100) * +listPrice).toFixed(2)
    }
    const onPriceChangeHander = (element, price = '0') => {
        if (price == '') price = 0;
        setOrderProductPrice(element, price)
    }
    const replaceCart = () => {
        console.log({ aa: replaceCartProduct.product });
        return;
        localStorage.removeItem("orders");
        setReplaceCartModalOpen(false);
        setOrderQuantity(0);
        setOrders({});
        addOrder(replaceCartProduct.product, replaceCartProduct.quantity, product.discount);
    };
    let styles = {}
    let orderofThisProduct = orders[product?.data?.Id];
    if (orderofThisProduct?.manufacturer?.name == product?.data?.ManufacturerName__c && orderofThisProduct?.account?.name == localStorage.getItem("Account")) {
        console.log({ price: orderofThisProduct.product.salesPrice });
    }
    console.log({ orderofThisProduct, manuCheck: orderofThisProduct?.manufacturer?.name == product?.data?.ManufacturerName__c, accountCheck: orderofThisProduct?.account?.name == localStorage.getItem("Account") });
    return (
        <AppLayout>
            {replaceCartModalOpen ? (
                <ModalPage
                    open
                    content={
                        <div className="d-flex flex-column gap-3">
                            <h2 className={`${styles.warning} `}>Warning</h2>
                            <p className={`${styles.warningContent} `}>
                                Adding this item will replace <br></br> your current cart
                            </p>
                            <div className="d-flex justify-content-around ">
                                <button className={`${styles.modalButton}`} onClick={replaceCart}>
                                    OK
                                </button>
                                <button className={`${styles.modalButton}`} onClick={() => setReplaceCartModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    }
                    onClose={() => {
                        setReplaceCartModalOpen(false);
                    }}
                />
            ) : null}
            {!product?.isLoaded ? <Loading /> :
                <div>
                    {product?.data?.imgSrc.length>0&&product?.data?.imgSrc.map(element=><img src={element.ContentDownloadUrl} />)}
                    <p>Product Name: {product?.data?.Name},</p>
                    <p>Product Code Number: {product?.data?.ProductCode},</p>
                    <p>Product UPC Number: {product?.data?.ProductUPC__c},</p>
                    <p>Product Description: {product?.data?.Description},</p>
                    {product.data?.Full_Product_Description__c && <p>Product Full Description: {product.data?.Full_Product_Description__c}</p>}
                    {product.data?.Desired_Result__c && <div dangerouslySetInnerHTML={{ __html: `Product Desired Result: ${product.data?.Desired_Result__c}` }} />}
                    {product.data?.Key_Ingredients__c && <p>Product Basic Ingredients List: {product.data?.Key_Ingredients__c}</p>}
                    {product.data?.Full_Ingredients_List__c && <p>Product Full Ingredients List: {product.data?.Full_Ingredients_List__c}</p>}
                    <p>Product Price: {product?.data?.usdRetail__c},</p>
                    <p>Product Min Qty to buy: {product?.data?.Min_Order_QTY__c},</p>
                    {product.data?.Size_Volume_Weight__c && <p>Product Weight: {product.data?.Size_Volume_Weight__c}</p>}
                    {product.data?.Skin_Tone__c && <p>Product Tone: {product.data?.Skin_Tone__c}</p>}
                    {product.data?.Skin_Type__c && <p>Product Type: {product.data?.Skin_Type__c}</p>}
                    {product.data?.Travel_or_Full_Size__c && <p>Product Size: {product.data?.Travel_or_Full_Size__c}</p>}
                    <p>Product Category: {product?.data?.Category__c},</p>
                    {product.data?.Collection__c && <p>Product Collection: {product.data?.Collection__c}</p>}
                    <p>Product Manufacturer Name: {product?.data?.ManufacturerName__c},</p>
                    <p>Product Newness Name: {product?.data?.Newness_Alias__c},</p>
                    <p>Product Season: {product?.data?.Season__c},</p>
                    <p>Product Create Date: {product?.data?.CreatedDate},</p>
                    <p>Product Launch Date: {product?.data?.Launch_Date__c},</p>
                    <p>Product Ship Date: {product?.data?.Ship_Date__c},</p>
                    <p>Product Edit Date: {product?.data?.LastModifiedDate},</p>
                    {(product.data?.Point_of_difference_1__c||product.data?.Point_of_difference_2__c||product.data?.Point_of_difference_3__c) && <p>Point of Difference: <ol>
                        {product.data?.Point_of_difference_1__c&&<li>{product.data?.Point_of_difference_1__c}</li>}
                        {product.data?.Point_of_difference_2__c&&<li>{product.data?.Point_of_difference_2__c}</li>}
                        {product.data?.Point_of_difference_3__c&&<li>{product.data?.Point_of_difference_3__c}</li>}
                        </ol></p>}
                        {product.data?.Usage_and_Application_Tips__c && <p>Usages Tups: {product.data?.Usage_and_Application_Tips__c}
                        <ol>
                        {product.data?.Use_it_with_Option_1__c&&<li>{product.data?.Use_it_with_Option_1__c}</li>}
                        {product.data?.Use_it_with_Option_2__c&&<li>{product.data?.Use_it_with_Option_2__c}</li>}
                        {product.data?.Use_it_with_Option_3__c&&<li>{product.data?.Use_it_with_Option_3__c}</li>}
                        </ol>
                        </p>}
                    {orders[product?.data?.Id] ?
                        <>
                            <p><input type="number" value={inputPrice} placeholder={Number(inputPrice).toFixed(2)}
                                onChange={(e) => { onPriceChangeHander(product?.data, e.target.value < 10 ? e.target.value.replace("0", "").slice(0, 4) : e.target.value.slice(0, 4) || 0) }} id="limit_input" minLength={0} maxLength={4}
                                name="limit_input" /></p>
                            <QuantitySelector min={product?.data?.Min_Order_QTY__c || 0} value={orders[product?.data?.Id]?.quantity} onChange={(quantity) => {
                                onQuantityChange(product?.data, quantity, inputPrice || parseFloat(salesPrice), discount);
                            }} />
                            <p>Total: <b>{inputPrice * orders[product?.data?.Id]?.quantity}</b></p>
                            <button onClick={() => onQuantityChange(product?.data, 0, inputPrice || parseFloat(salesPrice), discount)}><DeleteIcon /></button>
                        </> :
                        <button onClick={() => onQuantityChange(product?.data, product?.data?.Min_Order_QTY__c || 1, inputPrice || parseFloat(salesPrice), discount)}>Add to cart</button>}
                </div>}
        </AppLayout>
    );
};
export default ProductDetails;