import { useEffect, useState } from "react";
import BrandManagementPage from "../components/Brand Management Approval/BrandManagementPage"
import Loading from "../components/Loading";
import CustomerSupportLayout from "../components/customerSupportLayout"
import { GetAuthData, admins, getAllAccount, getSalesRepList } from "../lib/store";
import { FilterItem } from "../components/FilterItem";

const BMAIssues = () => {
    const [sumitForm, setSubmitForm] = useState(false)
    const [accountList, setAccountList] = useState([]);
    const [userData, setUserData] = useState({});
    const [salesRepList, setSalesRepList] = useState([])
    const [selectedSalesRepId, setSelectedSalesRepId] = useState();
    const [loaded, setLoaded] = useState(false);

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

    if (sumitForm) return <Loading height={'80vh'} />;
    return (
        <CustomerSupportLayout
            filterNodes={(admins.includes(userData.Sales_Rep__c), salesRepList.length > 0) &&
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
            }>
            {!loaded ? <Loading height={'50vh'} /> :
                <BrandManagementPage setSubmitForm={setSubmitForm} accountList={accountList} />}
        </CustomerSupportLayout>
    )
}
export default BMAIssues