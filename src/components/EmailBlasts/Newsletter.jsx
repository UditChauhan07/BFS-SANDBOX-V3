import { useEffect, useMemo, useState } from "react";
import { GetAuthData, getEmailBlastReport } from "../../lib/store";
import { BiBoltCircle, BiPlus } from "react-icons/bi";
import Styles from "./index.module.css"
import Loading from "../Loading";
import ModalPage from "../Modal UI";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";

const Newsletter = () => {
    const navigate = useNavigate();
    const [emailReports, setEmailReport] = useState({ isLoad: false, data: [] })
    const [showLayout, setShowLayout] = useState()
    const [token, setToken] = useState();
    const [searchValue, setSearchValue] = useState();
    const [currentPage, setCurrentPage] = useState(1);


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
                            frame.newsletterAlice,
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
    return (
        <>
            <ModalPage
                open={showLayout ?? false}
                content={<div style={{ width: '80vw' }} dangerouslySetInnerHTML={{ __html: showLayout }} />}
                onClose={() => setShowLayout()}
            />
            <div style={{ position: 'sticky', top: '150px', background: '#ffffff', padding: '2px 0', zIndex: 1 }}>
                <div className={Styles.titleHolder} style={{ marginBottom: '0px' }}>
                    <h2>Newsletter</h2>
                    <div className="d-flex">
                        <div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { navigate('/newsletter/setting') }}>
                            <BiBoltCircle />&nbsp;Settings
                        </div>&nbsp;
                        <div className={`${Styles.settingButton}  d-flex  justify-content-center align-items-center`} onClick={() => { navigate("/newsletter/create") }}>
                            <BiPlus />&nbsp;Create Newsletter
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
                        <th style={{ width: '50%' }}>Newsletter</th>
                        <th style={{ width: '50px' }}>Subscribes</th>
                        <th style={{ width: '50px' }}>Sent</th>
                        <th style={{ width: '50px' }}>Failed</th>
                        <th style={{ width: '50px' }}>Waiting</th>
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
                                    <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => {
                                        navigate('/newsletter/report', {
                                            state: { day: frame.Day, month: frame.MonthValue, year: frame.Year,newsletter:frame.newsletterAlice }
                                        })
                                    }}>
                                        {frame.Month} {frame.Day}, {frame.Year}
                                    </p>
                                </td>
                                <td style={{ width: '200px' }}><p title="click to see Layout for this newsletter" onClick={() => { setShowLayout(frame?.FirstBody) }} style={{ cursor: 'pointer' }}>{frame.newsletterAlice||"No Alice"}</p></td>
                                <td>{frame.Total}</td>
                                <td>{frame.SendMail}</td>
                                <td>{frame.FailMail}</td>
                                <td>{frame.NotSend}</td>
                            </tr>
                        )
                    }) : <tr className="text-center" style={{ height: '200px' }}><td colSpan={6}>No data found.</td></tr>}
                </tbody>
                <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={letterList.length}
                    pageSize={10}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </table> : <Loading height={'50vh'} />}
        </>)
}
export default Newsletter;