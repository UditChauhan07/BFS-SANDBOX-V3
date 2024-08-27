import React from 'react';

export function FilterItem({ manufacturers, onSelectManufacturer, selectedManufacturer }) {
    return (
        <div className="filter-item">
            <label htmlFor="manufacturer-select">Select Manufacturer:</label>
            <select
                id="manufacturer-select"
                value={selectedManufacturer}
                onChange={(e) => onSelectManufacturer(e.target.value)}
            >
                <option value="">All</option>
                {manufacturers.map((manufacturer) => (
                    <option key={manufacturer.id} value={manufacturer.id}>
                        {manufacturer.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
