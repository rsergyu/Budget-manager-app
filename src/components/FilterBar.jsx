import React from 'react';

function FilterBar({ filterDate, setFilterDate, filterCategory, setFilterCategory, filterAmount, setFilterAmount, tags, darkMode }) {
    return (
        <div className="filter-container">
            <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className={darkMode ? 'dark-mode' : 'light-mode'}
            />
            <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={darkMode ? 'dark-mode' : 'light-mode'}
            >
                <option value="">All Categories</option>
                {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Filter by amount"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
                className={darkMode ? 'dark-mode' : 'light-mode'}
            />
        </div>
    );
}

export default FilterBar;
