import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { GetAuthData, getSupportFormRaw, postSupport, supportClear, supportDriveBeg, supportShare, uploadFileSupport } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { OrderStatusSchema } from "../../validation schema/OrderStatusValidation";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import { BiUpload } from "react-icons/bi";
import Loading from "../Loading";

const OrderStatusFormSection = ({ setSubmitLoad }) => {
  const navigate = useNavigate();
  const [prioritiesList, setPrioritiesList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [supportTicketData, setTicket] = useState();
  const [activeBtn, setActive] = useState(false);

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

  const fileRemoveHandler = (index)=>{
    let tempFile = [...files];
    tempFile.splice(index,1)
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
  return (
    <Formik initialValues={initialValues} validationSchema={OrderStatusSchema} onSubmit={onSubmitHandler}>
      {(formProps) => (
        <div className={styles.container}>
          <Form className={styles.formContainer}>
            <b className={styles.containerTitle}>Order Status : {supportTicketData?.orderStatusForm?.reason}</b>
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
                    <span style={{ position: 'absolute', right: '5px', top: '-5px', color: '#000', zIndex: 1, cursor: 'pointer', fontSize: '18px' }} onClick={()=>{fileRemoveHandler(index)}}>x</span>
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
  );
};
export default OrderStatusFormSection;
