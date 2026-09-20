import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, TrendingUp, Wallet, AlertCircle, Clock } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { useIngredients } from '../hooks/useIngredients';
import { usePOSStore } from '../store/usePOSStore';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  const { data: inventory = [], isLoading: isLoadingInventory } = useIngredients();
  const { dailyCashBalance } = usePOSStore();

  const { salesData, topSellingItems, categorySales, paymentMethods, salesGrowth, totalSales, totalOrders, averageSales, recentTransactions } = useMemo(() => {
    let salesByDate = {};
    let itemSales = {};
    let catSalesMap = {};
    let methodsMap = {};
    let activeTotal = 0;
    let activeOrders = 0;
    
    // Find the most recent transaction date to anchor the 30-day window
    let anchorDate = new Date();
    if (transactions && transactions.length > 0) {
      const validDates = transactions
        .map(t => new Date(t.created_at).getTime())
        .filter(time => !isNaN(time));
      if (validDates.length > 0) {
        anchorDate = new Date(Math.max(...validDates));
      }
    }

    // Initialize last 30 days ending at the anchor date
    for (let i = 29; i >= 0; i--) {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() - i);
      salesByDate[d.toISOString().split('T')[0]] = 0;
    }

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const recent = sortedTransactions.filter(t => t.status !== 'voided').slice(0, 5);

    transactions.forEach(t => {
      if (t.status === 'voided') return;
      
      const val = Number(t.total || 0);
      activeTotal += val;
      activeOrders += 1;

      const dateStr = new Date(t.created_at).toISOString().split('T')[0];
      if (salesByDate[dateStr] !== undefined) {
        salesByDate[dateStr] += val;
      } else {
        salesByDate[dateStr] = val;
      }

      const method = t.payment_method || 'unknown';
      methodsMap[method] = (methodsMap[method] || 0) + 1;

      if (t.items && Array.isArray(t.items)) {
        t.items.forEach(item => {
          const qty = item.quantity || 1;
          const price = Number(item.price || 0);
          itemSales[item.name] = (itemSales[item.name] || 0) + qty;
          
          const cat = item.category || 'Uncategorized';
          catSalesMap[cat] = (catSalesMap[cat] || 0) + (price * qty);
        });
      }
    });

    const salesList = Object.keys(salesByDate).sort().map(d => ({ day: d.slice(5), sales: salesByDate[d] }));
    const topItemsList = Object.keys(itemSales).map(k => ({ name: k, sales: itemSales[k] })).sort((a,b) => b.sales - a.sales).slice(0, 5);
    const catList = Object.keys(catSalesMap).map(k => ({ name: k, value: catSalesMap[k] }));
    const methodsList = Object.keys(methodsMap).map(k => ({ name: k, count: methodsMap[k] }));

    const current15 = salesList.slice(-15).reduce((sum, d) => sum + d.sales, 0);
    const prev15 = salesList.slice(-30, -15).reduce((sum, d) => sum + d.sales, 0);
    const growth = prev15 === 0 ? (current15 > 0 ? 100 : 0) : ((current15 - prev15) / prev15) * 100;

    return { 
      salesData: salesList, 
      topSellingItems: topItemsList, 
      categorySales: catList, 
      paymentMethods: methodsList, 
      salesGrowth: growth,
      totalSales: activeTotal,
      totalOrders: activeOrders,
      averageSales: activeOrders ? activeTotal / activeOrders : 0,
      recentTransactions: recent
    };
  }, [transactions]);

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => Number(item.stock_quantity) <= Number(item.low_stock_threshold));
  }, [inventory]);

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b', '#06b6d4']; // Vibrant modern palette

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, iconColorClass = "text-slate-600 bg-slate-100" }) => (
    <Card className="border-none shadow-sm bg-white overflow-hidden relative group hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl ${iconColorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-bold text-slate-800 tracking-tight">฿{value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
        {trend && (
          <div className="flex items-center text-xs mt-2 font-medium">
            {trendValue > 0 ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
            ) : trendValue < 0 ? (
              <ArrowDownRight className="h-4 w-4 text-rose-500 mr-1" />
            ) : null}
            <span className={trendValue > 0 ? "text-emerald-500" : trendValue < 0 ? "text-rose-500" : "text-gray-400"}>
              {Math.abs(trendValue).toFixed(1)}% vs previous 15 days
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoadingTransactions || isLoadingInventory) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-500">Loading Dashboard...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-full rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening in your store today.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 flex items-center">
          <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
          Live • Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Sales" value={totalSales} icon={DollarSign} trend trendValue={salesGrowth} iconColorClass="text-purple-600 bg-purple-100" />
        <StatCard title="Total Orders" value={totalOrders} icon={ShoppingCart} iconColorClass="text-blue-600 bg-blue-100" />
        <StatCard title="Average Order Value" value={averageSales} icon={TrendingUp} iconColorClass="text-emerald-600 bg-emerald-100" />
        <StatCard title="Daily Cash Balance" value={dailyCashBalance} icon={Wallet} iconColorClass="text-amber-600 bg-amber-100" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Sales Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'}} 
                  itemStyle={{color: '#475569', fontWeight: 600}}
                />
                <Area type="monotone" dataKey="sales" name="Sales (฿)" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" activeDot={{r: 6, strokeWidth: 0, fill: '#8b5cf6'}} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {topSellingItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topSellingItems} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} itemStyle={{color: '#475569', fontWeight: 600}} />
                  <Bar dataKey="sales" name="Items Sold" fill="url(#colorBar)" radius={[6, 6, 0, 0]} maxBarSize={45} /> 
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySales}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    stroke="none"
                  >
                    {categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    itemStyle={{fontWeight: 600}}
                    formatter={(value) => `฿${value.toFixed(2)}`} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                    stroke="none"
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index+2) % COLORS.length]} stroke="#ffffff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                    itemStyle={{fontWeight: 600}}
                    formatter={(value, name) => [`${value} transactions`, name]} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-[300px] flex items-center justify-center text-slate-400">No data available</div>}
          </CardContent>
        </Card>
      </div>

      {/* New Widgets: Recent Transactions & Low Stock */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-slate-400" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Order ID</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3 text-right rounded-tr-lg">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700">#{tx.orderNumber || tx.id.slice(0,6)}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {tx.created_at ? format(new Date(tx.created_at), 'HH:mm') : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium capitalize">
                          {tx.payment_method}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-700">
                        ฿{Number(tx.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-400">No recent transactions</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center text-rose-500">
              <AlertCircle className="w-5 h-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <div>
                      <p className="font-medium text-rose-900">{item.name}</p>
                      <p className="text-xs text-rose-600 mt-0.5">Threshold: {item.low_stock_threshold} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-rose-700">{item.stock_quantity}</p>
                      <p className="text-xs text-rose-600">{item.unit}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                    <ShoppingCart className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p>All stock levels are healthy!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
