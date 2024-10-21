import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { generateSalesData, generateTopSellingItems, generateCategorySales, generatePaymentMethods } from '../utils/dataSimulation';

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [averageSales, setAverageSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [profit, setProfit] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [dailyCashBalance, setDailyCashBalance] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sales = generateSalesData(30);
        const topItems = generateTopSellingItems();
        const catSales = generateCategorySales();
        const paymentMethodsData = generatePaymentMethods();

        // Calculate sales growth
        const previousTotal = sales.slice(0, 15).reduce((sum, day) => sum + day.sales, 0);
        const currentTotal = sales.slice(15).reduce((sum, day) => sum + day.sales, 0);
        const growth = ((currentTotal - previousTotal) / previousTotal) * 100;

        // Set state
        setSalesData(sales);
        setTopSellingItems(topItems);
        setCategorySales(catSales);
        setPaymentMethods(paymentMethodsData);
        setSalesGrowth(growth);

        const total = sales.reduce((sum, day) => sum + day.sales, 0);
        setTotalSales(total);
        setAverageSales(total / sales.length);
        setTotalOrders(Math.floor(total / 100));
        setProfit(total * 0.3);

        const storedCash = localStorage.getItem('storeCashBalance');
        if (storedCash) {
          setDailyCashBalance(parseFloat(storedCash));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">฿{value.toLocaleString()}</div>
        {trend && (
          <div className="flex items-center text-xs mt-2">
            {trendValue > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={trendValue > 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(trendValue).toFixed(1)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sales" value={totalSales} icon={DollarSign} trend trendValue={salesGrowth} />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} />
        <StatCard title="Average Order Value" value={totalOrders ? (totalSales / totalOrders) : 0} icon={TrendingUp} />
        <StatCard title="Daily Cash Balance" value={dailyCashBalance} icon={Wallet} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#FF6384" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSellingItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#36A2EB" radius={[4, 4, 0, 0]} /> 
      </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethods}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} transactions`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
