import React, { useEffect, useState } from 'react';
import './MultiStepForm.css'; // Import the CSS file
import MultiSelectSearch from '../../SearchBox';
import { createNewsletter, fetchNewsletterData, GetAuthData, originAPi, ShareDrive } from '../../../lib/store';
import Styles from './index.module.css';
import { useManufacturer } from '../../../api/useManufacturer';
import Loading from '../../Loading';
import ModalPage from '../../Modal UI';
import { BiExit } from 'react-icons/bi';
import ToggleSwitch from '../../ToggleButton';
import { FaEye } from 'react-icons/fa';

const contactLocalKey = "lCpFhWZtGKKejSX"

const MultiStepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { data: manufacturers, isLoading, error } = useManufacturer();
    const [Subscribers, setSubscribers] = useState({ isLoaded: false, users: [], contacts: [] })
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [callBackError, setCallbackError] = useState();
    const [isSubmit, setIsSubmit] = useState(false)
    const [isSchedule, setIsSchedule] = useState(false)
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [loading,setLoading]=useState(true);
    const [formData, setFormData] = useState({
        subscriber: [],
        template: '',
        brand: [],
        date: '',
        subject: '',
        newsletter: ''
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

    const handleAccordionClick = (step) => {
        if (step === 2 && !formData.subscriber.length) {
            // alert('Please select a subscriber first.');
            setCallbackError('Please select a subscriber first.')
            return;
        }
        if (step === 3 && (!formData.template)) {
            setCallbackError('Please select a template')
            return;
        }
        if (step === 4 && (!formData.brand.length)) {
            setCallbackError('Please select a brand')
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmit(true)
        const userIds = Subscribers.users.filter(item1 =>
            formData.subscriber.some(item2 => item2.Id === item1.Id)
        ).map(item => item.Id);
        const contactIds = Subscribers.contacts.filter(item1 =>
            formData.subscriber.some(item2 => item2.Id === item1.Id)
        ).map(item => item.Id);

        let body = {
            newsletter: formData.newsletter,
            subject: formData.subject,
            template: formData.template,
            brandIds: JSON.stringify(formData.brand),
            date: formData.date,
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
                setCallbackError(result.message)
            }

        }).catch((err) => {
            console.log({ err });

        })
    };

useEffect(()=>{},[callBackError])

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


                    setSubscribers({ isLoaded: true, users: response.userList, contacts: response.contactList })
                    setAllSubscribers([...response.userList, ...response.contactList])
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        let localCall = ShareDrive(null, null, contactLocalKey)

        if (localCall) {
            setSubscribers({ isLoaded: true, users: localCall.userList, contacts: localCall.contactList })
            setAllSubscribers([...localCall.userList, ...localCall.contactList])
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
        console.log({ today });

        document.getElementById("date").value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    }
    return (
        <div className="form-container create-newsletter">
            {isSubmit ? <Loading height={'500px'} /> :
                <>
                    <ModalPage
                        open={callBackError ?? false}
                        content={<div className="d-flex flex-column gap-3">
                            <h2>
                                Alert!!!
                            </h2>
                            <p className={Styles.modalContent}>
                                {callBackError}
                            </p>
                            <div className="d-flex justify-content-around">
                                <button className={`${Styles.btn} d-flex align-items-center`} onClick={() => setCallbackError()}>
                                    <BiExit /> &nbsp;Ok
                                </button>
                            </div>
                        </div>}
                        onClose={() => setCallbackError()}
                    />
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

                        {/* Step 1: Subscribers */}
                        <div className="accordion-item">
                            <div
                                className={`accordion-header ${currentStep === 1 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(1)}
                            >
                                <h3>Subscribers</h3>
                                <span>{currentStep === 1 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 1 && (
                                <>
                                    <div className="accordion-body">
                                        <MultiSelectSearch
                                            loading={(!Subscribers.isLoaded||loading) ? <div className='m-auto'><Loading height={'100px'} /></div> : null}
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
                        <div className="accordion-item text-[12px] font-['Montserrat-400']">
                            <div
                                className={`accordion-header ${currentStep === 2 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(2)}
                            >
                                <h3>Template Selection</h3>
                                <span>{currentStep === 2 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 2 && (
                                <div className="accordion-body">
                                    <div className="text-start">
                                        Select Template:
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
                                                onClick={() => { setCallbackError('Comming soon...') }}
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
                        <div className="accordion-item text-[12px] font-['Montserrat-400']">
                            <div
                                className={`accordion-header ${currentStep === 3 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(3)}
                            >
                                <h3>Brand Selection</h3>
                                <span>{currentStep === 3 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 3 && (
                                <div className="accordion-body">
                                    <div className="text-start">
                                        Select Brand:
                                        <div className={`${Styles.dFlex} ${Styles.gap10} mt-4`}>
                                            {!isLoading ?
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
                        <div className="accordion-item">
                            <div
                                className={`accordion-header ${currentStep === 4 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(4)}
                            >
                                <h3>Newsletter Details</h3>
                                <span>{currentStep === 4 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 4 && (
                                <div className="accordion-body">
                                    <div className='mt-4 pt-3'>
                                        <div className='d-flex justify-content-between'>

                                            <label style={{ width: '68%' }} className="text-[12px] text-[#000] font-['Montserrat-400'] text-start">
                                                Newsletter Title:
                                                <input
                                                    type="text"
                                                    name="newsletter"
                                                    value={formData.newsletter}
                                                    onChange={handleChange}
                                                    placeholder="Enter newsletter"
                                                    required
                                                />
                                            </label>
                                            <label style={{ width: '30%' }} className="text-[12px] text-[#000] font-['Montserrat-400'] text-start">
                                                Send Type:
                                                <div className="d-flex mt-3 h-full text-[12px] text-[#000]">
                                                    Send Now&nbsp;&nbsp;<ToggleSwitch onToggle={(value) => { setIsSchedule(value); handleChange({ target: { value: null, name: "date" } }) }} />&nbsp;&nbsp;Schedule later
                                                </div>
                                            </label>
                                        </div>
                                        <div className='d-flex justify-content-between'>
                                            <label style={{ width: '68%' }} className="text-[12px] font-['Montserrat-400'] text-start">
                                                Subject:
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="Enter subject"
                                                    required
                                                />
                                            </label>
                                            <label style={{ width: '30%' }} className="text-[12px] font-['Montserrat-400'] text-start">
                                                Date:
                                                <input
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required={isSchedule}
                                                    disabled={!isSchedule}
                                                    onLoad={getDate}
                                                />
                                                {/* <DatePicker selected={new Date()} onChange={() => handleChange({ target: { value: null, name: "date" } })} dateFormat="MMM/dd/yyyy" customInput={<ExampleCustomInput />} /> */}
                                            </label>
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

                            {currentStep == 4 ? <button type="submit" className="submit-btn">
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
