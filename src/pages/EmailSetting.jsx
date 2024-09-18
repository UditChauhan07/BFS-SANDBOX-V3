import AppLayout from "../components/AppLayout"
import Newsletter from "../components/EmailBlasts/Newsletter";
import { GetAuthData, salesRepIdKey } from "../lib/store";
import { getPermissions } from "../lib/permission";
import { useEffect , useState } from "react";
import { useNavigate } from "react-router-dom";
import PermissionDenied from "../components/PermissionDeniedPopUp/PermissionDenied";
const EmailSetting = () => {
    const [userData, setUserData] = useState({});
    const [hasPermission, setHasPermission] = useState(null); 
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
    const navigate = useNavigate()
useEffect(()=>{
    const fetchData = async()=>{
        try {
            const user = await GetAuthData()
            setUserData(user)
            if(!selectedSalesRepId)
                setSelectedSalesRepId(user.Sales_Rep__c)

            const userPermissions = await getPermissions()
            setHasPermission(userPermissions?.modules?.emailBlast?.view)
            if(userPermissions?.modules?.emailBlast?.view === false) {navigate('/dashboard')}
        } catch (error) {
            console.log("Permission Error" , error)
        }
    }
    fetchData()
}, [salesRepIdKey , navigate])
useEffect(()=>{
if(hasPermission === false){ 
    PermissionDenied()
    navigate('/dashboard')
}}, [hasPermission , navigate])
    return (<AppLayout
    >
        <div className="emailContainer">
            <Newsletter />
        </div>
    </AppLayout>)
}
export default EmailSetting