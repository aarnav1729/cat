import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import IncomePieChart from './charts/IncomePieChart';
import ExpenditurePieChart from './charts/ExpenditurePieChart';

const Dashboard = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [financeData, setFinanceData] = useState([]);
  const [categories, setCategories] = useState({ income: [], expenditure: [], investment: [] });
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('income');

  // Fetch user-specific data from backend
  useEffect(() => {
    const fetchFinanceData = async () => {
      const token = await getAccessTokenSilently();
      const response = await axios.get('https://cat-4ouq.onrender.com/api/finance', {
        params: { userId: user.sub },
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (data) {
        setFinanceData(data.entries);
        setCategories(data.categories);
      }
    };

    if (isAuthenticated) {
      fetchFinanceData();
    }
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const handleAddCategory = () => {
    if (newCategory && newCategoryType) {
      setCategories((prev) => ({
        ...prev,
        [newCategoryType]: [...prev[newCategoryType], newCategory]
      }));
      setNewCategory('');
    }
  };

  const handleSaveData = async () => {
    const token = await getAccessTokenSilently();
    await axios.post(
      'https://cat-4ouq.onrender.com/api/finance',
      { userId: user.sub, entries: financeData, categories },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return isAuthenticated ? (
    <div className="p-6">
      <h1 className="text-3xl mb-4">Dashboard for {user.name}</h1>
      
      {/* Custom Category Addition */}
      <div className="mb-6">
        <h2 className="text-2xl">Add Custom Categories</h2>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category"
          className="border p-2 rounded"
        />
        <select
          value={newCategoryType}
          onChange={(e) => setNewCategoryType(e.target.value)}
          className="border p-2 rounded ml-4"
        >
          <option value="income">Income</option>
          <option value="expenditure">Expenditure</option>
          <option value="investment">Investment</option>
        </select>
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-3 py-2 ml-4 rounded"
        >
          Add Category
        </button>
      </div>

      <button
        onClick={handleSaveData}
        className="bg-green-500 text-white px-3 py-2 ml-4 rounded"
      >
        Save Data
      </button>

      {/* Charts for data visualization */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <IncomePieChart data={financeData} categories={categories.income} />
        <ExpenditurePieChart data={financeData} categories={categories.expenditure} />
      </div>
    </div>
  ) : (
    <div className="p-6">
      <h1>You need to log in to access your dashboard.</h1>
    </div>
  );
};

export default Dashboard;
