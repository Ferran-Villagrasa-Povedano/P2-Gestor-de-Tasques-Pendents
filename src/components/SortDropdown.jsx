import React from 'react';
import { Dropdown } from 'react-bootstrap';

const SortDropdown = ({ sortOption, setSortOption, options }) => {
    return (
        <Dropdown className="mb-3">
            <Dropdown.Toggle variant="secondary" className="rounded-pill me-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                >
                    <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
                {options.find(option => option.value === sortOption)?.label || 'Select Order'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {options.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => setSortOption(option.value)}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default SortDropdown;
