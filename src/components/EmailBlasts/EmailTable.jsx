import { useState } from "react"
import { DateConvert } from "../../lib/store"
import SettingNotify from "./SettingNotify"
import Styles from "./index.module.css"
import { BiMailSend, BiPlus } from "react-icons/bi"

const EmailTable = ({ data,setSetting,setting,setSearchValue }) => {
    return (
        <div>
            {setting ? <SettingNotify setSetting={setSetting} /> :
                <>
                    <div className={Styles.titleHolder}><h2>NewLetter List</h2><div className="d-flex"><div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setSetting(true) }}><BiMailSend/>&nbsp;Setting</div><input type="text"  autoComplete="off" placeholder="Search Contacts" className={Styles.searchBox} onKeyUp={(e)=>setSearchValue(e.target.value)}/></div></div>
                    <table style={{ width: '100%' }}>
                        <thead className={Styles.table}>
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
                                        <td style={{ width: '200px' }}>{contact.Account}</td>
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