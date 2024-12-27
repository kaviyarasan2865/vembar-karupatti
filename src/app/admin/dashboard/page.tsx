'use client';

import React from 'react';

const SimpleBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <svg className="w-full h-48" viewBox="0 0 300 200">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 150;
        const x = 40 + (index * 50);
        const y = 180 - barHeight;
        
        return (
          <g key={item.label}>
            <rect
              x={x}
              y={y}
              width="30"
              height={barHeight}
              className="fill-blue-500"
            />
            <text
              x={x + 15}
              y="195"
              className="text-xs"
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const SimpleTrendLine = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((item, index) => {
    const x = 40 + (index * 50);
    const y = 180 - (item.value / maxValue) * 150;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-48" viewBox="0 0 300 200">
      <polyline
        points={points}
        className="fill-none stroke-green-500 stroke-2"
      />
      {data.map((item, index) => {
        const x = 40 + (index * 50);
        const y = 180 - (item.value / maxValue) * 150;
        return (
          <g key={item.label}>
            <circle
              cx={x}
              cy={y}
              r="4"
              className="fill-green-500"
            />
            <text
              x={x}
              y="195"
              className="text-xs"
              textAnchor="middle"
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const Dashboard = () => {
  const salesData = [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 19000 },
    { label: 'Mar', value: 15000 },
    { label: 'Apr', value: 22000 },
    { label: 'May', value: 28000 }
  ];

  const categoryData = [
    { label: 'Electronics', value: 45 },
    { label: 'Clothing', value: 38 },
    { label: 'Books', value: 28 },
    { label: 'Home', value: 25 },
    { label: 'Sports', value: 20 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Products</h3>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">1,234</div>
          <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
        </div>

        {/* Categories Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Categories</h3>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">28</div>
          <p className="text-xs text-gray-500 mt-2">+2 new categories</p>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">856</div>
          <p className="text-xs text-gray-500 mt-2">+23% from last month</p>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
            <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">$121,000</div>
          <p className="text-xs text-gray-500 mt-2">+18% from last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Sales</h3>
          <SimpleTrendLine data={salesData} />
        </div>

        {/* Products by Category Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Products by Category</h3>
          <SimpleBarChart data={categoryData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;