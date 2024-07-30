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
                {/* .................... */}
                <div style={{ width: "100%", border: '0px 0px 1px 0px', borderBottom: "2px solid #D3D3D3", backgroundColor: "#F8F8F8", padding: "2rem", }}>


                    <div className="d-flex align-items-center justify-content-between gap-5 col-lg-12 " >
                        <div className="col-lg-3" >
                            <p className={Styles.AccountName}>ACCOUNT NAME</p>
                            <div className="d-flex align-items-center justify-content-between ">
                                <h4 className={Styles.ApothecaryBeauty}>APOTHECARY BEAUTY</h4>

                                <img src="/assets/images/image51.png" alt="Apothecary Beauty" />
                            </div>
                            <p className={Styles.Websitelink}>WWW.apothecarybeauty.com</p>


                        </div>


                        <div className="col-lg-6" >
                            <div className="d-flex align-items-center justify-content-between gap-2 " style={{ width: "60" }}>
                                <div className={Styles.storeCtiy} style={{ width: "20" }}>
                                    <sup className={Styles.City}>Store City</sup>
                                    <small className={Styles.RollingHills} >Rolling Hills Estate</small>

                                </div>
                                <div className={Styles.storeCtiy1} style={{ width: "20" }}>
                                    <p className={Styles.City}>Store State</p>
                                    <small className={Styles.RollingHills} >CA</small>
                                </div>

                                <div className={Styles.storeCtiy2} style={{ width: "20" }}>
                                    <p className={Styles.City}>Phone</p>
                                    <small className={Styles.RollingHills} >(310) 541-5500</small>

                                </div>

                            </div>

                        </div>
                        <div className="col-lg-3" >
                            <p className={Styles.TotalRevenue}>Total Revenue</p>
                            <h5 className={Styles.price}>$2195.85</h5>
                        </div>
                    </div>


                    <div className="d-flex align-items-center justify-content-between gap-5 col-lg-12 ">
                        <div className="col-lg-3" >
                            <div className="d-flex align-items-center justify-content-between gap-5"   >
                                <button className={Styles.AccountDetailsButton} >Account Details</button>

                                <p style={{ fontFamily: "Arial", fontFamily: '500', fontSize: "16px", lineHeight: "18.03px", letterSpacing: '1.12px', marginTop: "10%" }}>More info </p>

                            </div>


                        </div>

                        <hr className="HrLIne"></hr>
                        <div className="col-lg-8" >
                            <div className="d-flex align-items-center justify-content-between ">
                                <h5 className="AuditReport">Brand Audit Report</h5>


                            </div>

                        </div>


                    </div>
                </div>
                <div style={{ width: "100%", border: '0px 0px 1px 0px', borderBottom: "2px solid #D3D3D3", backgroundColor: "#F8F8F8", padding: "2rem", }}>
                    <h5 className="">Details</h5>
                    <div className="d-flex align-items-center justify-content-between gap-5 col-lg-12 " >
                        <div className="col-lg-3 mt-4" >
                            <button className={Styles.StatusActive} >Status: Active</button>
                        <div className="d-flex align-items-center justify-content-between ">
                                <h4 className={Styles.DSXContent}>DSX-0001</h4>

                            
                            </div>
                            <p className={Styles.Launder}>Estee Launder Account Name</p> 


                        </div>
                        {/* <div className="vl"></div> */}

                        <div className="col-lg-3" style={{ width: "60" }}>
                           
                            <div className="d-flex align-items-center justify-content-between gap-2 " >
                                <div style={{ width: "20" }}>
                                    <span className={Styles .AccountOwner} style={{fontSize:"16px",letterSpacing:"1.12px",fontFamily:"Montserrat",fontWeight:'400' }}>Account Owner :</span>
                                    <span className={Styles.APIUser} style={{fontSize:"16px",letterSpacing:"1.12px",fontFamily:"Arial",fontWeight:'500' }} >API User</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center justify-content-between gap-2 " >
                                <div  style={{ width: "20" }}>
                                <span className={Styles .AccountOwner} style={{fontSize:"16px",letterSpacing:"1.12px",fontFamily:"Montserrat",fontWeight:'400' }}>Number of <br/>Order Placed: :</span>
                                <span className={Styles.APIUser} style={{fontSize:"16px",letterSpacing:"1.12px",fontFamily:"Arial",fontWeight:'500' }} >14</span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between gap-2 " >
                                <div className={Styles.storeCtiy} style={{ width: "20" }}>
                                    <sup className={Styles.City}>Store City</sup>
                                    <small className={Styles.RollingHills} >Rolling Hills Estate</small>
                                    </div>
                                </div>

                       

                        </div>
                        <div className="col-lg-3" >
                            <p className={Styles.TotalRevenue}>Total Revenue</p>
                            <h5 className={Styles.price}>$2195.85</h5>
                        </div>
                        <div className="col-lg-3" >
                            <p className={Styles.TotalRevenue}>Total Revenue</p>
                            <h5 className={Styles.price}>$2195.85</h5>
                        </div>
                    </div>


                    {/* <div className="d-flex align-items-center justify-content-between gap-5 col-lg-12 ">
                        <div className="col-lg-3" >
                            <div className="d-flex align-items-center justify-content-between gap-5"   >
                                <button className={Styles.AccountDetailsButton} >Account Details</button>

                                <p style={{ fontFamily: "Arial", fontFamily: '500', fontSize: "16px", lineHeight: "18.03px", letterSpacing: '1.12px', marginTop: "10%" }}>More info </p>

                            </div>


                        </div>

                        <hr className="HrLIne"></hr>
                        <div className="col-lg-8" >
                            <div className="d-flex align-items-center justify-content-between ">
                                <h5 className="AuditReport">Brand Audit Report</h5>


                            </div>

                        </div>


                    </div> */}

                </div>
            </div>
        }
    </section>)
}
export default StoreDetailCard;