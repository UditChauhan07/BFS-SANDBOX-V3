import { useEffect, useState , useMemo} from "react";
import BMAIHandler from "../components/IssuesHandler/BMAIHandler.jsx";
import { GetAuthData, admins, getAllAccount, getOrderCustomerSupport, getSalesRepList, postSupportAny, uploadFileSupport } from "../lib/store.js";
import { getPermissions } from "../lib/permission"; // Import getPermissions
import OrderCardHandler from "../components/IssuesHandler/OrderCardHandler.jsx";
import Attachements from "../components/IssuesHandler/Attachements.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import CustomerSupportLayout from "../components/customerSupportLayout/index.js";
import AccountInfo from "../components/IssuesHandler/AccountInfo.jsx";
import Loading from "../components/Loading.jsx";
import { FilterItem } from "../components/FilterItem.jsx";
import AppLayout from "../components/AppLayout.jsx";

const CustomerService = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Extract data from state
  let Reason = state?.Reason || null;
  let OrderId = state?.OrderId || null;
  let SalesRepId = state?.SalesRepId || null;
  let PONumber = state?.PONumber || null;

  const [reason, setReason] = useState();
  const [accountList, setAccountList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(OrderId);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);
  const [files, setFile] = useState([]);
  const [desc, setDesc] = useState();
  const [subject, setSubject] = useState();
  const [accountId, setAccountId] = useState(null);
  const [contactId, setContactId] = useState(null);
  const [manufacturerId, setManufacturerId] = useState(null);
  const [Actual_Amount__c, setActual_Amount__c] = useState(null);
  const [errorList, setErrorList] = useState({});
  const [searchPo, setSearchPO] = useState(PONumber);
  const [submitForm, setSubmitForm] = useState(false);
  const [userData, setUserData] = useState({});
  const [salesRepList, setSalesRepList] = useState([]);
  const [selectedSalesRepId, setSelectedSalesRepId] = useState();
  const [loaded, setLoaded] = useState(false);
  const [hasPermission, setHasPermission] = useState(null); 
  const [permissions, setPermissions] = useState(null);

  const resetHandler = () => {
    setOrderId(null);
    setOrderConfirmed(false);
    setFile([]);
    setDesc();
    setSubject(null);
    setAccountId(null);
    setContactId(null);
    setManufacturerId(null);
    setActual_Amount__c(null);
    setErrorList({});
  };
  const reasons = [
    { name: "Charges", icon: '/assets/Charges.svg', desc: "Extra amount paid for order?" },
    { name: "Product Missing", icon: '/assets/missing.svg', desc: "Can't find product in Order?" },
    { name: "Product Overage", icon: '/assets/overage.svg', desc: "Receive something you did not order?" },
    { name: "Product Damage", icon: '/assets/damage.svg', desc: "Got damaged product in order?" },
    { name: "Update Account Info", icon: '/assets/account.svg', desc: "Change shipping or billing details" }
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the authenticated user data
        const user = await GetAuthData();
        setUserData(user);
  
        // Fetch permissions for the user
        const permissions = await getPermissions();
        console.log('Fetched Permissions:', permissions);
  
        // Check for customer_service permission
        const customerServicePermission = permissions?.modules?.TopNav?.childModules?.customer_service;
        console.log('Customer Service Permission:', customerServicePermission);
        setHasPermission(customerServicePermission);
  
        // Redirect based on permission
        if (!customerServicePermission) {
          console.log('Redirecting to Dashboard...');
          navigate("/dashboard");
          return; // Ensure no further code execution
        }
  
        // Continue with data fetching if permission is granted
        await orderListBasedOnRepHandler(user.x_access_token, Reason ? SalesRepId : user.Sales_Rep__c, Reason ? false : true, OrderId);
  
        if (admins.includes(user.Sales_Rep__c)) {
          try {
            const repRes = await getSalesRepList({ key: user.x_access_token });
            setSalesRepList(repRes.data);
          } catch (repErr) {
            console.log('SalesRepList Error:', repErr);
          }
        }
      } catch (err) {
        console.log('Fetch Data Error:', err);
      }
    };
  
    fetchData();
  }, [Reason, SalesRepId, OrderId, navigate]);
  
  
  
  

  const orderListBasedOnRepHandler = (key, Sales_Rep__c, ReasonNull = true, searchId = null) => {
    setLoaded(false);
    setSelectedSalesRepId(Sales_Rep__c);
    getOrderCustomerSupport({
      user: { key, Sales_Rep__c },
      PONumber: searchPo,
      searchId,
    })
      .then((order) => {
        if (ReasonNull) {
          setReason(null);
        }
        setOrders(order);
        resetHandler();
        setLoaded(true);
      })
      .catch((error) => {
        console.log({ error });
      });
    getAllAccount({ user: { x_access_token: key, Sales_Rep__c } })
      .then((accounts) => {
        setAccountList(accounts);
      })
      .catch((actError) => {
        console.error({ actError });
      });
  };

  const SubmitHandler = () => {
    setSubmitForm(true);
    GetAuthData()
      .then((user) => {
        if (user) {
          let errorListObj = Object.keys(errorList);
          let systemStr = "";
          if (errorListObj.length) {
            errorListObj.map((id) => {
              systemStr += `${errorList[id].Name}(${errorList[id].ProductCode}) having ${reason} for ${errorList[id].issue} out of ${errorList[id].Quantity} Qty.\n`;
            });
          }
          let newDesc = systemStr ? `User Desc: ${desc || ""} \n Issue Desc: ${systemStr}` : desc;

          let rawData = {
            orderStatusForm: {
              typeId: "0123b0000007z9pAAA",
              reason: reason,
              salesRepId: user.Sales_Rep__c,
              contactId,
              accountId,
              opportunityId: orderId,
              manufacturerId,
              desc: newDesc,
              priority: "Medium",
              sendEmail,
              subject,
              Actual_Amount__c,
            },
            key: user.x_access_token,
          };

          postSupportAny({ rawData })
            .then((response) => {
              if (response) {
                if (files.length > 0) {
                  uploadFileSupport({ key: user.x_access_token, supportId: response, files })
                    .then(() => navigate("/CustomerSupportDetails?id=" + response))
                    .catch((fileErr) => console.log({ fileErr }));
                } else {
                  navigate("/CustomerSupportDetails?id=" + response);
                }
              }
            })
            .catch((err) => console.error({ err }));
        }
      })
      .catch((error) => console.log(error));
  };
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

  if (submitForm) return <AppLayout><Loading height={'50vh'} /></AppLayout>;

  // Memoize permissions to avoid unnecessary re-calculations


  return (
    <CustomerSupportLayout
      filterNodes={  
        
        
        <>
        {memoizedPermissions?.modules?.filter?.view  ? <>
          <FilterItem
          minWidth="220px"
          label="salesRep"
          name="salesRep"
          value={selectedSalesRepId}
          options={salesRepList.map((salesRep) => ({
            label: salesRep.Id === userData.Sales_Rep__c ? 'My Orders (' + salesRep.Name + ')' : salesRep.Name,
            value: salesRep.Id,
          }))}
          onChange={(value) => orderListBasedOnRepHandler(userData.x_access_token, value)}
        />
         </> : null}
        
        </>
      }
    >
      {!loaded ? <Loading height={'50vh'} /> : (
        <section>
          <BMAIHandler reasons={reasons} setReason={setReason} reason={reason} resetHandler={resetHandler} />
          {reason !== "Update Account Info" && (
            <OrderCardHandler
              orders={orders}
              orderId={orderId}
              setOrderId={setOrderId}
              reason={reason}
              orderConfirmedStatus={{ setOrderConfirmed, orderConfirmed }}
              accountIdObj={{ accountId, setAccountId }}
              manufacturerIdObj={{ manufacturerId, setManufacturerId }}
              errorListObj={{ errorList, setErrorList }}
              contactIdObj={{ contactId, setContactId }}
              accountList={accountList}
              setSubject={setSubject}
              sendEmailObj={{ sendEmail, setSendEmail }}
              Actual_Amount__cObj={{ Actual_Amount__c, setActual_Amount__c }}
              searchPoOBJ={{ searchPo, setSearchPO }}
              autoSelect={OrderId}
            />
          )}
          {reason !== "Update Account Info" && (
            <Attachements
              setFile={setFile}
              files={files}
              setDesc={setDesc}
              orderConfirmed={orderConfirmed}
              SubmitHandler={SubmitHandler}
            />
          )}
          {reason === "Update Account Info" && (
            <AccountInfo
              reason={reason}
              Accounts={accountList}
              postSupportAny={postSupportAny}
              keyToken={userData.x_access_token}
            />
          )}
        </section>
      )}
    </CustomerSupportLayout>
  );
};

export default CustomerService;
