import { BiDownload } from "react-icons/bi";
import Styles from "./index.module.css";
import { GetAuthData, generateAuditTemplate, originAPi } from "../../lib/store";
import { useState } from "react";
import Loading from "../Loading";

const StoreDetailCard = ({ account }) => {
    let [fileDownload, setLoader] = useState(false)
    const bgColors = {
        "Kevyn Aucoin Cosmetics": "KevynAucoinCosmeticsBg",
        "Bumble and Bumble": "BumbleandBumbleBg",
        "BY TERRY": "BYTERRYBg",
        "Bobbi Brown": "BobbiBrownBg",
        "ReVive": "ReViveBg",
        "Maison Margiela": "MaisonMargielaBg",
        "Smashbox": "SmashboxBg",
        "RMS Beauty": "RMSBeautyBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "AERIN": "RMSBeautyBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "ESTEE LAUDER": "esteeLauderBg",
        "ESTEE LAUDER": "esteeLauderBg",
    };
    let bgColor = ["KevynAucoinCosmeticsBg", "BumbleandBumbleBg", "BYTERRYBg", "BobbiBrownBg", "ReViveBg", "MaisonMargielaBg", "SmashboxBg", "RMSBeautyBg"]
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }


    const AuditHandler = (brandId, accountName, brandName) => {
        setLoader(true)
        GetAuthData().then((user) => {
            generateAuditTemplate({ key: user.x_access_token, Ids: JSON.stringify([account.Id]), brandId }).then((res) => {
                if (res) {
                    let account = Object.keys(res)
                    let brand = Object.keys(res[account[0]])
                    let url = res[account[0]][brand[0]];
                    const a = document.createElement('a');
                    var date_time = new Date();
                    a.href = originAPi + "/files" + url + '/Audit' + accountName + '`s ' + brandName + ' ' + date_time + '.pdf/index'
                    a.click();
                    setLoader(false)
                }
            }).catch((err) => {
                console.log({ err });
            })
        }).catch((userErr) => {
            console.log({ userErr });
        })
    }
    return (<section className={Styles.container}>
        {fileDownload ? <Loading /> :
            <div className={Styles.sectionHolder}>
                <h1 className={Styles.titleHolder} style={{ marginBottom: 0 }}>{account.Name} | {account.BillingCity}, {account.BillingState}</h1>
                <hr style={{ marginBottom: '2rem' }} />
                <div className="d-flex justify-content-between align-items-start">
                    <div style={{ width: '60%', border: '1px solid #ccc', padding: '1rem', background: '#ecfbff', borderRadius: '10px' }}>
                        <h1 className={Styles.titleHolder} style={{ textAlign: 'start', textDecoration: 'underline' }}>Account Info</h1>
                        <div className={Styles.bullets}>
                            <b>
                                Billing Address:
                            </b>
                            <p>
                                {account.BillingAddress.street},{account.BillingAddress.city}<br />
                                {account.BillingAddress.state},{account.BillingAddress.country} {account.BillingAddress.postalCode}
                            </p>
                        </div>
                        <div className={Styles.bullets}>
                            <b>
                                Shipping Address:
                            </b>
                            <p>
                                {account.ShippingAddress.street},{account.ShippingAddress.city}<br />
                                {account.ShippingAddress.state},{account.ShippingAddress.country} {account.ShippingAddress.postalCode}
                            </p>
                        </div>
                        <div className={Styles.bullets}>
                            <b>
                                Business Type:
                            </b>
                            <p>
                                {account.Type_of_Business__c}
                            </p>
                        </div>
                        {account.Display_or_Assortment__c &&
                            <div className={Styles.bullets}>
                                <b>
                                    Display & Assortment:
                                </b>
                                <p>
                                    {account.Display_or_Assortment__c}
                                </p>
                            </div>}
                    </div>
                    <div style={{ width: '35%', border: '1px solid #ccc', borderRadius: '10px', background: '#fff', maxHeight: '55vh', overflowY: 'scroll' }}>
                        <h1 className={Styles.titleHolder} style={{ margin: '1rem 0 1rem 2rem', textAlign: 'start', textDecoration: 'underline' }}>Audit Report</h1>
                        <div className={Styles.brandGrid} style={{ width: '80%', margin: '0 auto 1rem' }}>
                            {account.Brands && account.Brands.length > 0 && account.Brands.map((brand) => (
                                <>
                                    <div className={Styles.cardHolder}><div className={Styles.badge} title="Click to download audit report" onClick={() => { AuditHandler(brand.ManufacturerId__c, account.Name, brand.ManufacturerName__c) }}>
                                        <BiDownload color="#fff" />
                                    </div>
                                        <div>
                                            <p className={Styles.textHolder}>{brand.ManufacturerName__c}</p>
                                            <h1 className={Styles.countHolder}>
                                                <small style={{ fontSize: '11px' }}>Sale</small>{" "}
                                                NA</h1>
                                            <h1 className={Styles.countHolder}>
                                                <small style={{ fontSize: '11px' }}>Target</small>{" "}
                                                NA</h1>
                                            <h1 className={Styles.countHolder}>
                                                <small style={{ fontSize: '11px' }}>Orders</small>{" "}
                                                NA</h1>
                                            <h1 className={Styles.countHolder}>
                                                <small style={{ fontSize: '11px' }}>Retail No.</small>{" "}
                                                NA</h1>
                                            <h1 className={Styles.countHolder}>
                                                <small style={{ fontSize: '11px' }}>Pre Order</small>{" "}
                                                NA</h1>
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>}
    </section>)
}
export default StoreDetailCard;