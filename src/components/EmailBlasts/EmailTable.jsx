import { useState } from "react"
import { DateConvert, deleteEmailBlast, resetEmailBlast } from "../../lib/store"
import SettingNotify from "./SettingNotify"
import Styles from "./index.module.css"
import { BiMailSend, BiPlus, BiReset } from "react-icons/bi"
import { DeleteIcon } from "../../lib/svg"

const EmailTable = ({ data, setSetting, setting, setSearchValue, checkIdObj,notifyDate,getDataHandler }) => {
    const { checkId, setCheckId, checked, checkedAll } = checkIdObj
    const resetHandler = ()=>{
        resetEmailBlast({key:"8XoSdoqMZ2dAiqh",ids:JSON.stringify(checkId)}).then((res)=>{
            getDataHandler()
        }).catch((err)=>{
            console.log({err});
        })
    }
    const deleteHandler = ()=>{
        deleteEmailBlast({key:"8XoSdoqMZ2dAiqh",ids:JSON.stringify(checkId)}).then((res)=>{
            getDataHandler()
        }).catch((err)=>{
            console.log({err});
        })
    }
    return (
        <div>
            {setting ? <SettingNotify setSetting={setSetting} notifyDate={notifyDate} getDataHandler={getDataHandler}/> :
                <>
                    <div className={Styles.titleHolder}><h2>NewLetter List</h2><div className="d-flex"><div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setSetting(true) }}><BiMailSend />&nbsp;Setting</div><input type="text" autoComplete="off" placeholder="Search Contacts" className={Styles.searchBox} onKeyUp={(e) => setSearchValue(e.target.value)} /></div></div>
                    <div className="d-flex">
                        <div onClick={()=>{deleteHandler()}}>
                        <DeleteIcon fill="red" width={'15px'} title={'delete all selected rows'} height={'15px'} />
                        </div>
                        <BiReset title="resend mail to selected rows" onClick={()=>{resetHandler()}} />
                    </div>
                    <table style={{ width: '100%' }}>
                        <thead className={Styles.table}>
                            <tr>
                                <th style={{ width: '200px' }}><label for="ALL"><input type="checkbox" onClick={(e) => { checkedAll(!checked) }} id="ALL" />&nbsp;Account Name</label></th>
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
                                        <td style={{ width: '200px' }}><label for={contact.id}><input type="checkbox" checked={checkId.includes(contact.id) ? true : false} onChange={() => { checkId.includes(contact.id) ? setCheckId(checkId.filter((value) => value !== contact.id)) : setCheckId([...checkId, contact.id]); }} name="contact" id={contact.id} />&nbsp;{contact.Account}</label></td>
                                        <td style={{ width: '200px' }}>{contact.Brands.length > 50 ? contact.Brands.slice(0, 50) + "..." : contact.Brands}</td>
                                        <td>{contact.ContactName}</td>
                                        <td>{contact.ContactEmail}</td>
                                        <td>{DateConvert(contact.Date, true)}</td>
                                        <td>{contact.mailStatus == 1 ? <p className="bg-[#90EE90] text-center rounded-lg text-[#ffffff] text-sm">Send</p> : contact.mailStatus == 2 ? <p className="bg-[#FF474C] text-center rounded-lg text-[#ffffff] text-sm">Failed</p> : <p className="bg-[#FFFFED] text-center rounded-lg text-[#000] text-sm/[13px]">Not Send</p>}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table></>}</div>)

}
export default EmailTable