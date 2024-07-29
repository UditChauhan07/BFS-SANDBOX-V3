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


                <div className="d-flex align-items-center justify-content-between gap-5" style={{ width: "100%", border: '0px 0px 1px 0px', borderBottom: "2px solid #D3D3D3", backgroundColor: "#F8F8F8", padding: "2rem", }}>
                    <div className="" style={{ width: '25%' }}>
                        <p className={Styles.AccountName}>ACCOUNT NAME</p>
                        <div className="d-flex align-items-center justify-content-between ">
                            <h4 className={Styles.ApothecaryBeauty}>APOTHECARY BEAUTY</h4>

                            <img src="/assets/images/image51.png" alt="Apothecary Beauty" />
                        </div>
                        <p className={Styles.Websitelink}>WWW.apothecarybeauty.com</p>

                        <div className="d-flex align-items-center justify-content-between"   >
                            <button className={Styles.AccountDetailsButton} >Account Details</button>

                            <p style={{ fontFamily: "Arial", fontFamily: '500', fontSize: "16px", lineHeight: "18.03px", letterSpacing: '1.12px', marginTop: "10%" }}>More info </p>
                        </div>
                    </div>

                    <div className="" style={{ width: '50%' }}>
                        <div className="d-flex align-items-center justify-content-between ">
                            <div className={Styles.storeCtiy}>
                                <p>Store City</p>
                                <small style={{ fontWeight: "500", fontSize: '16px', fontFamily: "Arial", lineHeight: '18.03', letterSpacing: '10%', width: '166px', height: "30px", }}>Rolling Hills Estate</small>

                            </div>
                            <div>2</div>
                            <div>3</div>

                        </div>

                    </div>
                    <div className="" style={{ width: '25%' }}>
                        <h1>hello</h1>
                    </div>
                    </div>
                    {/* .................... */}
                    <div className="d-flex align-items-center justify-content-between gap-5 col-lg-12" style={{ width: "100%", border: '0px 0px 1px 0px', borderBottom: "2px solid #D3D3D3", backgroundColor: "#F8F8F8", padding: "2rem", }}>
                    <div className="col-lg-3" >
                        <p className={Styles.AccountName}>ACCOUNT NAME</p>
                        <div className="d-flex align-items-center justify-content-between ">
                            <h4 className={Styles.ApothecaryBeauty}>APOTHECARY BEAUTY</h4>

                            <img src="/assets/images/image51.png" alt="Apothecary Beauty" />
                        </div>
                        <p className={Styles.Websitelink}>WWW.apothecarybeauty.com</p>

                        <div className="d-flex align-items-center justify-content-between"   >
                            <button className={Styles.AccountDetailsButton} >Account Details</button>

                            <p style={{ fontFamily: "Arial", fontFamily: '500', fontSize: "16px", lineHeight: "18.03px", letterSpacing: '1.12px', marginTop: "10%" }}>More info </p>
                        </div>
                    </div>

                    <div className="col-lg-6" >
                        <div className="d-flex align-items-center justify-content-between ">
                            <div className={Styles.storeCtiy}>
                                <p className={Styles.City}>Store City</p>
                                <small className={Styles.RollingHills} >Rolling Hills Estate</small>

                            </div>
                            <div  className={Styles.storeCtiy}>
                            <p className={Styles.City}>Store City</p>
                            <small className={Styles.RollingHills} >Rolling Hills Estate</small>
                            </div>

                            <div  className={Styles.storeCtiy}>
                            <sup className={Styles.City}>Store City</sup>
                            <sub className={Styles.RollingHills} >Rolling Hills Estate</sub>

                            </div>

                        </div>

                    </div>
                    <div className="col-lg-3" >
                        <h1>hello</h1>
                    </div>
                    </div>
             </div>
        }
    </section>)
}
export default StoreDetailCard;