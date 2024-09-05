import { useLocation } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { useEffect,useState } from 'react';
import EmailTable from "../components/EmailBlasts/EmailTable";
const NewsLetterReport = () => {
    const location = useLocation();
    const { year, month, day,newsletter } = location.state || {};

    const [monthList, setMonthList] = useState([]);
    const [dayList, setDayList] = useState([])
    const [selMonth, setMonth] = useState();
    const [selDay, setDay] = useState();
    const [selNewsletter, setNewsletter] = useState();
    const [selYear, setYear] = useState();
    const [filter, setFilter] = useState({});
    const [filterHelper, setFilterHelper] = useState({ day: null, month: null, year: null,newsletter:null })

    useEffect(() => {
        console.log({year, month, day,newsletter});
        if (!year || !month || !day||!newsletter) {
            
            alert("no found.")
        }else{
            setDay(day)
            setMonth(month)
            setYear(year)
            setNewsletter(newsletter)
            setFilterHelper({ day, month, year,newsletter })
        }
    }, [year, month, day,newsletter])
    return (<AppLayout>
          <div className="emailContainer">
        <EmailTable setDayList={setDayList} setMonthList={setMonthList} day={selDay} month={selMonth} year={selYear} setFilter={setFilter} newsletter={selNewsletter} />
        </div>
    </AppLayout>
    )
}
export default NewsLetterReport;