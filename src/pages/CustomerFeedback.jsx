import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Star } from "lucide-react";
import { useFeedback, useAddFeedback } from '../hooks/useFeedback';

const CustomerFeedback = () => {
  const { data: feedbackList = [], isLoading } = useFeedback();
  const { mutate: addFeedback } = useAddFeedback();
  
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState('5');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    
    if (!comment.trim()) {
      setError('Please enter feedback comment');
      return;
    }

    addFeedback({
      rating: parseInt(rating),
      comment: comment.trim(),
    });
    
    resetForm();
  };

  const resetForm = () => {
    setComment('');
    setRating('5');
    setError('');
  };

  const getFeedbackStats = () => {
    const total = feedbackList.length;
    const ratingCounts = feedbackList.reduce((acc, item) => {
      acc[item.rating] = (acc[item.rating] || 0) + 1;
      return acc;
    }, {});
    
    const averageRating = total > 0 
      ? (feedbackList.reduce((sum, item) => sum + item.rating, 0) / total).toFixed(1)
      : 0;

    return { total, ratingCounts, averageRating };
  };

  const stats = getFeedbackStats();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Customer Feedback</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Enter Customer Feedback</CardTitle>
          <CardDescription>Record a new review from a customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Rating (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars - Excellent</SelectItem>
                  <SelectItem value="4">4 Stars - Good</SelectItem>
                  <SelectItem value="3">3 Stars - Average</SelectItem>
                  <SelectItem value="2">2 Stars - Poor</SelectItem>
                  <SelectItem value="1">1 Star - Terrible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Enter customer feedback comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total} Reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              {stats.averageRating} <Star className="h-6 w-6 text-yellow-400 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackList.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex text-yellow-400">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{item.comment}</TableCell>
                </TableRow>
              ))}
              {feedbackList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-4">No feedback yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerFeedback;