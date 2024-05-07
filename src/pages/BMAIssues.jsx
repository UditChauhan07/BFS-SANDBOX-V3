import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout"
import BMAIHandler from "../components/IssuesHandler/BMAIHandler";
import { GetAuthData, getAllAccount, getOrderList, postSupportAny } from "../lib/store";
import OrderCardHandler from "../components/IssuesHandler/OrderCardHandler";
import Attachements from "../components/IssuesHandler/Attachements";
import { useNavigate } from "react-router-dom";

const BMAIssues = () => {
  const navigate = useNavigate();
    const [reason, setReason] = useState();
    const [accountList, setAccountList] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderId,setOrderId] = useState(null);
    const [orderConfirmed,setOrderConfirmed] = useState(false)
    const [files, setFile] = useState([]);
    const [desc,setDesc] = useState();
    const [accountId, setAccountId] = useState(null)
    const [manufacturerId, setManufacturerId] = useState(null)
    const [errorList, setErrorList] = useState({});

    const reasons = [
        { name: "Charges", icon: '/assets/charge.png', desc: "You may extra pay amount for order?" },
        { name: "Product Missing", icon: '/assets/missing.png', desc: "can't find product in Order?" },
        { name: "Product Overage", icon: '/assets/expiration.png', desc: "got expired product in order?" },
        { name: "Product Damage", icon: '/assets/damaged.png', desc: "got damage product in order?" },
        { name: "Update Account Info", icon: '/assets/account.png', desc: "change my personal details" }
    ];
    useEffect(() => {
        GetAuthData()
          .then((response) => {
            getOrderList({
              user: {
                key: response.x_access_token,
                Sales_Rep__c: true ? "00530000005AdvsAAC" : response.Sales_Rep__c,
              },
              month: "",
            })
              .then((order) => {
                setOrders(order);
              })
              .catch((error) => {
                console.log({ error });
              });
            getAllAccount({ user: response })
              .then((accounts) => {
                setAccountList(accounts);
              })
              .catch((actError) => {
                console.error({ actError });
              });
          })
          .catch((err) => {
            console.log({ err });
          });
      }, []);
      const SubmitHandler = ()=>{
        alert("coming soon")
        return;
        GetAuthData()
        .then((user) => {
          if (user) {
            let rawData = {
              orderStatusForm: {
                typeId: "0123b000000GfOEAA0",
                salesRepId: user.Sales_Rep__c,
                reason: reason,
                accountId: accountId,
                contactId: manufacturerId,
                desc: desc,
                priority: "Medium",
                sendEmail: false,
                subject: "",
              },
              key: user.x_access_token,
            };
            console.log({rawData});
            return
            postSupportAny({ rawData })
              .then((response) => {
                if (response) {
                  if (response) {
                    navigate("/CustomerSupportDetails?id=" + response);
                  }
                }
              })
              .catch((err) => {
                console.error({ err });
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }
    return (<AppLayout>
        <section>
            <BMAIHandler reasons={reasons} setReason={setReason} reason={reason}/>
            {true && <OrderCardHandler orders={orders} orderId={orderId} setOrderId={setOrderId} reason={reason} orderConfirmedStatus={{setOrderConfirmed,orderConfirmed}} accountIdObj={{accountId,setAccountId}} manufacturerIdObj={{manufacturerId,setManufacturerId}} errorListObj={{errorList,setErrorList}}/>}
            {/*  files={files} desc={desc} */}
            {true && <Attachements setFile={setFile} files={files} setDesc={setDesc} orderConfirmed={orderConfirmed} SubmitHandler={SubmitHandler}/>}
        </section>
    </AppLayout>)
}
export default BMAIssues