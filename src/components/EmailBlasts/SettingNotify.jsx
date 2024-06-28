import { useEffect, useState } from "react";
import StyleSheet from "./SettingNotify.module.css"
import { BiArrowBack, BiSave } from "react-icons/bi";
import ModalPage from "../Modal UI";
import { GetAuthData, createRandomHandler, storeDatesHandler, storeRandomHandler } from "../../lib/store";
import Loading from "../Loading";
import Switch from "react-switch";

const SettingNotify = ({ setSetting, notifyDate, getDataHandler ,setContactList}) => {
    const [size, setSize] = useState(notifyDate.length ?? 0);
    const [isTab, setIsTab] = useState(1);
    const [loader, setLoaded] = useState(false)
    let option = [{ lable: "Select Date for Notification", value: 0 }, { lable: 1, value: 1 }, { lable: 2, value: 2 }, { lable: 3, value: 3 }, { lable: 4, value: 4 }, { lable: 5, value: 5 }, { lable: 6, value: 6 }, { lable: 7, value: 7 }, { lable: 8, value: 8 }, { lable: 9, value: 9 }, { lable: 10, value: 10 }, { lable: 11, value: 11 }, { lable: 12, value: 12 }, { lable: 13, value: 13 }, { lable: 14, value: 14 }, { lable: 15, value: 15 }, { lable: 16, value: 16 }, { lable: 17, value: 17 }, { lable: 18, value: 18 }, { lable: 19, value: 19 }, { lable: 20, value: 20 }, { lable: 21, value: 21 }, { lable: 22, value: 22 }, { lable: 23, value: 23 }, { lable: 24, value: 24 }, { lable: 25, value: 25 }, { lable: 26, value: 26 }, { lable: 27, value: 27 }, { lable: 28, value: 28 }]
    const [formAlert, setFormAlert] = useState(false);
    const [sizeAlert, setSizeAlert] = useState(false)
    const [isRandom, setRandom] = useState(false);
    const notifyDateHandler = (e) => {
        const { value } = e.target;
        if (parseInt(value) > 0) {
            if (parseInt(value) > 29) {
                setSizeAlert(true)
                setSize(notifyDate.length)
                e.target.value = notifyDate.length
                filledValue()
            } else {
                setSize(parseInt(value))
            }
        } else {
            e.target.value = null;
            setSize(0)
        }
    }
    useEffect(() => {
        let freqElement = document.getElementById("freq")
        if (freqElement && notifyDate.length) {
            freqElement.value = notifyDate.length
            filledValue();
        }
    }, [isTab])
    const filledValue = () => {
        notifyDate.map((element, _i) => {
            let freqSelElement = document.getElementById("freq" + _i)
            if (freqSelElement) {
                freqSelElement.value = element.date
            }
        })
    }
    const submitHandler = () => {
        let values = [];
        setContactList({ isLoaded: false, data: [] })
        new Array(size).fill(1).map((element, index) => {
            let elementId = document.getElementById("freq" + index);
            let elementEId = document.getElementById("freq" + index + "E");
            if (elementId && elementEId) {
                let value = elementId.value;
                elementEId.style.display = "none";
                if (parseInt(value)) {
                    values.push(value);
                    elementId.style.border = null
                } else {
                    elementEId.style.display = "block";
                    elementId.style.border = "1px solid red"
                }
            }
        })
        if (values.length == size) {
            setLoaded(true)
            GetAuthData().then((user) => {
                storeDatesHandler({ key: user.x_access_token, dates: values }).then((resposne) => {
                    if (resposne) {
                        setSetting(false)
                        // setLoaded(false)
                        getDataHandler()
                    }
                }).catch((resErr) => {
                    console.log({ resErr });
                })
            }).catch((err) => {
                console.log({ err });
            })
        } else {
            setFormAlert(true)
        }
    }
    const randomSubmitHandler = ()=>{
        storeRandomHandler({key:'12dffsw33rffd',random:isRandom}).then((result)=>{
            console.log({result});
            if(result){
                createRandomHandler().then((res)=>{
                    console.log({res});
                }).catch((err)=>{
                    console.log({err});
                })
            }
        }).catch((error)=>{
            console.log({error});
        })
    }
    function ordinal_suffix_of(i) {
        return i + (i === 1 ? 'st' : i === 2 ? 'nd' : i === 3 ? 'rd' : 'th');
    }
    return (
        <div className={StyleSheet.container}>
            {loader ? <Loading height={'70vh'} /> :
                <>
                    <ModalPage
                        open={formAlert ?? false}
                        content={
                            <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                                <h2>Empty Fields</h2>
                                <p style={{ lineHeight: '22px' }}>
                                    Please fill form to submit!
                                </p>
                                <div className="d-flex justify-content-around ">
                                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setFormAlert(false)}>
                                        OK
                                    </button>
                                </div>
                            </div>
                        }
                        onClose={() => {
                            setFormAlert(false);
                        }}
                    />
                    <ModalPage
                        open={sizeAlert ?? false}
                        content={
                            <div className="d-flex flex-column gap-3" style={{ maxWidth: '700px' }}>
                                <h2>Invalid Value</h2>
                                <p style={{ lineHeight: '22px' }}>
                                    Please Enter valid Frequency!!!<br />All value reset to default.
                                </p>
                                <div className="d-flex justify-content-around ">
                                    <button style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Montserrat-600', fontSize: '14px', fontStyle: 'normal', fontWeight: '600', height: '30px', letterSpacing: '1.4px', lineHeight: 'normal', width: '100px' }} onClick={() => setSizeAlert(false)}>
                                        OK
                                    </button>
                                </div>
                            </div>
                        }
                        onClose={() => {
                            setSizeAlert(false);
                        }}
                    />
                    <div className={StyleSheet.formContainer}>
                        <b className={StyleSheet.containerTitle}>Set Frequency of the email</b>
                        <div className="d-flex gap-2">
                            <p style={isTab == 1 ? { textDecoration: 'underline' } : {}} onClick={() => { setIsTab(1) }}>Manual</p>
                            <p style={isTab == 2 ? { textDecoration: 'underline' } : {}} onClick={() => { setIsTab(2) }}>Random</p>
                        </div>
                        {isTab == 1 ? <>
                            <div className="">
                                <label for="freq" className={StyleSheet.labelHolder}>Enter the frequency for email
                                    <input type="number" autoComplete="off" id="freq" placeholder="" onKeyUp={notifyDateHandler} className="form-control" />
                                </label>
                            </div>
                            {size > 0 ? new Array(size).fill(1).map((item, i) => {
                                return (
                                    <div className="">
                                        <label for={"freq-" + i} className={StyleSheet.labelHolder}>Set date for the {ordinal_suffix_of(i + 1)} email
                                            <select className="form-control" id={"freq" + i} name={"freq" + i}>
                                                {option.map((Element) => (
                                                    <option value={Element.value}>{Element.lable}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <p className="ml-2 text-sm" style={{ color: 'red', display: 'none' }} id={"freq" + i + "E"}>This field is required.</p>
                                    </div>
                                );
                            }) : null}

                            <div className="mt-4 d-flex">
                                <button className={`${StyleSheet.submitButton} d-flex  justify-content-center align-items-center`} onClick={() => setSetting(false)}><BiArrowBack />&nbsp;Back</button>
                                {size ? <button onClick={submitHandler} className={`${StyleSheet.submitButton} d-flex  justify-content-center align-items-center`}><BiSave />&nbsp;Submit</button> : null}
                            </div>
                        </> : <div>
                            <div className="">
                                <label className={StyleSheet.labelHolder}>
                                    Select box for Random Dates:
                                    &nbsp;
                                    <Switch onChange={(e) => setRandom(e)} checked={isRandom} />
                                </label>
                                <div className="mt-4 d-flex">
                                    <button className={`${StyleSheet.submitButton} d-flex  justify-content-center align-items-center`} onClick={() => setSetting(false)}><BiArrowBack />&nbsp;Back</button>
                                    {size ? <button onClick={randomSubmitHandler} className={`${StyleSheet.submitButton} d-flex  justify-content-center align-items-center`}><BiSave />&nbsp;Submit</button> : null}
                                </div>
                            </div>
                        </div>}
                    </div></>}
        </div>
    );

}

export default SettingNotify