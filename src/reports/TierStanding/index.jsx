import { useEffect, useState } from "react"
import { ArrayFindMaxMin, GetAuthData, admins, formatNumber, getTierReportHandler } from "../../lib/store"
import Loading from "../../components/Loading";
import AppLayout from "../../components/AppLayout";
import Styles from "./index.module.css";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { MdOutlineDownload } from "react-icons/md";
import { LuArrowBigDownDash, LuArrowBigUpDash } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { BiDollar } from "react-icons/bi";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const Tier = () => {
    const navigate = useNavigate();
    let date = new Date();
    let dYear = date.getFullYear();
    const [year, setYear] = useState(dYear)
    const [tier, setTier] = useState({ isLoad: false, data: [], getSalesHolder: {}, currentYearRevenue: 0, previousYearRevenue: 0 });
    useEffect(() => {
        GetDataHandler()
    }, [])

    const GetDataHandler = () => {
        GetAuthData().then((user) => {
            if (admins.includes(user.Sales_Rep__c)) {
                getTierReportHandler({ token: user.x_access_token, year: year }).then((res) => {
                    console.log({ res });
                    let currentYearRevenue = res?.salesArray.reduce((acc, curr) => acc + curr[year], 0);
                    let previousYearRevenue = res?.salesArray.reduce((acc, curr) => acc + curr[year - 1], 0);
                    setTier({ isLoad: true, data: res?.salesArray ?? [], getSalesHolder: res?.getSalesHolder ?? {}, currentYearRevenue, previousYearRevenue });

                }).catch((resErr) => {
                    console.log({ resErr });
                })
            } else {
                navigate('/dashboard')
            }
        })
    }

    const excelExportHandler = () => {
        const ws = XLSX.utils.json_to_sheet(csvData());
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, `Account Tier & Standing Report ${new Date().toDateString()}` + fileExtension);
    }

    const csvData = () => {
        let csvData = []
        tier.data.map((item) => {
            csvData.push({
                "Account": item.Name,
                "Store Street": item.StoreStreet ?? "NA",
                "City": item.StoreCity ?? "NA",
                "State": item.StoreState ?? "NA",
                "State": item.StoreState ?? "NA",
                "Zip": item.StoreZip ?? "NA",
                "Brand": item.BrandName,
                "Sales Rep": item.SalesRepName,
                "2023 revenue total for all orders": item[2023],
                "2024 YTD for all orders": item[2024],
                "Existing Tier": item.Tier ?? "NA",
                "Suggested Tier": item.Suggested
            })
        })
        return csvData
    }

    const { isLoad, data, getSalesHolder, previousYearRevenue, currentYearRevenue } = tier
    const formentAcmount = (amount) => {
        return `${Number(amount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
    return (
        <AppLayout
            filterNodes={<button className="border px-2 d-grid py-1 leading-tight d-grid" onClick={excelExportHandler}>
                <MdOutlineDownload size={16} className="m-auto" />
                <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>export</small>
            </button>}
        >
            <section>
                <div className={Styles.inorderflex}>
                    <div>
                        <h2>
                            Account Tier & Standing Report
                        </h2>
                    </div>
                    <div></div>
                </div>
                {isLoad && <div className="mt-2 mb-2 m-auto">
                    <div className={Styles.dFlex}>
                        <div className={Styles.cardMd}>
                            {getSalesHolder?.highest
                                &&
                                <div>
                                    {Object.keys(getSalesHolder?.highest).length ?
                                        <div className={Styles.dGrid}>
                                            <div className={Styles.subTitileHolder} style={{ margin: '10px 10px auto 0' }}>
                                                <img src="\assets\images\boxIcons\highest-graph.png" width={100} /></div>
                                            {Object.keys(getSalesHolder?.highest).map((key) => (
                                                getSalesHolder?.highest[key]?.Id &&
                                                <div className={`${Styles.cardHolder} max-w-[375px]`}>
                                                    <div className={Styles.badge}>
                                                        <LuArrowBigUpDash color="#fff" size={23} />
                                                        {key}
                                                    </div>
                                                    <div>
                                                        <p className={Styles.textHolder}>{getSalesHolder?.highest[key]?.Name}</p>
                                                        <h1 className={Styles.countHolder}>
                                                            <small style={{ fontSize: '11px' }}>Revenue</small>{" "}
                                                            ${formatNumber(getSalesHolder?.highest[key]?.value)}</h1>
                                                    </div>
                                                </div>
                                            ))}
                                        </div> : null}
                                </div>
                            }
                            {getSalesHolder?.lowest &&
                                <div >
                                    {Object.keys(getSalesHolder?.lowest).length ?
                                        <div className={Styles.dGrid}>
                                            <div className={Styles.subTitileHolder} style={{ margin: 'auto 0 10px 10px' }}><img src="\assets\images\boxIcons\lowest-graph.png" width={100} /></div>
                                            {Object.keys(getSalesHolder?.lowest).map((key) => (
                                                getSalesHolder?.lowest[key]?.Id &&
                                                <div className={`${Styles.cardHolder} max-w-[375px]`}>
                                                    <div className={Styles.badge}>
                                                        {key}
                                                        <LuArrowBigDownDash color="#fff" size={23} />
                                                    </div>

                                                    <div>
                                                        <p className={Styles.textHolder}>{getSalesHolder?.lowest[key]?.Name}</p>
                                                        <h1 className={Styles.countHolder}>
                                                            <small style={{ fontSize: '11px' }}>Revenue</small>{" "}
                                                            ${formatNumber(getSalesHolder?.lowest[key]?.value)}</h1>
                                                    </div>
                                                </div>
                                            ))}
                                        </div> : null}
                                </div>
                            }
                        </div>
                        <div className={Styles.cardBr}></div>
                        <div className={Styles.cardSd}>
                            <div className={`${Styles.inorderflex} mt-1 mb-2`}>
                                <h2 className="fs-6">Annual Revenue Summary</h2>
                            </div>
                            <div className={`${Styles.cardHolder} max-w-[375px] mt-2 mb-2`}>
                                <div className={Styles.badge}>
                                    <BiDollar color="#fff" size={23} />
                                </div>
                                <div>
                                    <p className={Styles.textHolder}>{year - 1}</p>
                                    <h1 className={Styles.countHolder}>
                                        {/* <small style={{ fontSize: '11px' }}>Revenue</small>{" "} */}
                                        ${formatNumber(previousYearRevenue)}</h1>
                                </div>
                            </div>
                            <div className={`${Styles.cardHolder} max-w-[375px]`}>
                                <div className={Styles.badge}>
                                    <BiDollar color="#fff" size={23} />
                                </div>
                                <div>
                                    <p className={Styles.textHolder}>{year}</p>
                                    <h1 className={Styles.countHolder}>
                                        {/* <small style={{ fontSize: '11px' }}>Revenue</small>{" "} */}
                                        ${formatNumber(currentYearRevenue)}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
                <div className={`d-flex p-3 ${Styles.tableBoundary} mb-5`}>
                    <div className="" style={{ maxHeight: "73vh", minHeight: "40vh", overflow: "auto", width: "100%" }}>
                        {isLoad ?
                            <table>
                                <thead>
                                    <th className={`${Styles.th} ${Styles.stickyFirstColumnHeading}`}>Account</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>Store Street</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>City</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>State</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>Zip</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>Brand</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`}>Sales Rep</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`} style={{ width: '150px' }}>{year - 1} revenue</th>
                                    <th className={`${Styles.th} ${Styles.stickyMonth}`} style={{ width: '150px' }}>{year} revenue</th>
                                    <th className={`${Styles.th} ${Styles.stickySecondLastColumnHeading}`} style={{ width: '150px' }}>Existing Tier</th>
                                    <th className={`${Styles.th} ${Styles.stickyLastColumnHeading}`} style={{ width: '150px' }}>Suggested Tier</th>
                                </thead>
                                <tbody>
                                    {data.map((item, key) => (
                                        <tr key={key}>
                                            <td className={`${Styles.td} ${Styles.stickyFirstColumn}`}>{item.Name}</td>
                                            <td className={`${Styles.td}`}>{item.StoreStreet ?? 'NA'}</td>
                                            <td className={`${Styles.td}`}>{item.StoreCity ?? 'NA'}</td>
                                            <td className={`${Styles.td}`}>{item.StoreState ?? 'NA'}</td>
                                            <td className={`${Styles.td}`}>{item.StoreZip ?? 'NA'}</td>
                                            <td className={`${Styles.td}`}>{item.BrandName}</td>
                                            <td className={`${Styles.td}`}>{item.SalesRepName}</td>
                                            <td className={`${Styles.td}`}>${formentAcmount(item[2023])}</td>
                                            <td className={`${Styles.td}`}>${formentAcmount(item[2024])}</td>
                                            <td className={`${Styles.td} ${Styles.stickySecondLastColumn}`}>{item.Tier ?? 'NA'}</td>
                                            <td className={`${Styles.td} ${Styles.stickyLastColumn}`}>{item.Suggested}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            : <Loading height={'50vh'} />}
                    </div>
                </div>
            </section>
        </AppLayout>
    )
}
export default Tier