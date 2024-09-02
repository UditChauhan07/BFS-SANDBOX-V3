import React, { useEffect, useState } from 'react';
import './MultiStepForm.css'; // Import the CSS file
import MultiSelectSearch from '../../SearchBox';
import { createNewsletter, fetchNewsletterData, GetAuthData, originAPi } from '../../../lib/store';
import Styles from './index.module.css';
import { useManufacturer } from '../../../api/useManufacturer';
import Loading from '../../Loading';
import ModalPage from '../../Modal UI';
import { BiExit } from 'react-icons/bi';
const MultiStepForm = ({ onSubmit = null }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [Subscribers, setSubscribers] = useState({ isLoaded: false, users: [], contacts: [] })
    const [allSubscribers, setAllSubscribers] = useState([]);
    const [callBackError, setCallbackError] = useState();
    const [isSubmit, setIsSubmit] = useState(false)
    const [formData, setFormData] = useState({
        subscriber: [],
        template: '',
        brand: [],
        date: '',
        subject: '',
        newsletter: ''
    });

    const handleAccordionClick = (step) => {
        if (step === 2 && !formData.subscriber.length) {
            // alert('Please select a subscriber first.');
            setCallbackError('Please select a subscriber first.')
            return;
        }
        if (step === 3 && (!formData.template || !formData.brand.length)) {
            // alert('Please select a template and brand first.');
            setCallbackError('Please select a template and brand first.')
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
                onSubmit?.();
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
    const { data: manufacturers, isLoading, error } = useManufacturer();


    useEffect(() => {
        const loadData = async () => {
            try {
                if (!Subscribers.isLoaded) {
                    let user = await GetAuthData();
                    const token = user?.x_access_token;
                    if (!token) {
                        throw new Error('Access token is not available');
                    }

                    const response = await fetchNewsletterData({ token });


                    setSubscribers({ isLoaded: true, users: response.userList, contacts: response.contactList })
                    setAllSubscribers([...response.userList, ...response.contactList])
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
            }
        };

        loadData();
    }, [Subscribers]);


    useEffect(() => {

    }, [formData.subscriber])

    const handleSelectionChange = (newSelectedValues) => {
        setFormData((prev) => {
            return { ...prev, subscriber: newSelectedValues };
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

    return (
        <div className="form-container create-newsletter">
            {isSubmit ? <Loading height={'500px'} /> :
                <>
                    <ModalPage
                        open={callBackError ?? false}
                        content={<div className="d-flex flex-column gap-3">
                            <h2>
                                Error
                            </h2>
                            <p className={Styles.modalContent}>
                                {callBackError}
                            </p>
                            <div className="d-flex justify-content-around">
                                <button className={`${Styles.btn} d-flex align-items-center`} onClick={() => setCallbackError(false)}>
                                    <BiExit /> &nbsp;Cancel
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
                                            loading={!Subscribers.isLoaded ? <div className='m-auto'><Loading height={'100px'} /></div> : null}
                                            options={allSubscribers}
                                            selectedValues={formData.subscriber}
                                            onChange={handleSelectionChange}
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
                                        <div className={Styles.dFlex}>
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
                                            </div>
                                            <div
                                                className={`${Styles.templateHolder} ${formData.template == 3 ? Styles.selected : ''}`}
                                            // onClick={() => handleChange({ target: { value: 3, name: "template" } })}
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
                                            </div>
                                        </div>


                                    </div>
                                    <div className="text-start">
                                        Select Brand:
                                        <div className={`${Styles.dFlex} ${Styles.gap10}`}>
                                            {!isLoading ? (
                                                manufacturers.data.map((brand) => (
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
                                                        <ImageWithFallback src={`${originAPi}brandImage/${brand.Id}.png`} title={`click to ${brand.Name} select`} style={{ maxHeight: '100px', mixBlendMode: 'luminosity' }} alt={`Brand ${brand.Id}`} />
                                                    </div>
                                                ))
                                            ) : (
                                                <Loading />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="accordion-item">
                            <div
                                className={`accordion-header ${currentStep === 3 ? 'active' : ''}`}
                                onClick={() => handleAccordionClick(3)}
                            >
                                <h3>Newsletter Details</h3>
                                <span>{currentStep === 3 ? '-' : '+'}</span>
                            </div>
                            {currentStep === 3 && (
                                <div className="accordion-body">
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
                                                value={formData.date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </label>
                                    </div>
                                    <label className="text-[12px] font-['Montserrat-400'] text-start">
                                        Newness:
                                        <input
                                            type="text"
                                            name="newsletter"
                                            value={formData.newsletter}
                                            onChange={handleChange}
                                            placeholder="Enter newsletter"
                                            required
                                        />
                                    </label>
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

                            {currentStep == 3 ? <button type="submit" className="submit-btn">
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
