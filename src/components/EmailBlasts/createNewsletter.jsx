import { useNavigate } from "react-router-dom";
import React , {useState , useEffect} from 'react'
import AppLayout from "../AppLayout"
import MultiStepForm from "./Custom"
import { BiLeftArrow } from "react-icons/bi";
import { BackArrow } from "../../lib/svg";
import { GetAuthData } from "../../lib/store";
import { getPermissions } from "../../lib/permission";
const CreateNewsletter = () => {
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
  const [userData, setUserData] = useState({});
  const [hasPermission, setHasPermission] = useState(null);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await GetAuthData();
        setUserData(user);

        if (!selectedSalesRepId) {
          setSelectedSalesRepId(user.Sales_Rep__c);
        }

        const userPermissions = await getPermissions();
        setHasPermission(userPermissions?.modules?.emailBlast.create);

        // If no permission, redirect to dashboard
        if (userPermissions?.modules?.emailBlast.create === false) {
          navigate("/dashboard");
        }
        
      } catch (error) {
        console.log({ error });
      }
    };
    
    fetchData();
  }, [navigate, selectedSalesRepId]);

  // Check permission and handle redirection
  useEffect(() => {
    if (hasPermission === false) {
      navigate("/dashboard");  // Redirect if no permission
    }
  }, [hasPermission, navigate]);
    return (<AppLayout>
        <div className="emailContainer">
            <div style={{
                marginBottom: '0px', borderBottom: '1px dashed #000',
                paddingBottom:'10px',
                margin: '27px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 className="d-flex justify-content-start align-items-center" style={{ color: '#000', fontFamily: "Montserrat-400", fontSize: '20px', fontStyle: 'normal', fontWeight: 500, lineHeight: 'normal', letterSpacing: '2px'}}><span style={{ cursor: 'pointer' }} onClick={() => { navigate('/newsletter') }}><BackArrow /></span><p style={{margin:0}}>&nbsp;Create Newsletter</p></h2>
            </div>
            <MultiStepForm />
        </div>
    </AppLayout>)
}
export default CreateNewsletter