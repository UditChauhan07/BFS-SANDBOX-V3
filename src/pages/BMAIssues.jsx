import { useEffect, useState , useMemo } from "react";
import BrandManagementPage from "../components/Brand Management Approval/BrandManagementPage"
import Loading from "../components/Loading";
import CustomerSupportLayout from "../components/customerSupportLayout"
import { GetAuthData, admins, getAllAccount, getSalesRepList } from "../lib/store";
import { FilterItem } from "../components/FilterItem";
import { getPermissions } from "../lib/permission";
const BMAIssues = () => {
    const [sumitForm, setSubmitForm] = useState(false)
    const [accountList, setAccountList] = useState([]);
    const [userData, setUserData] = useState({});
    const [salesRepList, setSalesRepList] = useState([])
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
    const [loaded, setLoaded] = useState(false);
    const [permissions, setPermissions] = useState(null);
    useEffect(() => {
        GetAuthData().then((user) => {
            setUserData(user)
            getSalesRepList({ key: user.x_access_token }).then((repRes) => {
                setSalesRepList(repRes.data)
            }).catch((repErr) => {
                console.log({ repErr });
            })
            getAccountBasedSales(user)
        })
            .catch((error) => {
                console.log({ error });
            });
    }, [])

    const getAccountBasedSales = (user) => {
        setLoaded(false)
        setSelectedSalesRepId(user.Sales_Rep__c)
        getAllAccount({ user })
            .then((accounts) => {
                setAccountList(accounts);
                setLoaded(true)
            })
            .catch((actError) => {
                console.error({ actError });
            });
    }
    useEffect(() => {
        async function fetchPermissions() {
          try {
            const user = await GetAuthData(); // Fetch user data
            const userPermissions = await getPermissions(); // Fetch permissions
            setPermissions(userPermissions); // Set permissions in state
          } catch (err) {
            console.error("Error fetching permissions", err);
          }
        }
    
        fetchPermissions(); // Fetch permissions on mount
      }, []);
      const memoizedPermissions = useMemo(() => permissions, [permissions]);

    if (sumitForm) return <Loading height={'80vh'} />;
    return (
        <CustomerSupportLayout
            filterNodes={
                <>

                {memoizedPermissions?.modules?.godLevel ? <>
                    <FilterItem
                    minWidth="220px"
                    label="salesRep"
                    name="salesRep"
                    value={selectedSalesRepId}
                    options={salesRepList.map((salesRep) => ({
                        label: salesRep.Id == userData.Sales_Rep__c ? 'My Orders (' + salesRep.Name + ')' : salesRep.Name,
                        value: salesRep.Id,
                    }))}
                    onChange={(value) => getAccountBasedSales({ x_access_token: userData.x_access_token, Sales_Rep__c: value })}
                />
                 </> : null}
               
                </>
                
            }>
            {!loaded ? <Loading height={'50vh'} /> :
                <BrandManagementPage setSubmitForm={setSubmitForm} accountList={accountList} />}
        </CustomerSupportLayout>
    )
}
export default BMAIssues