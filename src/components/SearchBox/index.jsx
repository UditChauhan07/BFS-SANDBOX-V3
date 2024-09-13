import React, { useEffect, useState } from 'react';
import './MultiSelectSearch.css';
import { UserIcon } from '../../lib/svg';
import ToggleSwitch from '../ToggleButton';
import Loading from '../Loading';

const MultiSelectSearch = ({ options, selectedValues, onChange, loading = null, manufacturers = [], setWarning, brandSelected = [],manufacturersList=[] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSelected, setShowSelected] = useState(false);
    const [brand, setBrand] = useState();
    const [showAll, stShowAll] = useState(false);
    const [isLoadings, setIsLoading] = useState(loading ? true : false);
    // Handle selecting or deselecting an item
    const handleSelect = (item) => {

        const isSelected = selectedValues.some(selected => selected.Id === item.Id);

        if (item?.AccountId && manufacturers.length && !isSelected) {
            const isBrandMatched = item.BrandIds.some(brandId =>
                manufacturers.some(brand => brand.Id === brandId)
            );

            if (!isBrandMatched) {
                setWarning?.(item.Id);
            }
        }
        const newSelectedValues = isSelected
            ? selectedValues.filter(selected => selected.Id !== item.Id) // Deselect item
            : [...selectedValues, item]; // Select item

        onChange?.(newSelectedValues); // Notify parent component of selection change
    };

    // Filter options based on search term
    const [filteredOptions, setFilteredOptions] = useState();
  
    useEffect(() => {
        setIsLoading(true)
        // Call the filtering function when searchTerm or brand changes
        var results = options.filter(function(option) {
            var brandMatch = true;
            var nameMatch = false;
            var titleMatch = false;
            var accountNameMatch = false;
            
            // Check for brand match
            if (brand) {
                if (option && option.BrandIds) {
                    brandMatch = option.BrandIds.includes(brand);
                } else {
                    brandMatch = false;
                }
            }
            
            // Check for name match
            if (option && option.Name) {
                nameMatch = option.Name.toLowerCase().includes(searchTerm.toLowerCase());
            }
    
            // Check for title match
            if (option && option.Title) {
                titleMatch = option.Title.toLowerCase().includes(searchTerm.toLowerCase());
            }
    
            // Check for account name match
            if (option && option.Account && option.Account.Name) {
                accountNameMatch = option.Account.Name.toLowerCase().includes(searchTerm.toLowerCase());
            }
    
            // Return true if brandMatch is true and any of the other conditions match
            return brandMatch && (nameMatch || titleMatch || accountNameMatch);
        });
        if (!showAll) {
            // Extract the brand IDs from the brands list
            let validBrandIds = new Set(manufacturers.map(brand => brand.Id));


            // Filter results to include only those with at least one matching brand ID
            let matchedResults = results.filter(result =>
                result.BrandIds?.some(brandId => validBrandIds.has(brandId))
            );

            setFilteredOptions(matchedResults); // brand only subscribers
        } else {
            setFilteredOptions(results); // all subscribers
        }
        setTimeout(() => {
            setIsLoading(false)
        }, 1500);
    }, [searchTerm, brand, options, showAll]);
    useEffect(() => {
        if (!loading) {
            setIsLoading(false)
        }
    }, [loading])


    const AutoSelectChangeHandler = () => {
        // Create a new array that contains only the options that are not already selected
        const newOptions = filteredOptions.filter(
            option => !selectedValues.some(selected => selected.Id === option.Id)
        );

        // If there are any new options to add, call onChange with the updated list
        if (newOptions.length > 0) {
            onChange?.([...selectedValues, ...newOptions]);
        }
    };
    const resetSelectChangeHandler = () => {
        onChange?.([]);
    }
    const brandSelectionHandler = (event) => {
        const { target } = event;
        if (target.value != 0) {
            setBrand(target.value);
        } else {
            setBrand();
        }
    }
    const brandNames = brandSelected
        ?.map((brand, index) => brand.Name)
        ?.reduce((acc, curr, index) => {
            if (index === brandSelected.length - 1) {
                return `${acc} and ${curr}`;
            }
            return `${acc}, ${curr}`;
        });

    const BrandNameGenerator = (Brandids) => {
        return manufacturersList
            ?.filter(brand => Brandids.includes(brand.Id))
            ?.map((brand, index) => brand.Name)
            ?.reduce((acc, curr, index) => {
                if (index === brandSelected.length - 1) {
                    return `${acc} and ${curr}`;
                }
                return `${acc}, ${curr}`;
            });
    }
    return (
        <div className="multi-select-container">
            <header>
                {/* <h1>User Search</h1> */}
                <ul className="select-user-list justify-content-between align-items-center">
                    <div className='d-flex flex-column align-items-center justify-content-start'>

                        <b className='d-flex justify-content-start align-items-center w-[100%]'><input type='checkbox' value={1} onChange={() => setShowSelected(!showSelected)} style={{ width: '15px', height: '15px', margin: 0 }} />&nbsp;Selected Users:&nbsp;<span style={{ fontWeight: '400', display: 'flex' }}>                 {selectedValues?.length ? selectedValues.length < 3 ? selectedValues.map((user, index) => (
                            <li key={user.Id}>{user.Name}{index != (selectedValues.length - 1) ? `,` : ""}&nbsp;</li>
                        )) : `${selectedValues.filter(e => !e.AccountId).length ? `${selectedValues.filter(e => !e.AccountId).length} Users selected` : ''} ${selectedValues.filter(e => !e.AccountId).length && selectedValues.filter(e => e.AccountId).length ? ' and ' : ''} ${selectedValues.filter(e => e.AccountId).length ? `${selectedValues.filter(e => e.AccountId).length} contact selected` : ''}` : "No Users selected"}</span></b>
                    </div>
                    <div className='d-flex flex-column align-items-center justify-content-end'>
                        <span className='text-end w-[100%]'><span onClick={AutoSelectChangeHandler} className='cursor-pointer'>Select All</span>&nbsp;&nbsp;|&nbsp;&nbsp;<span className='cursor-pointer' onClick={resetSelectChangeHandler}>Reset</span></span>
                    </div>
                </ul>
                <div className='d-flex justify-content-between align-items-center'>

                    <input
                        type="text"
                        placeholder="Search for users..."
                        value={searchTerm}
                        style={{ width: '55%' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {manufacturers?.length ? <select className={"brandSearch"} style={{ width: '25%', maxWidth: '200px', height: '45px', marginTop: '8px' }} onChange={brandSelectionHandler}>
                        <option value={0} selected>All Brand</option>
                        {manufacturers.map((brand) => (
                            <option style={{ appearance: 'none' }} value={brand.Id}>{brand.Name}</option>
                        ))}
                    </select> : null}
                    <div className='w-[20%] d-flex justify-content-center align-items-center text-[13px]'><span>Subscribers for<br /> <span title={brandNames} className='cursor-pointer text-[#509fde] text-underline'>Selected brand</span></span>&nbsp;&nbsp;<ToggleSwitch selected={showAll} onToggle={(value) => { stShowAll(value) }} />&nbsp;&nbsp;All</div>

                </div>
            </header>
            <div className="user-list">
                {!isLoadings ?
                    filteredOptions?.length ?
                        filteredOptions.map((option) => (
                            <div
                                key={option.Id}
                                className={`user-item ${selectedValues.some(selected => selected.Id === option.Id) ? 'selected' : showSelected ? 'd-none' : ''}`}
                                onClick={() => handleSelect(option)}
                            >

                                <div className="user-avatar"><UserIcon width={25} height={25} /></div>
                                <div className="user-info">
                                    <span className="user-name d-flex align-items-center">{(!manufacturers.some(brand => option.BrandIds?.includes(brand.Id)) && selectedValues.some(selected => selected.Id === option.Id)) ? <div className='redBlock mr-1'></div> : null}{option.Name}</span>
                                    <span className="user-email maxSizeDiv">{option.Email}</span>
                                    {option?.Title ? <span className="user-etc maxSizeDiv"><b className="text-['Arial']">Title:&nbsp;</b>{option?.Title}</span> : null}
                                    {option?.Phone ? <span className="user-etc"><b>Phone:&nbsp;</b>{option?.Phone}</span> : null}
                                    {option?.Account?.Name ? <span className="user-etc maxSizeDiv"><b>Store:&nbsp;</b>{option?.Account?.Name}</span> : null}
                                </div>
                                {(option.BrandIds?.length) ?
                                    <div className='user-brands'>
                                        <b>Brands Subscribed</b>
                                        <span className='user-etc text-end text-[10px] max-w-[150px]'>{BrandNameGenerator(option.BrandIds)}</span>
                                    </div> : null}
                            </div>
                        )) : "No record found." : <div className='m-auto'><Loading height={'100px'} /></div>}
            </div>
        </div>
    );
};

export default MultiSelectSearch;
