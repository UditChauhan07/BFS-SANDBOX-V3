import { useEffect, useState } from "react"
import { DateConvert, deleteEmailBlast, getEmailBody, resentEmailBlast, resetEmailBlast } from "../../lib/store"
import SettingNotify from "./SettingNotify"
import Styles from "./index.module.css"
import { BiAddToQueue, BiBoltCircle, BiCross, BiEraser, BiMailSend, BiRefresh, BiReset, BiTrash } from "react-icons/bi"
import ModalPage from "../Modal UI"

const EmailTable = ({ data, setSetting, setting, setSearchValue, checkIdObj, notifyDate, getDataHandler, setCurrentPage, setContactList, user }) => {
    const { checkId, setCheckId, checked, checkedAll } = checkIdObj
    const [alert, setAlert] = useState(false)
    const [emailHtml, setEmailHtml] = useState(null);
    const [mailSend, setMailSend] = useState(false)
    const [showBrands, setShowBrands] = useState();
    const [confirm, setConfirm] = useState(0);
    const resentHandler = () => {
        if (checkId.length) {
            setContactList({ isLoaded: false, data: [] })
            resetEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((res) => {
                resentEmailBlast({ key: "8XoSdoqMZ2dAiqh", ids: JSON.stringify(checkId) }).then((result) => {
                    setMailSend(true);
                    getDataHandler()
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

    useEffect(() => {
        if (emailHtml) {
            let temp = emailHtml?.replaceAll("{{token}}", user.x_access_token); // the-quick-brown-fox
            setEmailHtml(temp)
        }

    }, [emailHtml])
    const confirmHandler = () => {
        if (confirm == 1) {
            deleteHandler()
        } else if (confirm == 2) {
            addtoqueue()
        } else if (confirm == 3) {
            resentHandler()
        } else {}
        setConfirm(false)
    }
    const resetHandler = ()=>{
        let contactSearch = document.getElementById("contactSearch");
        contactSearch.value = null
        setSearchValue(null); setCurrentPage(1)
        setCheckId([])
    }
    const getEmailBodyHandler = (id)=>{
        getEmailBody({key:"8XoSdoqMZ2dAiqh",id:id}).then((result)=>{
            setEmailHtml(result.body)
        }).catch((err)=>{
            console.log({err});
        })
    }

    return (
        <div>
            <ModalPage
                open={confirm}
                content={<div className="d-flex flex-column gap-3"  style={{ maxWidth: '700px' }}>
                    <h2 className={`${Styles.warning} `}>Confirm</h2>
                    <p className={`${Styles.warningContent} `}>
                        Are you Sure you want to {confirm == 1 ? <b>Delete</b> : confirm == 2 ? <b>Add to Queue</b> : confirm == 3 ? <b>Re-send mail to</b> : null} selected contact?<br/> This action cannot be undone.
                    </p>
                    <div className="d-flex justify-content-around ">
                        <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => confirmHandler()}>
                            Yes
                        </button>
                        <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setConfirm(false)}>
                            No
                        </button>
                    </div>
                </div>}
                onClose={() => setConfirm(false)}
            />
            <ModalPage
                open={alert}
                content={
                    <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                        <h2 className={`${Styles.warning} `}>Empty Selection</h2>
                        <p className={`${Styles.warningContent} `} style={{ lineHeight: '22px' }}>
                            Please select any contact.
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
                styles={{width:'calc(100% - 100px)',maxWidth:'1200px'}}
                content={
                    <div className="d-flex flex-column gap-3">
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
                    <div style={{ position: 'sticky', top: '150px', background: '#ffffff', padding: '2px 0', zIndex: 1 }}>
                        <div className={Styles.titleHolder} style={{ marginBottom: '0px' }}><h2>NewLetter List</h2><div className="d-flex"><div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setSetting(true) }}><BiBoltCircle />&nbsp;Setting</div></div></div>
                        <div className="d-flex justify-content-between align-items-center" style={{ margin: '4px 0 27px 0' }}>
                            <div className="d-flex">
                                <label for="ALL" className={Styles.checkAllHolder} title="Click to select All"><input type="checkbox" onClick={(e) => { checkedAll(!checked) }} id="ALL" /></label>
                                <div className={Styles.checkAllHolder} onClick={() => { setContactList({ isLoaded: false, data: [] }); getDataHandler() }}>
                                    <BiRefresh size={23} title="Refersh list" />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { checkId.length ?setConfirm(2):setAlert(true)}}>
                                    <BiAddToQueue size={23} title="Add to queue" />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { checkId.length ?setConfirm(3):setAlert(true)}}>
                                    <BiMailSend title="Resend mail to selected" size={23} />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => {resetHandler()}}>
                                    <BiEraser size={23} title={'Reset'} />
                                </div>
                                <div className={Styles.checkAllHolder} onClick={() => { checkId.length ?setConfirm(1):setAlert(true)}}>
                                    <BiTrash size={23} title={'Delete selected rows'} />
                                </div>
                            </div>
                            <input type="text" autoComplete="off" id="contactSearch" title="search for contact" placeholder="Search Contacts" className={Styles.searchBox} onKeyUp={(e) => { setSearchValue(e.target.value); setCurrentPage(1) }} />
                        </div>
                    </div>
                    <table style={{ width: '100%' }}>
                        <thead className={Styles.table} style={{ position: 'sticky', top: '265px', zIndex: 11 }}>
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
                            {data.length > 0 ? data.map((contact, index) => {
                                return (
                                    <tr key={index} className={Styles.tableRow}>
                                        <td style={{ width: '200px' }}>
                                            <label for={contact.id} style={{ cursor: "pointer" }} title="Click to select">
                                                <input type="checkbox" checked={checkId.includes(contact.id) ? true : false} className={checkId.includes(contact.id) ? Styles.checked : Styles.unChecked} onChange={() => { checkId.includes(contact.id) ? setCheckId(checkId.filter((value) => value !== contact.id)) : setCheckId([...checkId, contact.id]); }} name="contact" id={contact.id} />
                                                &nbsp;{contact.Account}
                                            </label>
                                        </td>
                                        <td style={{ width: '200px' }} onMouseEnter={() => setShowBrands(index)} onMouseLeave={() => setShowBrands(null)}>{(contact.Brands.length < 50 || showBrands == index) ? contact.Brands : contact.Brands.slice(0, 50) + "..."}</td>
                                        <td>{contact.ContactName}</td>
                                        <td>{contact.ContactEmail}</td>
                                        <td>{DateConvert(contact.Date, true)}</td>
                                        <td>{contact.mailStatus == 1 ? <p onClick={() => { getEmailBodyHandler(contact.id) }} className="bg-[#90EE90] text-center rounded-lg text-[#ffffff] text-sm cursor-pointer">Sent</p> : contact.mailStatus == 2 ? <p onClick={() => { getEmailBodyHandler(contact.id) }} className="bg-[#FF474C] text-center rounded-lg text-[#ffffff] text-sm cursor-pointer">Failed</p> : <p onClick={() => { getEmailBodyHandler(contact.id) }} className="bg-[#efef68] text-center rounded-lg text-[#000] text-sm cursor-pointer">Not Send</p>}</td>
                                    </tr>
                                )
                            }) : <tr className="text-center" style={{ height: '200px' }}><td colSpan={6}>No data found.</td></tr>}
                        </tbody>
                    </table></>}</div>)

}
export default EmailTable