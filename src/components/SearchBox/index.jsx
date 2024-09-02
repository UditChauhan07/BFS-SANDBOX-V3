import React, { useState } from 'react';
import './MultiSelectSearch.css';
import { UserIcon } from '../../lib/svg';

const MultiSelectSearch = ({ options, selectedValues, onChange,loading=null }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Handle selecting or deselecting an item
    const handleSelect = (item) => {
        const isSelected = selectedValues.some(selected => selected.Id === item.Id);
        const newSelectedValues = isSelected
            ? selectedValues.filter(selected => selected.Id !== item.Id) // Deselect item
            : [...selectedValues, item]; // Select item

        onChange(newSelectedValues); // Notify parent component of selection change
    };

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option?.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option?.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option?.Account?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="multi-select-container">
            <header>
                {/* <h1>User Search</h1> */}
                <ul className="select-user-list">
                    <b>Selected Users:&nbsp;</b>
                    {selectedValues.length ? selectedValues.length<3? selectedValues.map((user, index) => (
                        <li key={user.Id}>{user.Name}{index != (selectedValues.length - 1) ? "," : ""}</li>
                    )):selectedValues.length+" Users selected":"No Users selected"}
                </ul>
                <input
                    type="text"
                    placeholder="Search for a user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </header>
            <div className="user-list">
                {loading?loading:
                filteredOptions.length?
                filteredOptions.map((option) => (
                    <div
                        key={option.Id}
                        className={`user-item ${selectedValues.some(selected => selected.Id === option.Id) ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        <div className="user-avatar"><UserIcon width={25} height={25}/></div>
                        <div className="user-info">
                            <span className="user-name">{option.Name}</span>
                            <span className="user-email">{option.Email}</span>
                            {option?.Title?<span className="user-etc"><b>Title:&nbsp;</b>{option?.Title}</span>:null}
                            {option?.Phone?<span className="user-etc"><b>Phone:&nbsp;</b>{option?.Phone}</span>:null}
                            {option?.Account?.Name?<span className="user-etc"><b>Store:&nbsp;</b>{option?.Account?.Name}</span>:null}
                        </div>
                    </div>
                )):"No record found."}
            </div>
        </div>
    );
};

export default MultiSelectSearch;
