import React from 'react';

function BudgetSection({ budget, setBudget, budgetType, setBudgetType, progress, progressPercentage, checkOverspending, monthlyIncome, setMonthlyIncome, darkMode }) {
    const renderProgressBar = () => {
        const progressBarFillStyle = {
            width: `${progress * 100}%`,
        };

        return (
            <div className="progress-bar">
                <div className="progress-bar-fill" style={progressBarFillStyle}></div>
            </div>
        );
    };

    return (
        <div className="budget-container">
            <div className="budget-input">
                <label>Set Budget</label>
                <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={darkMode ? 'dark-mode' : 'light-mode'}
                />
                <select value={budgetType} onChange={(e) => setBudgetType(e.target.value)} className={darkMode ? 'dark-mode' : 'light-mode'}>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                </select>
            </div>
            <div className="budget-input">
                <label>Set Monthly Income</label>
                <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className={darkMode ? 'dark-mode' : 'light-mode'}
                />
            </div>
            {renderProgressBar()}
            <p className="progress-text">Budget Progress: {progressPercentage}%</p>
            {checkOverspending()}
        </div>
    );
}

export default BudgetSection;
