import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import './MultiStepForm.css'; // Import the CSS file
import MultiSelectSearch from '../../SearchBox';
import { createNewsletter, fetchNewsletterData, fetchNextMonthNewsletterBrand, GetAuthData, originAPi, ShareDrive } from '../../../lib/store';
import Styles from './index.module.css';
import Loading from '../../Loading';
import ModalPage from '../../Modal UI';
import { BiExit } from 'react-icons/bi';
import ToggleSwitch from '../../ToggleButton';
import { FaEye } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderIcon } from '../../../lib/svg';

const contactLocalKey = "lCpFhWZtGKKejSX"

const MultiStepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [manufacturers, setManufacturers] = useState({ isLoaded: false, data: [] })
    const [Subscribers, setSubscribers] = useState({ isLoaded: false, users: [], contacts: [] })
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [callBackError, setCallbackError] = useState(false);
    const [callBackErrorMsg, setCallbackErrorMsg] = useState();
    const [isSubmit, setIsSubmit] = useState(false)
    const [isSchedule, setIsSchedule] = useState(false)
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subscriber: [],
        template: null,
        brand: [],
        date: null,
        subject: null,
        newsletter: null
    });
    const [showBrandList, setshowBrandList] = useState([]);

    useEffect(() => {
        let brandIdsArray = formData.subscriber.map(item => item?.BrandIds);
        const allBrandIds = brandIdsArray.flat();
        const uniqueBrandIds = [...new Set(allBrandIds)];
        const filteredBrands = manufacturers?.data?.filter(brand => uniqueBrandIds.includes(brand.Id));
        formData.subscriber?.some((user) => {
            if (!user.AccountId) {
                setIsUserSelected(true);
                return true; // This stops the iteration once AccountId is found
            }
            setIsUserSelected(false)
            return false; // Continue the iteration if AccountId is not found
        });
        if (isUserSelected) {

            setshowBrandList(manufacturers?.data)
        } else {

            setshowBrandList(filteredBrands)
        }
    }, [formData, isUserSelected])

    useEffect(() => {
        GetAuthData().then((user) => {
            
            fetchNextMonthNewsletterBrand({ key: user.x_access_token, date: formData.date?formData.date.toLocaleDateString("en-GB"):null }).then((brandRes) => {
                setFormData({ ...formData, brand: [] });
                setManufacturers({ isLoaded: true, data: brandRes })
            }).catch((brandErr) => {
                console.log({ brandErr });
            })

        }).catch((userErr) => {
            console.log(userErr)
        })
    }, [formData.date])

    const handleAccordionClick = (step) => {

        if (step === 3 && !formData.subscriber.length) {
            // alert('Please select a subscriber first.');
            setCallbackError(true)
            setCallbackErrorMsg('Please select a subscriber first.')
            return;
        }
        if (step === 4 && (!formData.template)) {
            setCallbackError(true)
            setCallbackErrorMsg('Please select a template')
            return;
        }
        if (step === 2 && (!formData.newsletter || !formData.subject)) {
            if (!formData.newsletter) {
                setCallbackError(true)
                setCallbackErrorMsg('Please enter newsletter name');
            }
            if (!formData.subject) {
                setCallbackError(true)
                setCallbackErrorMsg('Please enter subject');
            }
            return;
        }
        setCurrentStep(step);
    };


    const handleChange = (e) => {
        const { value, name } = e.target;
        if (name === "brand") {
            setFormData((prevFormData) => {
                const brandAlreadySelected = prevFormData.brand.includes(value);

                // If brand is already selected, remove it; otherwise, add it
                const updatedBrandSelection = brandAlreadySelected
                    ? prevFormData.brand.filter((brandId) => brandId !== value)
                    : [...prevFormData.brand, value];

                return { ...prevFormData, brand: updatedBrandSelection };
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDateChange = (value)=>(   
        setFormData({ ...formData, date:value})
    )
    const contactList = Subscribers.contacts.filter(item1 =>
        formData.subscriber.some(item2 => item2.Id === item1.Id)
    )
    console.log({contactList});
    const handleSubmit = (e) => {
        if (currentStep === 4 && (!formData.brand.length)) {
            setCallbackError(true)
            setCallbackErrorMsg('Please select a brand')
            return;
        }
        e.preventDefault();
        const contactList = Subscribers.contacts.filter(item1 =>
            formData.subscriber.some(item2 => item2.Id === item1.Id)
        )
        console.log({contactList});
        return;
        setIsSubmit(true)
        const userIds = Subscribers.users.filter(item1 =>
            formData.subscriber.some(item2 => item2.Id === item1.Id)
        ).map(item => item.Id);
        const contactIds = contactList.map(item => item.Id);

        let body = {
            newsletter: formData.newsletter,
            subject: formData.subject,
            template: formData.template,
            brandIds: JSON.stringify(formData.brand),
            date: formData.date?formData.date.toLocaleDateString("en-GB"):null,
            contactIds: JSON.stringify(contactIds),
            userIds: JSON.stringify(userIds)
        }

        createNewsletter(body).then((result) => {
            if (result.status) {
                window.location.href = "/newsletter"
                setCurrentStep(1);
                setIsSubmit(false);
                setFormData({
                    subscriber: [],
                    template: '',
                    brand: [],
                    date: '',
                    subject: '',
                    newsletter: ''
                });
            } else {
                setIsSubmit(false)
                setCallbackError(true)
                setCallbackErrorMsg(result.message)
            }

        }).catch((err) => {
            console.log({ err });

        })
    };

    useEffect(() => { }, [callBackError])

    useEffect(() => {
        setLoading(true);
        const loadData = async () => {
            try {
                if (!Subscribers.isLoaded) {
                    let user = await GetAuthData();
                    const token = user?.x_access_token;
                    if (!token) {
                        throw new Error('Access token is not available');
                    }

                    const response = await fetchNewsletterData({ token });
                    console.log({ response });
                    

                    ShareDrive(response, false, contactLocalKey)
                    const contactList = response.contactList.filter(item => item.BrandIds && item.BrandIds.length);
                    setSubscribers({ isLoaded: true, users: response.userList, contacts: contactList })
                    setAllSubscribers([...response.userList, ...contactList])
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        let localCall = ShareDrive(null, null, contactLocalKey)

        if (localCall) {
            const contactList = localCall.contactList.filter(item => item.BrandIds && item.BrandIds.length);
            setSubscribers({ isLoaded: true, users: localCall.userList, contacts: contactList})
            setAllSubscribers([...localCall.userList, ...contactList])
            setTimeout(() => {

                setLoading(false);
            }, 1000);
        } else {
            loadData();
        }

    }, [currentStep]);


    useEffect(() => {


    }, [formData.subscriber])

    const handleSelectionChange = (newSelectedValues) => {
        setFormData((prev) => {
            return { ...prev, subscriber: newSelectedValues, brand: [] };
        }
        )
    };
    const ImageWithFallback = ({ src, alt, fallbackSrc, ...props }) => {
        if (!fallbackSrc) fallbackSrc = originAPi + "/dummy.png"
        const handleError = (e) => {
            e.target.onerror = null; // Prevent infinite loop if fallback image also fails
            e.target.src = fallbackSrc;
        };

        return <img src={src} alt={alt} onError={handleError} {...props} />;
    };
    function getDate() {
        var today = new Date();

        document.getElementById("date").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    }
    
    const DatePickerLabel = forwardRef(({ value, onClick }, ref) => (
        <button type='button' className='w-[100%] d-flex justify-content-between align-items-center m-0' style={{ background: '#fff', color: '#000', height: '50px', padding: '15px' }} onClick={onClick} ref={ref}>
            <span>{value}</span>
            <CalenderIcon fill='#000' />
        </button>
    ));
    return (
        <div className="form-container create-newsletter">
            {isSubmit ? <Loading height={'500px'} /> :
                <>
                    {callBackError ? <ModalPage
                        open={callBackError ?? false}
                        content={<div className="d-flex flex-column gap-3">
                            <h2>
                                Alert!!!
                            </h2>
                            <p className={Styles.modalContent}>
                                {callBackErrorMsg}
                            </p>
                            <div className="d-flex justify-content-around">
                                <button className={`${Styles.btn} d-flex align-items-center`} onClick={() => { setCallbackError(false); setCallbackErrorMsg(); }}>
                                    <BiExit /> &nbsp;Ok
                                </button>
                            </div>
                        </div>}
                        onClose={() => { setCallbackError(false); setCallbackErrorMsg(); }}
                    /> : null}
                    <form onSubmit={handleSubmit} className="multi-step-form">
                        {/* Progress Bar */}
                        {/* <div className="progress-bar">
                    <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                        1
                    </div>
                    <div className={`progress-line ${currentStep > 1 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                        2
                    </div>
                    <div className={`progress-line ${currentStep > 2 ? 'active' : ''}`}></div>
                    <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                        3
                    </div>
                </div> */}

                        <div className="accordion-item">
                            <div
                                className={`accordion-header ${currentStep === 1 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(1)}
                            >
                                <h3>Newsletter Details</h3>
                                <span>{currentStep === 1 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 1 && (
                                <div className="accordion-body">
                                    <div className='mt-4 pt-3'>
                                        <div className='d-flex justify-content-between'>

                                            <label style={{ width: '68%' }} className="text-[15px] text-[#000] font-['Montserrat-400'] text-start">
                                                <b>Newsletter Title:</b>
                                                <input
                                                    type="text"
                                                    name="newsletter"
                                                    value={formData.newsletter}
                                                    onChange={handleChange}
                                                    placeholder="Enter newsletter"
                                                    required
                                                />
                                            </label>
                                            <label style={{ width: '30%' }} className="text-[16px] text-[#000] font-['Montserrat-400'] text-start">
                                                <b>Send Type:</b>
                                                <div className="d-flex mt-3 h-full text-[16px] text-[#000]">
                                                    Send Now&nbsp;&nbsp;<ToggleSwitch selected={isSchedule} onToggle={(value) => { setIsSchedule(value); handleChange({ target: { value: null, name: "date" } }) }} />&nbsp;&nbsp;Schedule later
                                                </div>
                                            </label>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <label style={{ width: '68%' }} className="text-[16px] font-['Montserrat-400'] text-start">
                                                <b>Subject:</b>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="Enter subject"
                                                    required
                                                />
                                            </label>
                                            <label style={{ width: '30%' }} className="text-[16px] font-['Montserrat-400'] text-start">
                                                <b>Date:</b>
                                                <div id='newsletterDateSelector'>
                                                    <DatePicker
                                                        selected={formData.date}
                                                        onChange={handleDateChange}
                                                        dateFormat="MMM/dd/yyyy"
                                                        popperPlacement="auto"
                                                        popperModifiers={{
                                                            preventOverflow: {
                                                                enabled: true,
                                                            },
                                                        }}
                                                        disabled={!isSchedule}
                                                        customInput={<DatePickerLabel />}
                                                    // showMonthDropdown // Allows users to change the month easily
                                                    // showYearDropdown  // Allows users to change the year easily
                                                    // dropdownMode="select" // Avoid closing on month/year change
                                                    />
                                                </div>
                                                {/* <input
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required={isSchedule}
                                                    disabled={!isSchedule}
                                                    onLoad={getDate}
                                                /> */}
                                                {/* <DatePicker selected={new Date()} onChange={() => handleChange({ target: { value: null, name: "date" } })} dateFormat="MMM/dd/yyyy" customInput={<ExampleCustomInput />} /> */}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="accordion-item">
                            <div
                                className={`accordion-header ${currentStep === 2 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(2)}
                            >
                                <h3>Subscribers</h3>
                                <span>{currentStep === 2 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 2 && (
                                <>
                                    <div className="accordion-body">
                                        <MultiSelectSearch
                                            loading={(!Subscribers.isLoaded || loading) ? <div className='m-auto'><Loading height={'100px'} /></div> : null}
                                            options={allSubscribers}
                                            selectedValues={formData.subscriber}
                                            onChange={handleSelectionChange}
                                            manufacturers={manufacturers?.data || []}
                                        />

                                    </div>
                                </>
                            )}
                        </div>

                        {/* Step 2: Template and Brand Selection */}
                        <div className="accordion-item text-[16px] font-[Montserrat-400]">
                            <div
                                className={`accordion-header ${currentStep === 3 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(3)}
                            >
                                <h3>Template Selection</h3>
                                <span>{currentStep === 3 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 3 && (
                                <div className="accordion-body">
                                    <div className="text-start">
                                        <b>Select Template:</b>
                                        <div className={`${Styles.dFlex} mt-4`}>
                                            <div
                                                className={`${Styles.templateHolder} ${formData.template == 1 ? Styles.selected : ''}`}
                                                onClick={() => handleChange({ target: { value: 1, name: "template" } })}
                                            >
                                                <input
                                                    type="radio"
                                                    name="template"
                                                    checked={formData.template == 1}
                                                    value={1}
                                                    required
                                                    className={Styles.hiddenRadio}
                                                />
                                                <img src="/assets/templates/1.png" alt="Template 2" />
                                                <div
                                                    className={Styles.previewIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering the brand selection
                                                        window.open(`/assets/templates/1.png`, '_blank');
                                                    }}
                                                >
                                                    <FaEye />
                                                </div>
                                            </div>
                                            <div
                                                className={`${Styles.templateHolder} ${formData.template == 2 ? Styles.selected : ''}`}
                                                onClick={() => handleChange({ target: { value: 2, name: "template" } })}
                                            >
                                                <input
                                                    type="radio"
                                                    name="template"
                                                    checked={formData.template == 2}
                                                    value={2}
                                                    required
                                                    className={Styles.hiddenRadio}
                                                />
                                                <img src="/assets/templates/2.png" alt="Template 1" />
                                                <div
                                                    className={Styles.previewIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering the brand selection
                                                        window.open(`/assets/templates/2.png`, '_blank');
                                                    }}
                                                >
                                                    <FaEye />
                                                </div>
                                            </div>
                                            <div
                                                className={`${Styles.templateHolder} ${formData.template == 3 ? Styles.selected : ''}`}
                                                // onClick={() => handleChange({ target: { value: 3, name: "template" } })}
                                                onClick={() => { setCallbackError(true); setCallbackErrorMsg('Comming soon...') }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="template"
                                                    checked={formData.template == 3}
                                                    value={3}
                                                    required
                                                    className={Styles.hiddenRadio}
                                                />
                                                <img src="/assets/templates/3.png" alt="Template 2" />
                                                <div
                                                    className={Styles.previewIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent triggering the brand selection
                                                        window.open(`/assets/templates/3.png`, '_blank');
                                                    }}
                                                >
                                                    <FaEye />
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                            )}
                        </div>
                        <div className="accordion-item text-[16px] font-['Montserrat-400']">
                            <div
                                className={`accordion-header ${currentStep === 4 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(4)}
                            >
                                <h3>Brand Selection</h3>
                                <span>{currentStep === 4 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 4 && (
                                <div className="accordion-body">
                                    <div className="text-start">
                                        <b>Select Brand:</b>
                                        <div className={`${Styles.dFlex} ${Styles.gap10} mt-4`}>
                                            {!manufacturers.isLoading ?
                                                showBrandList?.length ? (showBrandList.map((brand) => (
                                                    <div
                                                        key={brand.Id}
                                                        className={`${Styles.templateHolder} ${formData.brand.includes(brand.Id) ? Styles.selected : ''}`}
                                                        onClick={() => handleChange({ target: { value: brand.Id, name: "brand" } })}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="brand"
                                                            checked={formData.brand.includes(brand.Id)}
                                                            value={brand.Id}
                                                            required
                                                            className={Styles.hiddenRadio}
                                                        />
                                                        <ImageWithFallback
                                                            src={`${originAPi}/brandImage/${brand.Id}.png`}
                                                            title={`Click to select ${brand.Name}`}
                                                            style={{ maxHeight: '100px', mixBlendMode: 'luminosity' }}
                                                            alt={`Brand ${brand.Id}`}
                                                        />
                                                        <p className={Styles.labelHolder}>{brand.Name}</p>
                                                        {/* <div
                                                            className={Styles.previewIcon}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent triggering the brand selection
                                                                window.open(`${originAPi}brandImage/${brand.Id}.png`, '_blank');
                                                            }}
                                                        >
                                                            <FaEye />
                                                        </div> */}
                                                    </div>
                                                ))
                                                ) : "No Brand found." : (
                                                    <Loading />
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="button-group">
                            {currentStep != 1 ? <button
                                type="button"
                                className="prev-btn"
                                onClick={() => handleAccordionClick(currentStep - 1)}
                            >
                                Previous
                            </button> : null}&nbsp;

                            {currentStep == 4 ? <button type="submit" onClick={() => {
                                if (currentStep === 4 && (!formData.brand.length)) {
                                    setCallbackError(true)
                                    setCallbackErrorMsg('Please select a brand')
                                    return;
                                }
                            }} className="submit-btn">
                                Submit
                            </button> : <button
                                type="button"
                                className="next-btn"
                                onClick={() => handleAccordionClick(currentStep + 1)}
                            >
                                Next
                            </button>}
                        </div>
                    </form></>}
        </div>
    );
};

export default MultiStepForm;
