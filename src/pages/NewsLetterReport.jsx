import { useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useEffect,useState } from 'react';
import EmailTable from "../components/EmailBlasts/EmailTable";
const NewsLetterReport = () => {
    const location = useLocation();
    const { year, month, day } = location.state || {};

    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([])
    const [selMonth, setMonth] = useState();
    const [selDay, setDay] = useState();
    const [selYear, setYear] = useState();
    const [filter, setFilter] = useState({});
    const [filterHelper, setFilterHelper] = useState({ day: null, month: null, year: null })

    useEffect(() => {
        console.log({year, month, day});
        if (!year || !month || !day) {
            
            alert("no found.")
        }else{
            setDay(day)
            setMonth(month)
            setYear(year)
            setFilterHelper({ day, month, year })
        }
    }, [year, month, day])
    return (<AppLayout>
          <div className="emailContainer">
        <EmailTable setDayList={setDayList} setMonthList={setMonthList} day={selDay} month={selMonth} year={selYear} setFilter={setFilter} setYear={setYear} setDay={setDay} setMonth={setMonth} />
        </div>
    </AppLayout>
    )
}
export default NewsLetterReport;