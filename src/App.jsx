import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Auth from './Auth';
import { auth, addTransaction, getTransactions, deleteTransaction, logout, setUserSettings, getUserSettings } from './firebase';
import { FaSun, FaMoon, FaSignOutAlt, FaTrash, FaDollarSign, FaPencilAlt, FaShoppingCart, FaHome, FaTicketAlt, FaGasPump } from 'react-icons/fa';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import CategoryIcons from './components/CategoryIcons';
import BudgetSection from './components/BudgetSection';
import TransactionList from './components/TransactionList';
import InputForm from './components/InputForm';
import FilterBar from './components/FilterBar';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAmount, setFilterAmount] = useState('');
  const [tags, setTags] = useState(['groceries', 'rent', 'entertainment', 'utilities']);
  const [selectedTag, setSelectedTag] = useState('');
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState('monthly');
  const [monthlyIncome, setMonthlyIncome] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const unsubscribe = getTransactions(user.uid, setTransactions);
            loadUserSettings(user.uid);
            return () => unsubscribe();
        } else {
            setTransactions([]);
        }
    }, [user]);

    const loadUserSettings = async (userId) => {
        if (!userId) return;
        const settings = await getUserSettings(userId);
        if (settings) {
            setDarkMode(settings.darkMode || false);
            setFilterCategory(settings.filterCategory || '');
            setFilterDate(settings.filterDate || '');
            setFilterAmount(settings.filterAmount || '');
            setBudget(settings.budget || '');
            setBudgetType(settings.budgetType || 'monthly');
            setMonthlyIncome(settings.monthlyIncome || '');
        }
    };

    useEffect(() => {
        if (user) {
            saveUserSettings(user.uid);
        }
    }, [darkMode, filterCategory, filterDate, filterAmount, budget, budgetType, monthlyIncome, user]);

    const saveUserSettings = async (userId) => {
        if (userId) {
            await setUserSettings(userId, {
                darkMode,
                filterCategory,
                filterDate,
                filterAmount,
                budget,
                budgetType,
                monthlyIncome
            });
        }
    };


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAddTransaction = async () => {
    if (!description || !amount || !user) return;
    const newTransaction = {
      id: uuidv4(),
      description,
      amount: parseFloat(amount),
      type,
      createdAt: new Date(),
      tag: selectedTag
    };
    try {
        await addTransaction(user.uid, newTransaction);
        setDescription('');
        setAmount('');
        setSelectedTag('');
    } catch (error) {
        console.error("Error adding transaction:", error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!user) return;
    try {
        await deleteTransaction(user.uid, id);
        setTransactions(prevTransactions => {
          return prevTransactions.filter(transaction => transaction.id !== id)
        });
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
  };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleSyncTransactions = () => {
        // Simulate transaction sync
        const syncedTransactions = [
            { id: uuidv4(), description: 'Online Purchase', amount: -25.50, type: 'expense', createdAt: new Date(), tag: 'entertainment' },
            { id: uuidv4(), description: 'Salary', amount: 2000, type: 'income', createdAt: new Date(), tag: 'income' },
        ];
        syncedTransactions.forEach(async (transaction) => {
            if (user) {
                await addTransaction(user.uid, transaction);
            }
        });
    };

    const filteredTransactions = transactions.filter(transaction => {
        const dateMatch = filterDate ? format(transaction.createdAt, 'yyyy-MM-dd') === filterDate : true;
        const categoryMatch = filterCategory ? transaction.tag === filterCategory : true;
        const amountMatch = filterAmount ? String(transaction.amount).includes(filterAmount) : true;
        return dateMatch && categoryMatch && amountMatch;
    });

    const calculateTotal = () => {
        return filteredTransactions.reduce((acc, transaction) => {
            return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
        }, 0).toFixed(2);
    };

    const calculateBudgetProgress = () => {
        if (!budget) return 0;
        const totalExpenses = filteredTransactions
            .filter(transaction => transaction.type === 'expense')
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const budgetValue = parseFloat(budget);
        const progress = (budgetValue + totalExpenses) / budgetValue;
        return Math.min(Math.max(progress, 0), 1);
    };

    const progress = calculateBudgetProgress();
    const progressPercentage = Math.round(progress * 100);

    const checkOverspending = () => {
        if (progress > 1) {
            return <p style={{ color: 'red' }}>Overspending Alert! You have exceeded your budget.</p>;
        }
        return null;
    };

    const calculateCategorySpending = (category) => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());

        const categoryExpenses = transactions.filter(transaction =>
            transaction.tag === category &&
            transaction.type === 'expense' &&
            isWithinInterval(transaction.createdAt, { start, end })
        );
        return categoryExpenses.reduce((acc, transaction) => acc + transaction.amount, 0);
    };

  if (!user) {
    return <Auth onAuth={setUser} darkMode={darkMode} />;
  }

  return (
    <div className={`${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
        </div>
      <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h1>Budget Manager</h1>
        <p>Logged in as: {user.email}</p>
        <button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
        <button onClick={handleSyncTransactions}>Sync Transactions</button>
        <CategoryIcons
            tags={tags}
            darkMode={darkMode}
            calculateCategorySpending={calculateCategorySpending}
        />
        <InputForm
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            type={type}
            setType={setType}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={tags}
            handleAddTransaction={handleAddTransaction}
            darkMode={darkMode}
        />
        <FilterBar
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterAmount={filterAmount}
            setFilterAmount={setFilterAmount}
            tags={tags}
            darkMode={darkMode}
        />
        <BudgetSection
            budget={budget}
            setBudget={setBudget}
            budgetType={budgetType}
            setBudgetType={setBudgetType}
            progress={progress}
            progressPercentage={progressPercentage}
            checkOverspending={checkOverspending}
            renderProgressBar={() => {}}
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            darkMode={darkMode}
        />
        <TransactionList
            transactions={filteredTransactions}
            handleDeleteTransaction={handleDeleteTransaction}
            darkMode={darkMode}
        />
        <div className="total">Total: ${calculateTotal()}</div>
      </div>
    </div>
  );
}

export default App;
