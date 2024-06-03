import { ErrorMessage, Field, Form, Formik } from "formik";
import TextError from "../../validation schema/TextError";
import Select from "react-select";
import styles from "../OrderStatusFormSection/style.module.css";
import { AccountInfoValidation } from "../../validation schema/AccountInfoValidation";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { uploadFileSupport } from "../../lib/store";
const AccountInfo = ({ reason, typeId, Accounts, postSupportAny, GetAuthData, setSubmitForm }) => {
    const navigate = useNavigate();
    const [contactList, setContactList] = useState([]);
    let [files, setFile] = useState([])

    const initialValues = {
        description: "",
        account: null,
        contact: null
    };
    if (!typeId) return null;
    const SearchableSelect = (FieldProps) => {
        return (
            <Select
                type="text"
                options={FieldProps.options}
                {...FieldProps.field}
                onChange={(option) => {
                    Accounts.map((a) => {
                        if (a.Id == option.value) {
                            setContactList(a.contact)
                        }
                    })
                    FieldProps.form.setFieldValue(FieldProps.field.name, option);
                    FieldProps.form.setFieldValue("contact", null);
                }}
                value={FieldProps.options ? FieldProps.options.find((option) => option.value === FieldProps.field.value?.value) : ""}
            />
        );
    };
    const SearchableSelect1 = (FieldProps) => {
        return (
            <Select
                type="text"
                options={FieldProps.options}
                {...FieldProps.field}
                onChange={(option) => {
                    FieldProps.form.setFieldValue(FieldProps.field.name, option);
                }}
                value={FieldProps.options ? FieldProps.options.find((option) => option.value === FieldProps.field.value?.value) : ""}
            />
        );
    };
    let typeName = {
        "0123b0000007z9pAAA": "Customer Service",
        "0123b000000GfOEAA0": "Brand Management Approval"
    }
    const onSubmitHandler = (values) => {
        let subject = `${typeName[typeId]} for ${reason}`;
        setSubmitForm(true)
        GetAuthData()
            .then((user) => {
                if (user) {
                    let rawData = {
                        orderStatusForm: {
                            typeId,
                            reason,
                            salesRepId: user.Sales_Rep__c,
                            accountId: values.account?.value,
                            contactId: values.contact?.value,
                            desc: values.description,
                            priority: "Medium",
                            subject,
                            sendEmail: true
                        },
                        key: user.x_access_token,
                    };
                    postSupportAny({ rawData })
                        .then((response) => {
                            if (response) {
                                if (response) {
                                    if (files.length > 0) {

                                        uploadFileSupport({ key: user.x_access_token, supportId: response, files }).then((fileUploader) => {
                                            if (fileUploader) {
                                                navigate("/CustomerSupportDetails?id=" + response);
                                            }
                                        }).catch((fileErr) => {
                                            console.log({ fileErr });
                                        })
                                    } else {
                                        navigate("/CustomerSupportDetails?id=" + response);
                                    }
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
    function handleChange(e) {
        let tempFile = [];
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
    return (
        <Formik initialValues={initialValues} validationSchema={AccountInfoValidation} onSubmit={onSubmitHandler}>
            {(formProps) => (
                <div className={styles.container}>
                    <Form className={styles.formContainer}>
                        <b className={styles.containerTitle}>{reason}</b>

                        <label className={styles.labelHolder}>
                            Account Name
                            <Field name="account" className="account" options={Accounts.map((account) => ({ label: account.Name, value: account.Id }))} component={SearchableSelect} />
                        </label>
                        <ErrorMessage component={TextError} name="account" />
                        <label className={styles.labelHolder}>
                            Contact Name
                            <Field name="contact" className="contact" options={contactList.map((contact) => ({ label: contact.Name, value: contact.Id }))} component={SearchableSelect1} />
                        </label>
                        <ErrorMessage component={TextError} name="contact" />

                        <label className={styles.labelHolder}>
                            Describe your details that want to update
                            <Field component="textarea" placeholder="Description" rows={4} name="description" defaultValue={initialValues.description}></Field>
                        </label>
                        <ErrorMessage component={TextError} name="description" />
                        <div className={styles.attachHolder}>
                            <p className={styles.subTitle}>upload some attachments</p>
                            <label className={styles.attachLabel} for="attachement"><div><div className={styles.attachLabelDiv}><BiUpload /></div></div></label>
                            <input type="file" style={{ width: 0, height: 0 }} id="attachement" onChange={handleChange} multiple accept="image/*" />
                            <div className={styles.imgHolder}>
                                {files.map((file, index) => (
                                    <a href={file?.preview} target="_blank" title="Click to Download">
                                        <img src={file?.preview} key={index} alt={file?.preview} />
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className={styles.dFlex}>
                            {" "}
                            <Link to={"/customer-support"} className={styles.btn}>
                                Cancel
                            </Link>
                            <input type="submit" className={styles.btn} value={"Submit"} />
                        </div>
                    </Form>
                </div>
            )}
        </Formik>
    );
}
export default AccountInfo