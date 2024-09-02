import { useEffect, useMemo, useState } from "react";
import { GetAuthData, getEmailBlastReport } from "../../lib/store";
import SettingNotify from "./SettingNotify";
import { BiBoltCircle, BiPlus } from "react-icons/bi";
import Styles from "./index.module.css"
import Loading from "../Loading";
import ModalPage from "../Modal UI";
import Pagination from "../Pagination/Pagination";
import MultiStepForm from "./Custom";
import { CloseButton } from "../../lib/svg";

const EmailReport = ({ setting, setSetting, onCheckout }) => {
    const [emailReports, setEmailReport] = useState({ isLoad: false, data: [] })
    const [showLayout, setShowLayout] = useState()
    const [token, setToken] = useState();
    const [searchValue, setSearchValue] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [customModal, setCustomModal] = useState(false);
    useEffect(() => {
        getReportHandler();
    }, [])

    const getReportHandler = () => {
        setEmailReport({ isLoad: false, data: [] })
        GetAuthData().then((user) => {
            setToken(user.access_token)
            getEmailBlastReport({ key: user.access_token, Id: user.Sales_Rep__c }).then((report) => {
                setEmailReport({ isLoad: true, data: report })
            }).catch((reportErr) => {
                console.log({ reportErr });
            })
        }).catch((userErr) => {
            console.log({ userErr });
        })
    }
    const { isLoad, data } = emailReports;
    const letterList = useMemo(() => {
        return (
            data
                ?.filter((frame) => {
                    return (
                        !searchValue?.length ||
                        [
                            frame.NotSend,
                            frame.FailMail,
                            frame.SendMail,
                            frame.Total,
                            `${frame.Month} ${frame.Day}, ${frame.Year}`,
                        ].some(property => {
                            const propertyValue = property;
                            return propertyValue.toString().toLowerCase().includes(searchValue.toLowerCase());
                            return propertyValue.includes(searchValue);
                        })
                    );
                })
        )
    }, [data, searchValue]);
    if (setting) {
        return (<SettingNotify setSetting={setSetting} />)
    } else {
        return (
            <>
                <ModalPage
                    open={showLayout ?? false}
                    content={<div style={{ width: '80vw' }} dangerouslySetInnerHTML={{ __html: showLayout }} />}
                    onClose={() => setShowLayout()}
                />
                <ModalPage
                    open={customModal ?? false}
                    content={<div className="d-flex flex-column gap-3" style={{ width: '75vw' }}>
                        <div style={{
                            position: 'sticky',
                            top: '0',
                            background: '#fff',
                            zIndex: 1,
                            height:'55px'
                        }}>
                            <div className="d-flex align-items-center justify-content-between" style={{ minWidth: '75vw' }}>
                                <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] m-0 p-0">Create Newsletter</h1>
                                <button type="button" onClick={() => { setCustomModal(false) }}>
                                    <CloseButton />
                                </button>
                            </div>
                            <hr />
                        </div><MultiStepForm onSubmit={() => { setCustomModal(false); getReportHandler(); }} /></div>}
                    styles={{ width: '80vw' }}
                    onClose={() => setCustomModal(false)}
                />
                <div style={{ position: 'sticky', top: '150px', background: '#ffffff', padding: '2px 0', zIndex: 1 }}>
                    <div className={Styles.titleHolder} style={{ marginBottom: '0px' }}>
                        <h2>Newsletter</h2>
                        <div className="d-flex">
                            <div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setSetting(true) }}>
                                <BiBoltCircle />&nbsp;Setting
                            </div>&nbsp;
                            <div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { setCustomModal(true) }}>
                                <BiPlus />&nbsp;Custom Newsletter
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end align-items-center" style={{ margin: '15px 0 27px 0' }}>

                        <input type="text" autoComplete="off" id="newsletterSearch" title="search for newsletter" placeholder="Search newsletter" className={Styles.searchBox} onKeyUp={(e) => { setSearchValue(e.target.value); setCurrentPage(1) }} />
                    </div>
                </div>
                {isLoad ? <table style={{ width: '100%' }}>
                    <thead className={Styles.table} style={{ position: 'sticky', top: '265px', zIndex: 11 }}>
                        <tr>
                            <th style={{ width: '200px' }}>Publish On</th>
                            <th style={{ width: '200px' }}>Newsletter</th>
                            <th>Subscribes</th>
                            <th>Sent</th>
                            <th>Failed</th>
                            <th>Waiting</th>
                        </tr>
                    </thead>
                    <tbody>
                        {letterList.length > 0 ? letterList.slice(
                            (currentPage - 1) * 10,
                            currentPage * 10
                        ).map((frame, index) => {
                            return (
                                <tr key={index} className={Styles.tableRow}>
                                    <td style={{ width: '200px' }}>
                                        <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { onCheckout({ day: frame.Day, month: frame.MonthValue, year: frame.Year }) }}>
                                            {frame.Month} {frame.Day}, {frame.Year}
                                        </p>
                                    </td>
                                    <td style={{ width: '200px' }}><p title="click to see Layout for this newsletter" onClick={() => { setShowLayout(frame?.FirstBody.replaceAll("{{token}}", token)) }} style={{ cursor: 'pointer' }}>{frame.newsletterAlice}</p></td>
                                    <td>{frame.Total}</td>
                                    <td>{frame.SendMail}</td>
                                    <td>{frame.FailMail}</td>
                                    <td>{frame.NotSend}</td>
                                </tr>
                            )
                        }) : <tr className="text-center" style={{ height: '200px' }}><td colSpan={6}>No data found.</td></tr>}
                    </tbody>
                    {!setting && <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={letterList.length}
                        pageSize={10}
                        onPageChange={(page) => setCurrentPage(page)}
                    />}
                </table> : <Loading height={'50vh'} />}
            </>)
    }
}
export default EmailReport;