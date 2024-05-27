import { useState } from "react";
import StyleSheet from "./SettingNotify.module.css"

const SettingNotify = () => {
    const [size, setSize] = useState(0);
    let option = [{ lable: "Select Date for Notification", value: 0 }, { lable: 1, value: 1 }, { lable: 2, value: 2 }, { lable: 3, value: 3 }, { lable: 4, value: 4 }, { lable: 5, value: 5 }, { lable: 6, value: 6 }, { lable: 7, value: 7 }, { lable: 8, value: 8 }, { lable: 9, value: 9 }, { lable: 10, value: 10 }, { lable: 11, value: 11 }, { lable: 12, value: 12 }, { lable: 13, value: 13 }, { lable: 14, value: 14 }, { lable: 15, value: 15 }, { lable: 16, value: 16 }, { lable: 17, value: 17 }, { lable: 18, value: 18 }, { lable: 19, value: 19 }, { lable: 20, value: 20 }, { lable: 21, value: 21 }, { lable: 22, value: 22 }, { lable: 23, value: 23 }, { lable: 24, value: 24 }, { lable: 25, value: 25 }, { lable: 26, value: 26 }, { lable: 27, value: 27 }, { lable: 28, value: 28 }, { lable: 29, value: 29 }, { lable: 30, value: 30 }, { lable: 31, value: 31 }

    ]
    const notifyDateHandler = (e) => {
        const { value } = e.target;
        if (value){
            setSize(parseInt(value))
        }else{
            setSize(0)
        }
    }
    const submitHandler = () => {
        console.log({ size });
        new Array(size).fill(1).map((element, index) => {
            let elementId = document.getElementById("freq" + index);
            if (elementId) {
                let value = elementId.value;
                if (parseInt(value)) {
                    elementId.style.border = null
                    console.log({ value: elementId.value });
                } else {
                    elementId.style.border = "1px solid red"
                }
            }
        })
    }
    return (
        <div className={StyleSheet.settingContainer}>
            <div className="form-group">
                <label for="freq">enter frequency for notification
                </label>
                <input type="text" id="freq" placeholder="" onKeyUp={notifyDateHandler} className="form-control" />
            </div>
            {size > 0 ? new Array(size).fill(1).map((item, i) => {
                return (
                    <div className="form-group">
                        <label for={"freq-" + i}>Select freq date for freq {i + 1}
                                </label>
                            <select className="form-control" id={"freq" + i} name={"freq" + i}>
                                {option.map((Element) => (
                                    <option value={Element.value}>{Element.lable}</option>
                                ))}
                            </select>
                    </div>
                );
            }) : null}
            {size ?<div className="mt-4"><button onClick={submitHandler} className={StyleSheet.submitButton}>Submit</button></div>:null}
        </div>
    );

}

export default SettingNotify