import { useEffect, useMemo, useState } from "react"
import AppLayout from "../components/AppLayout"
import { DateConvert, GetAuthData, admins, getEmailBlast, months, sortArrayHandler } from "../lib/store";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination/Pagination";
import EmailTable from "../components/EmailBlasts/EmailTable";
import Loading from "../components/Loading";
import { FilterItem } from "../components/FilterItem";
import { CloseButton, SearchIcon } from "../lib/svg";
let PageSize = 10;
const EmailSetting = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [contactList, setContactList] = useState({ isLoaded: false, data: [] })
    const [notifyDate, setNotifyDate] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [setting, setSetting] = useState(false)
    const [checkId, setCheckId] = useState([])
    const [searchValue, setSearchValue] = useState();
    const [checked, setChecked] = useState(false)
    const [filter, setFilter] = useState({});
    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([])
    const [month, setMonth] = useState();
    const [day, setDay] = useState();

    useEffect(() => {
        getDataHandler()
    }, [])
    const getDataHandler = (reset=false) => {
        setSearchValue(null)
        setCheckId([])
        setNotifyDate([])
        GetAuthData().then((user) => {
            if (admins.includes(user.Sales_Rep__c)) {
                setUser(user)
                getEmailBlast({ key: user.access_token, Id: user.Sales_Rep__c, month:reset?null:month, day:reset?null:day }).then((list) => {
                    let contactList = sortArrayHandler(JSON.parse(list.notifyMail || "[]") || [], g => g?.updatedAt, 'desc')
                    setContactList({ isLoaded: true, data: contactList })
                    setNotifyDate(list.notifyDate)
                    let monthList = Object.keys(list.filter);
                    setMonthList(monthList)
                    setDayList(list.filter[months[list.month-1]]||[]);
                    setMonth(list.month)
                    setDay(list.day)
                    setFilter(list.filter)
                }).catch((conErr) => {
                    console.log({ conErr });
                })
            } else {
                navigate('/dashboard')
            }
        }).catch((err) => {
            console.log({ err });
        })
    }
    const { isLoaded, data } = contactList||false
    const mailList = useMemo(() => {
        return (
            data
                ?.filter((contact) => {
                    return (
                        !searchValue?.length ||
                        [
                            contact.Account,
                            contact.Brands,
                            contact.ContactEmail,
                            contact.ContactName,
                            DateConvert(contact.Date, true)
                        ].some(property => {
                            const propertyValue = property?.toLowerCase();
                            return propertyValue.includes(searchValue);
                        })
                    );
                })
        );
    }, [data, searchValue]);
    function checkedAll(value) {
        setChecked(!checked)
        let temp = []
        if (value) {
            mailList.map((contact, index) => {
                temp.push(contact.id)
            })
        }
        setCheckId(temp)
    }
    // return <AppLayout/>;
    const monthChangeHandler= (value)=>{
        setMonth(value)
        setDay(null)
        if(filter[months[value-1]]){
            if(filter[months[value-1]].length==1){
                setDay(filter[months[value-1]][0])
            }
        }
        setDayList(filter[months[value-1]]||[]);
    }
    const reset = ()=>{
        setDayList([]);
        setMonthList([])
        setDay();
        setMonth();
        setFilter({})
        setContactList({ isLoaded: false, data: [] })
        getDataHandler(true)
    }

    return (<AppLayout
        filterNodes={
            <>
                <FilterItem
                    minWidth="220px"
                    label="month"
                    name="month"
                    value={month}
                    options={monthList.map((month) => ({
                        label: month,
                        value: (months.indexOf(month)+1),
                    }))}
                    onChange={(value) => monthChangeHandler(value)}
                />
                <FilterItem
                    minWidth="220px"
                    label="Day"
                    name="Day"
                    value={day}
                    options={dayList.map((month) => ({
                        label: month,
                        value: month,
                    }))}
                    onChange={(value) => setDay(value)}
                />
                <button onClick={() => {setContactList({ isLoaded: false, data: [] });getDataHandler()}} className="border px-2 py-1 leading-tight d-grid"> <SearchIcon fill="#fff" width={20} height={20} />
                    <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>search</small>
                </button>
                <div className="d-flex gap-3">
              <button className="border px-2 py-1 leading-tight d-grid" onClick={()=>{reset();}}>
                <CloseButton crossFill={'#fff'} height={20} width={20} />
                <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>clear</small>
              </button>
            </div>
            </>
        }
    >
        {isLoaded ? <div>
            <div style={{ width: '80%', margin: 'auto' }}>
                <EmailTable data={mailList.slice(
                    (currentPage - 1) * PageSize,
                    currentPage * PageSize

                )} setSetting={setSetting} setting={setting} user={user} setSearchValue={setSearchValue} checkIdObj={{ setCheckId, checkId, checkedAll, checked }} notifyDate={notifyDate} getDataHandler={getDataHandler} setCurrentPage={setCurrentPage} setContactList={setContactList} />
                {!setting && <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={mailList.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                />}
            </div>
        </div> : <Loading height={'60vh'} />}
    </AppLayout>)
}
export default EmailSetting