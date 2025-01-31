import React from 'react';
import { FaShoppingCart, FaHome, FaTicketAlt, FaGasPump } from 'react-icons/fa';

function CategoryIcons({ tags, darkMode, calculateCategorySpending }) {
    const categoryIcons = {
        groceries: <FaShoppingCart />,
        rent: <FaHome />,
        entertainment: <FaTicketAlt />,
        utilities: <FaGasPump />,
    };

    return (
        <div className="category-icons">
            {tags.map(tag => (
                <div key={tag} className={`category-icon ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                    {categoryIcons[tag] || null}
                    <span>{tag}</span>
                    <span>${(calculateCategorySpending(tag) * -1).toFixed(2)}</span>
                </div>
            ))}
        </div>
    );
}

export default CategoryIcons;
