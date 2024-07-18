import { useEffect, useMemo, useState } from "react"
import AppLayout from "../components/AppLayout"
import { DateConvert, GetAuthData, admins, getEmailBlast, months, sortArrayHandler } from "../lib/store";
import EmailTable from "../components/EmailBlasts/EmailTable";
import Loading from "../components/Loading";
import { FilterItem } from "../components/FilterItem";
import { CloseButton, SearchIcon } from "../lib/svg";
import EmailReport from "../components/EmailBlasts/EmailReport";

const EmailSetting = () => {

    const [setting, setSetting] = useState(false)
    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([])
    const [month, setMonth] = useState();
    const [day, setDay] = useState();
    const [year, setYear] = useState();
    const [filter, setFilter] = useState({});

    const monthChangeHandler = (value) => {
        setMonth(value)
        setDay(null)
        if (filter[months[value - 1]]) {
            if (filter[months[value - 1]].length == 1) {
                setDay(filter[months[value - 1]][0])
            }
        }
        setDayList(filter[months[value - 1]] || []);
    }
    const getDetailsOfNewLetter = ({ year, month, day }) => {
        setDay(day)
        setMonth(month)
        setYear(year)
    }
    return (<AppLayout
        filterNodes={
            <>
            {monthList.length?
                <FilterItem
                    minWidth="220px"
                    label="month"
                    name="month"
                    value={month}
                    options={monthList.map((month) => ({
                        label: month,
                        value: (months.indexOf(month) + 1),
                    }))}
                    onChange={(value) => monthChangeHandler(value)}
                />:null}
                {dayList.length?
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
                />:null}
                {(dayList.length && monthList.length)?
                <button className="border px-2 py-1 leading-tight d-grid"> <SearchIcon fill="#fff" width={20} height={20} />
                    <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>search</small>
                </button>:null}
            </>
        }
    >
        <div style={{ width: '80%', margin: 'auto',minHeight:'500px' }}>
            {(day && month && year) ?
                <EmailTable setDayList={setDayList} setMonthList={setMonthList} day={day} month={month} year={year} setFilter={setFilter} setYear={setYear} setDay={setDay} setMonth={setMonth} /> : <EmailReport setSetting={setSetting} setting={setting} onCheckout={getDetailsOfNewLetter} />}
        </div>
    </AppLayout>)
}
export default EmailSetting