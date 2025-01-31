import React from 'react';
import { FaTrash } from 'react-icons/fa';

function TransactionList({ transactions, handleDeleteTransaction, darkMode }) {
    return (
        <div className="transaction-list">
            {transactions.map((transaction) => (
                <div key={transaction.id} className={`transaction-item ${darkMode ? 'dark-mode' : 'light-mode'}`}>
                    <span>{transaction.description}</span>
                    <span>${transaction.amount.toFixed(2)} ({transaction.type}) - {transaction.tag}</span>
                    <button className="delete-button" onClick={() => handleDeleteTransaction(transaction.id)}><FaTrash /></button>
                </div>
            ))}
        </div>
    );
}

export default TransactionList;
