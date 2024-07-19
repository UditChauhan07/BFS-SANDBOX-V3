import {useState } from "react"
import AppLayout from "../components/AppLayout"
import { months } from "../lib/store";
import EmailTable from "../components/EmailBlasts/EmailTable";
import { FilterItem } from "../components/FilterItem";
import { SearchIcon } from "../lib/svg";
import EmailReport from "../components/EmailBlasts/EmailReport";

const EmailSetting = () => {

    const [setting, setSetting] = useState(false)
    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([])
    const [month, setMonth] = useState();
    const [day, setDay] = useState();
    const [year, setYear] = useState();
    const [filter, setFilter] = useState({});
    const [filterHelper, setFilterHelper] = useState({ day: null, month: null, year: null })

    const getDetailsOfNewLetter = ({ year, month, day }) => {
        setDay(day)
        setMonth(month)
        setYear(year)
        setFilterHelper({ day, month, year })
    }
    return (<AppLayout
        filterNodes1={
            <>
                {monthList.length ?
                    <FilterItem
                        minWidth="220px"
                        label="month"
                        name="month"
                        value={filterHelper.month}
                        options={monthList.map((month) => ({
                            label: month,
                            value: (months.indexOf(month) + 1),
                        }))}
                        onChange={(value) => filterHelper.month = value}
                    /> : null}
                {dayList.length ?
                    <FilterItem
                        minWidth="220px"
                        label="Day"
                        name="Day"
                        value={filterHelper.day}
                        options={dayList.map((month) => ({
                            label: month,
                            value: month,
                        }))}
                        onChange={(value) => filterHelper.day = value}
                    /> : null}
                {(dayList.length && monthList.length) ?
                    <button className="border px-2 py-1 leading-tight d-grid" onClick={() => {
                        setDay(filterHelper.day);
                        setMonth(filterHelper.month);
                        setYear(filterHelper.year);
                    }}> <SearchIcon fill="#fff" width={20} height={20} />
                        <small style={{ fontSize: '6px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>search</small>
                    </button> : null}
            </>
        }
    >
        <div className="emailContainer">
            {(day && month && year) ?
                <EmailTable setDayList={setDayList} setMonthList={setMonthList} day={day} month={month} year={year} setFilter={setFilter} setYear={setYear} setDay={setDay} setMonth={setMonth} /> : <EmailReport setSetting={setSetting} setting={setting} onCheckout={getDetailsOfNewLetter} />}
        </div>
    </AppLayout>)
}
export default EmailSetting