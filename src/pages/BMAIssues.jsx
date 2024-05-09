import { useEffect, useState } from "react";
import BMAIHandler from "../components/IssuesHandler/BMAIHandler";
import { GetAuthData, getAllAccount, getOrderList, postSupportAny } from "../lib/store";
import OrderCardHandler from "../components/IssuesHandler/OrderCardHandler";
import Attachements from "../components/IssuesHandler/Attachements";
import { useNavigate } from "react-router-dom";
import CustomerSupportLayout from "../components/customerSupportLayout";

const BMAIssues = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState();
  const [accountList, setAccountList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [sendEmail, setSendEmail] = useState(false)
  const [files, setFile] = useState([]);
  const [desc, setDesc] = useState();
  const [subject, setSubject] = useState();
  const [accountId, setAccountId] = useState(null)
  const [contactId, setContactId] = useState(null)
  const [manufacturerId, setManufacturerId] = useState(null)
  const [Actual_Amount__c, setActual_Amount__c] = useState(null)
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
            Sales_Rep__c: false ? "00530000005AdvsAAC" : response.Sales_Rep__c,
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

  const SubmitHandler = () => {
    GetAuthData()
      .then((user) => {
        if (user) {
          let errorlistObj = Object.keys(errorList);
          let systemStr = "";
          if (errorlistObj.length) {
            errorlistObj.map((id) => {
              systemStr += `${errorList[id].Name}(${errorList[id].ProductCode}) having ${reason} for ${errorList[id].issue} out of ${errorList[id].Quantity} Qty.\n`
            })
          }
          let newDesc = "Issue Desc:"+systemStr
          if (desc) newDesc ="User Desc:"+ desc + " \n Issue Desc:" + systemStr

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
              // Associated_Order_Number__c:null,
              // Associated_PO_Number__c:null,
              Actual_Amount__c,
            },
            key: user.x_access_token,
          };
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
  return (<CustomerSupportLayout>
    <section>
      <BMAIHandler reasons={reasons} setReason={setReason} reason={reason} />
      {true && <OrderCardHandler orders={orders} orderId={orderId} setOrderId={setOrderId} reason={reason} orderConfirmedStatus={{ setOrderConfirmed, orderConfirmed }} accountIdObj={{ accountId, setAccountId }} manufacturerIdObj={{ manufacturerId, setManufacturerId }} errorListObj={{ errorList, setErrorList }} contactIdObj={{ contactId, setContactId }} accountList={accountList} setSubject={setSubject} sendEmailObj={{ sendEmail, setSendEmail }} Actual_Amount__cObj={{ Actual_Amount__c, setActual_Amount__c }} />}
      {/*  files={files} desc={desc} */}
      {true && <Attachements setFile={setFile} files={files} setDesc={setDesc} orderConfirmed={orderConfirmed} SubmitHandler={SubmitHandler} />}
    </section>
  </CustomerSupportLayout>)
}
export default BMAIssues