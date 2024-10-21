import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, AlertCircle } from "lucide-react";

const CustomerFeedback = () => {
  const [feedback, setFeedback] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedFeedback = JSON.parse(localStorage.getItem('customerFeedback')) || [];
    setFeedbackList(savedFeedback);
  }, []);

  const handleSubmit = () => {
    setError('');
    
    if (!feedback.trim()) {
      setError('Please enter feedback text');
      return;
    }
    if (!gender) {
      setError('Please select gender');
      return;
    }
    if (!ageRange) {
      setError('Please select age range');
      return;
    }

    const newFeedback = {
      id: Date.now(),
      feedback: feedback.trim(),
      gender,
      ageRange,
      timestamp: new Date().toISOString(),
    };
    
    const updatedFeedbackList = [newFeedback, ...feedbackList]; // Add new feedback at the start
    setFeedbackList(updatedFeedbackList);
    localStorage.setItem('customerFeedback', JSON.stringify(updatedFeedbackList));
    
    resetForm();
  };

  const resetForm = () => {
    setFeedback('');
    setGender('');
    setAgeRange('');
    setError('');
  };

  const handleDelete = (id) => {
    const updatedList = feedbackList.filter(item => item.id !== id);
    setFeedbackList(updatedList);
    localStorage.setItem('customerFeedback', JSON.stringify(updatedList));
  };

  const getFilteredFeedback = () => {
    if (filter === 'all') return feedbackList;
    return feedbackList.filter(item => item.ageRange === filter);
  };

  const getFeedbackStats = () => {
    const total = feedbackList.length;
    const genderCounts = feedbackList.reduce((acc, item) => {
      acc[item.gender] = (acc[item.gender] || 0) + 1;
      return acc;
    }, {});
    const ageCounts = feedbackList.reduce((acc, item) => {
      acc[item.ageRange] = (acc[item.ageRange] || 0) + 1;
      return acc;
    }, {});

    return { total, genderCounts, ageCounts };
  };

  const stats = getFeedbackStats();

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Customer Feedback</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Customer Feedback</CardTitle>
          <CardDescription>Please provide customer's feedback and demographic information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Age Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-18">0-18</SelectItem>
                  <SelectItem value="19-30">19-30</SelectItem>
                  <SelectItem value="31-50">31-50</SelectItem>
                  <SelectItem value="51+">51+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Enter customer feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>Submit Feedback</Button>
              <Button variant="outline" onClick={resetForm}>Clear Form</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.genderCounts).map(([gender, count]) => (
                <div key={gender} className="flex justify-between">
                  <span className="capitalize">{gender}</span>
                  <span>{((count / stats.total) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.ageCounts).map(([age, count]) => (
                <div key={age} className="flex justify-between">
                  <span>{age}</span>
                  <span>{((count / stats.total) * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="0-18">0-18</SelectItem>
                <SelectItem value="19-30">19-30</SelectItem>
                <SelectItem value="31-50">31-50</SelectItem>
                <SelectItem value="51+">51+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age Range</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredFeedback().map(item => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{item.gender}</TableCell>
                  <TableCell>{item.ageRange}</TableCell>
                  <TableCell className="max-w-md truncate">{item.feedback}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedback;