import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { GetAuthData, getOrderIdDetails, getSupportFormRaw, postSupport, supportClear, supportDriveBeg, supportShare, uploadFileSupport } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { OrderStatusSchema } from "../../validation schema/OrderStatusValidation";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import { BiUpload } from "react-icons/bi";
import ModalPage from "../Modal UI";

const OrderStatusFormSection = ({ setSubmitLoad }) => {
  const navigate = useNavigate();
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [supportTicketData, setTicket] = useState();
  const [activeBtn, setActive] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [orderDetails,setOrderDetail]=useState();

  useEffect(() => {
    let data = supportDriveBeg();
    setTicket(data);
    GetAuthData()
      .then((user) => {
        let rawData = {
          key: user.x_access_token,
          AccountId: data.orderStatusForm.accountId,
        };
        getSupportFormRaw({ rawData })
          .then((raw) => {
            setPrioritiesList(raw.Priority);
            setContactList(raw.ContactList);
            if(data.orderStatusForm.opportunityId){
              getOrderIdDetails({rawData:{key: user.x_access_token,id:data.orderStatusForm.opportunityId}}).then((orderDetails)=>{
                setOrderDetail(orderDetails);
                console.log({orderDetails});
              }).catch((orderErr)=>{
                console.log({orderErr});
              })
            }
          })
          .catch((error) => {
            console.error({ error });
          });
      })
      .catch((err) => {
        console.error({ err });
      });
  }, []);

  const onChangeHandler = (key, value) => {
    let temp = supportTicketData;
    temp.orderStatusForm[key] = value;

    supportShare(temp)
      .then((response) => {
        let data = supportDriveBeg();
        setTicket(data);
      })
      .catch((error) => {
        console.error({ error });
      });
  };
  const onSubmitHandler = (values) => {
    setSubmitLoad(true)
    setActive(true);
    let temp = supportTicketData;
    temp.orderStatusForm["desc"] = values.description;
    temp.orderStatusForm["contactId"] = values.contact.value.value;

    supportShare(temp)
      .then((response) => {
        let data = supportDriveBeg();
        setTicket(data);
      })
      .catch((error) => {
        console.error({ error });
      });

    GetAuthData()
      .then((user) => {
        if (!supportTicketData.orderStatusForm.salesRepId) {
          supportTicketData.orderStatusForm.salesRepId = user.Sales_Rep__c;
        }
        supportTicketData.key = user.x_access_token;
        postSupport({ rawData: supportTicketData })
          .then((response) => {
            let flush = supportClear();
            if (response) {
              if (files.length > 0) {
                uploadFileSupport({ key: user?.data?.x_access_token, supportId: response, files }).then((fileUploader) => {
                  if (fileUploader) {
                    setSubmitLoad(false)
                    navigate("/CustomerSupportDetails?id=" + response);
                  }
                }).catch((fileErr) => {
                  setSubmitLoad(false)
                  console.log({ fileErr });
                })
              } else {
                setSubmitLoad(false)
                navigate("/CustomerSupportDetails?id=" + response);
              }
            }
          })
          .catch((err) => {
            console.error({ err });
          });
      })
      .catch((error) => {
        console.error({ error });
      });
    return;
  };
  const initialValues = {
    description: supportTicketData?.orderStatusForm?.desc || "",
    contact:
      supportTicketData?.orderStatusForm?.contactId || ""
  };
  let [files, setFile] = useState([])

  function handleChange(e) {
    let tempFile = [...files];
    let reqfiles = e.target.files;
    if (reqfiles) {
      if (reqfiles.length > 0) {
        Object.keys(reqfiles).map((index) => {
          let url = URL.createObjectURL(reqfiles[index])
          if (url) {
            tempFile.push({ preview: url, file: reqfiles[index] });
          }
          // this thoughing me Failed to execute 'createObjectURL' on 'URL': Overload resolution failed?
        })
      }
    }
    setFile(tempFile);
  }

  const fileRemoveHandler = (index) => {
    let tempFile = [...files];
    tempFile.splice(index, 1)
    setFile(tempFile);
  }

  const SearchableSelect = (FieldProps) => {
    return (
      <Select
        type="text"
        options={FieldProps.options}
        {...FieldProps.field}
        onChange={(option) => {
          console.log(option, FieldProps);
          FieldProps.form.setFieldValue(FieldProps.field.name, option);
        }}
        value={FieldProps.options ? FieldProps.options.find((option) => option.value === FieldProps.field.value?.value) : ""}
      />
    );
  };
  if(supportTicketData?.orderStatusForm?.opportunityId){
    return(<section>
      <div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Code</th>
                <th>Product Price</th>
                <th>Product Qty</th>
              </tr>
            </thead>
          </table>
        </div>
        <div>

        </div>
      </div>
    </section>)
  }else{
  return (
    <>
      <ModalPage
        open={confirm || false}
        content={
          <div className="d-flex flex-column gap-3">
            <h2>
              Confirm  
            </h2>
            <p>
              Are you sure you want to generate a ticket?<br/> This action cannot be undone.<br/> You will be redirected to the ticket page after the ticket is generated.
            </p>
            <div className="d-flex justify-content-around ">
              <button className={styles.btn} onClick={() => onSubmitHandler(confirm)}>
                Submit
              </button>
              <button className={styles.btn} onClick={() => setConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        }
        onClose={() => {
          setConfirm(false);
        }}
      />

      <Formik initialValues={initialValues} validationSchema={OrderStatusSchema} onSubmit={(values) => { setConfirm(values) }}>

        {(formProps) => (
          <div className={styles.container}>
            <Form className={styles.formContainer}>
              <b className={styles.containerTitle}>{supportTicketData?.orderStatusForm?.reason}</b>
              <label className={styles.labelHolder}>
                Contact Name
                <Field name="contact.value" className="contact" options={contactList.map((contact) => ({ label: contact.Name, value: contact.Id }))} component={SearchableSelect} />
              </label>
              <ErrorMessage component={TextError} name="contact" />

              <label className={styles.labelHolder}>
                Describe your issues
                <Field component="textarea" placeholder="Description" rows={4} name="description" defaultValue={initialValues.description}></Field>
              </label>
              <ErrorMessage component={TextError} name="description" />
              <div className={styles.attachHolder}>
                <p className={styles.subTitle}>upload some attachments</p>
                <label className={styles.attachLabel} for="attachement"><div><div className={styles.attachLabelDiv}><BiUpload /></div></div></label>
                <input type="file" style={{ width: 0, height: 0 }} id="attachement" onChange={handleChange} multiple accept="image/*" />
                <div className={styles.imgHolder}>
                  {files.map((file, index) => (
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', right: '5px', top: '-5px', color: '#000', zIndex: 1, cursor: 'pointer', fontSize: '18px' }} onClick={() => { fileRemoveHandler(index) }}>x</span>
                      <a href={file?.preview} target="_blank" title="Click to Download">
                        <img src={file?.preview} key={index} alt={file?.preview} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              {/* <label className="mt-2">
              <input
                type="checkbox"
                checked={supportTicketData?.orderStatusForm?.sendEmail}
                onChange={(e) => {
                  onChangeHandler("sendEmail", e.target.checked);
                }}
              />
              &nbsp;Send Updates via email
            </label> */}
              <div className={styles.dFlex}>
                {" "}
                <Link to={"/orderStatus"} className={styles.btn}>
                  Cancel
                </Link>
                <input type="submit" className={styles.btn} value={"Submit"} disabled={activeBtn} />
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}
};
export default OrderStatusFormSection;
