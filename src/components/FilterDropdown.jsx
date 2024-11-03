import React from 'react';
import { Dropdown } from 'react-bootstrap';

const FilterDropdown = ({ filterOption, setFilterOption, options }) => {
    return (
        <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" className="rounded-pill me-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                    className="me-2"
                >
                    <path d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
                </svg>
                {options.find(option => option.value === filterOption)?.label || 'Select Filter'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {options.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => setFilterOption(option.value)}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default FilterDropdown;
