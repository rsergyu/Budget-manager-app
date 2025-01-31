import React from 'react';
import { FaDollarSign, FaPencilAlt } from 'react-icons/fa';

function InputForm({ description, setDescription, amount, setAmount, type, setType, selectedTag, setSelectedTag, tags, handleAddTransaction, darkMode }) {
    return (
        <>
            <div className="input-group">
                <label><FaPencilAlt /> Description</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={darkMode ? 'dark-mode' : 'light-mode'}
                />
            </div>
            <div className="input-group">
                <label><FaDollarSign /> Amount</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={darkMode ? 'dark-mode' : 'light-mode'}
                />
            </div>
            <div className="input-group">
                <label>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={darkMode ? 'dark-mode' : 'light-mode'}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <div className="input-group">
                <label>Tag</label>
                <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className={darkMode ? 'dark-mode' : 'light-mode'}>
                    <option value="">Select Tag</option>
                    {tags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>
            <button onClick={handleAddTransaction}>Add Transaction</button>
        </>
    );
}

export default InputForm;
