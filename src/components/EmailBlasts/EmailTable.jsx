import { useState } from "react"
import { DateConvert, deleteEmailBlast, resentEmailBlast, resetEmailBlast } from "../../lib/store"
import SettingNotify from "./SettingNotify"
import Styles from "./index.module.css"
import { BiAddToQueue, BiBoltCircle, BiEraser, BiMailSend, BiRefresh } from "react-icons/bi"
import ModalPage from "../Modal UI"

const EmailTable = ({ data, setSetting, setting, setSearchValue, checkIdObj, notifyDate, getDataHandler, setCurrentPage, setContactList }) => {
    const { checkId, setCheckId, checked, checkedAll } = checkIdObj
    const [alert, setAlert] = useState(false)
    const [emailHtml, setEmailHtml] = useState(null);
    const [mailSend, setMailSend] = useState(false)
    const resentHandler = () => {
        if (checkId.length) {
            setContactList({ isLoaded: false, data: [] })
            resetEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((res) => {
                console.log({ res });
                resentEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((result) => {
                    setMailSend(true);
                    // getDataHandler()
                }).catch((err1) => {
                    console.log({ err1 });
                })
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            setAlert(true)
        }
    }
    const deleteHandler = () => {
        if (checkId.length) {
            setContactList({ isLoaded: false, data: [] })
            deleteEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((res) => {
                getDataHandler()
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            setAlert(true)
        }
    }

    const addtoqueue = () => {
        if (checkId.length) {
            setContactList({ isLoaded: false, data: [] })
            resetEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((res) => {
                getDataHandler()
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            setAlert(true)
        }
    }
    // console.log({aaa:emailHtml.split("?oauth_token="),ll:"00D30000001G9fh!AQEAQArkQiPdzqws050dRLspTi38Vyo_JOY0ZHZ5uuQYJ_BZyDWSKniMFCCOIQvIbTMRzhsCEC_dlWR1tNodrQ7e5pL5_oAV".length});

    return (
        <div>
            <ModalPage
                open={alert}
                content={
                    <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                        <h2 className={`${Styles.warning} `}>Empty Selection</h2>
                        <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                            please select some value.
                        </p>
                        <div className="d-flex justify-content-around ">
                            <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setAlert(false)}>
                                Ok
                            </button>
                        </div>
                    </div>
                }
                onClose={() => {
                    setAlert(false);
                }}
            />
            <ModalPage
                open={mailSend}
                content={
                    <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                        <h2 className={`${Styles.warning} `}>Mail Send.</h2>
                        <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                            Mail Send to Selected Contact. Please refresh list to get queue data.
                        </p>
                        <div className="d-flex justify-content-around ">
                            <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setMailSend(false)}>
                                Ok
                            </button>
                        </div>
                    </div>
                }
                onClose={() => {
                    setMailSend(false);
                }}
            />
            <ModalPage
                open={emailHtml ? true : false}
                content={
                    <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                        <h2 className={`${Styles.warning} `}>Email Content</h2>
                        <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                            <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
                        </p>
                        <div className="d-flex justify-content-around ">
                            <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setEmailHtml(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                }
                onClose={() => {
                    setEmailHtml(null);
                }}
            />
            {setting ? <SettingNotify setSetting={setSetting} notifyDate={notifyDate} getDataHandler={getDataHandler} /> :
                <>
                    <div style={{ position: 'sticky', top: '150px', background: '#ffffff', padding: '2px 0' }}>
                        <div className={Styles.titleHolder} style={{ marginBottom: '0px' }}><h2>NewLetter List</h2><div className="d-flex"><div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setSetting(true) }}><BiBoltCircle />&nbsp;Setting</div></div></div>
                        <div className="d-flex justify-content-between align-items-center" style={{ margin: '4px 0 27px 0' }}>
                            <div className="d-flex">
                                <label for="ALL" className={Styles.checkAllHolder} title="Click to select All"><input type="checkbox" onClick={(e) => { checkedAll(!checked) }} id="ALL" /></label>
                                <div className={Styles.checkAllHolder} onClick={() => { setContactList({ isLoaded: false, data: [] }); getDataHandler() }}>
                                    <BiRefresh size={23} title="refersh list" />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { addtoqueue() }}>
                                    <BiAddToQueue size={23} title="add to queue" />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { resentHandler() }}>
                                    <BiMailSend title="resend mail to selected" size={23} />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { deleteHandler() }}>
                                    <BiEraser size={23} title={'delete selected rows'} />
                                </div>
                            </div>
                            <input type="text" autoComplete="off" placeholder="Search Contacts" className={Styles.searchBox} onKeyUp={(e) => { setSearchValue(e.target.value); setCurrentPage(1) }} />
                        </div>
                    </div>
                    <table style={{ width: '100%' }}>
                        <thead className={Styles.table} style={{ position: 'sticky',top:'265px'}}>
                            <tr>
                                <th style={{ width: '200px' }}>Account Name</th>
                                <th style={{ width: '200px' }}>Brand Name</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((contact, index) => {
                                return (
                                    <tr key={index} className={Styles.tableRow}>
                                        <td style={{ width: '200px' }}>
                                            <label for={contact.id} style={{ cursor: "pointer" }} title="Click to select">
                                                <input type="checkbox" checked={checkId.includes(contact.id) ? true : false} className={checkId.includes(contact.id) ? Styles.checked : Styles.unChecked} onChange={() => { checkId.includes(contact.id) ? setCheckId(checkId.filter((value) => value !== contact.id)) : setCheckId([...checkId, contact.id]); }} name="contact" id={contact.id} />
                                                &nbsp;{contact.Account}
                                            </label>
                                        </td>
                                        <td style={{ width: '200px' }}>{contact.Brands.length > 50 ? contact.Brands.slice(0, 50) + "..." : contact.Brands}</td>
                                        <td>{contact.ContactName}</td>
                                        <td>{contact.ContactEmail}</td>
                                        <td>{DateConvert(contact.Date, true)}</td>
                                        <td>{contact.mailStatus == 1 ? <p onClick={() => { setEmailHtml(contact.body) }} className="bg-[#90EE90] text-center rounded-lg text-[#ffffff] text-sm cursor">Send</p> : contact.mailStatus == 2 ? <p onClick={() => { setEmailHtml(contact.body) }} className="bg-[#FF474C] text-center rounded-lg text-[#ffffff] text-sm">Failed</p> : <p onClick={() => { setEmailHtml(contact.body) }} className="bg-[#FFFFED] text-center rounded-lg text-[#000] text-sm/[13px]">Not Send</p>}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table></>}</div>)

}
export default EmailTable