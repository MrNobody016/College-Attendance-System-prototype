import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Calendar } from './ui/calendar';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Calendar as CalendarIcon, 
  BarChart3, 
  LogOut,
  Bell,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ParentDashboardProps {
  user: any;
  logout: () => void;
}

// Mock data
const childData = {
  id: 1,
  name: 'Arjun Patel',
  course: 'B.Tech Computer Science',
  year: '2nd Year',
  rollNo: 'CS21005',
  college: 'Engineering College Delhi',
  department: 'Computer Science',
  advisor: 'Prof. Priya Sharma',
  photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunPatel'
};

const attendanceData = [
  { date: '2024-01-15', status: 'present', arrivalTime: '09:15 AM', departureTime: '03:30 PM' },
  { date: '2024-01-14', status: 'present', arrivalTime: '09:10 AM', departureTime: '03:30 PM' },
  { date: '2024-01-13', status: 'absent', arrivalTime: null, departureTime: null },
  { date: '2024-01-12', status: 'present', arrivalTime: '09:20 AM', departureTime: '03:30 PM' },
  { date: '2024-01-11', status: 'present', arrivalTime: '09:05 AM', departureTime: '03:30 PM' },
  { date: '2024-01-10', status: 'present', arrivalTime: '09:15 AM', departureTime: '03:30 PM' },
  { date: '2024-01-09', status: 'present', arrivalTime: '09:25 AM', departureTime: '03:30 PM' },
];

const notifications = [
  {
    id: 1,
    type: 'absence',
    message: 'Arjun was absent from Data Structures lecture on January 13, 2024',
    date: '2024-01-13',
    read: false
  },
  {
    id: 2,
    type: 'late',
    message: 'Arjun arrived late (9:25 AM) for morning lecture on January 9, 2024',
    date: '2024-01-09',
    read: true
  },
  {
    id: 3,
    type: 'achievement',
    message: 'Arjun has maintained 95% attendance this semester!',
    date: '2024-01-08',
    read: true
  }
];

export function ParentDashboard({ user, logout }: ParentDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleLogout = () => {
    logout();
  };

  // Calculate attendance statistics
  const totalDays = attendanceData.length;
  const presentDays = attendanceData.filter(d => d.status === 'present').length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // Get recent attendance trend
  const recentAttendance = attendanceData.slice(0, 5);
  const recentPresentDays = recentAttendance.filter(d => d.status === 'present').length;
  const recentPercentage = Math.round((recentPresentDays / 5) * 100);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'absence':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-lg">Parent Dashboard</h1>
                <p className="text-sm text-muted-foreground">Track your child's attendance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Child Information */}
            <Card>
              <CardHeader>
                <CardTitle>Child Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={childData.photo} />
                    <AvatarFallback>{childData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl">{childData.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p><strong>Course:</strong> {childData.course}</p>
                      <p><strong>Year:</strong> {childData.year}</p>
                      <p><strong>Roll No:</strong> {childData.rollNo}</p>
                      <p><strong>College:</strong> {childData.college}</p>
                      <p><strong>Department:</strong> {childData.department}</p>
                      <p><strong>Academic Advisor:</strong> {childData.advisor}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call College
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Message Advisor
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Overall Attendance</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{attendancePercentage}%</div>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                  <Progress value={attendancePercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Days Present</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{presentDays}</div>
                  <p className="text-xs text-muted-foreground">Out of {totalDays} days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Days Absent</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600">{absentDays}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Trend</CardTitle>
                  {recentPercentage >= attendancePercentage ? 
                    <TrendingUp className="h-4 w-4 text-green-600" /> : 
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  }
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl ${recentPercentage >= attendancePercentage ? 'text-green-600' : 'text-red-600'}`}>
                    {recentPercentage >= attendancePercentage ? '+' : ''}{recentPercentage - attendancePercentage}%
                  </div>
                  <p className="text-xs text-muted-foreground">vs last week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="text-sm">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.arrivalTime ? `Arrived: ${record.arrivalTime}` : 'Absent'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={record.status === 'present' ? "default" : "secondary"}>
                        {record.status === 'present' ? 'Present' : 'Absent'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Attendance Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceData.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={record.status === 'present' ? "default" : "secondary"} className="mb-1">
                          {record.status === 'present' ? 'Present' : 'Absent'}
                        </Badge>
                        {record.arrivalTime && (
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {record.arrivalTime} - {record.departureTime}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Attendance Details - {date?.toLocaleDateString() || 'Select a date'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {date ? (
                      <div className="space-y-4">
                        {(() => {
                          const dateStr = date.toISOString().split('T')[0];
                          const record = attendanceData.find(r => r.date === dateStr);
                          
                          if (record) {
                            return (
                              <div>
                                <div className="flex items-center space-x-2 mb-4">
                                  <div className={`w-4 h-4 rounded-full ${record.status === 'present' ? 'bg-green-500' : 'bg-red-500'}`} />
                                  <Badge variant={record.status === 'present' ? "default" : "secondary"}>
                                    {record.status === 'present' ? 'Present' : 'Absent'}
                                  </Badge>
                                </div>
                                
                                {record.status === 'present' ? (
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      <Clock className="h-4 w-4 inline mr-2" />
                                      <strong>Arrival:</strong> {record.arrivalTime}
                                    </p>
                                    <p className="text-sm">
                                      <Clock className="h-4 w-4 inline mr-2" />
                                      <strong>Departure:</strong> {record.departureTime}
                                    </p>
                                    <p className="text-sm">
                                      <MapPin className="h-4 w-4 inline mr-2" />
                                      <strong>Location:</strong> {childData.college}
                                    </p>
                                  </div>
                                ) : (
                                  <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                      {childData.name} was absent on this day. Please contact the college if this is incorrect.
                                    </AlertDescription>
                                  </Alert>
                                )}
                              </div>
                            );
                          } else {
                            return (
                              <p className="text-muted-foreground">No attendance record found for this date.</p>
                            );
                          }
                        })()}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Please select a date to view attendance details.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Monthly Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-lg text-green-600">{presentDays}</div>
                        <div className="text-xs text-muted-foreground">Present Days</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-lg text-red-600">{absentDays}</div>
                        <div className="text-xs text-muted-foreground">Absent Days</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg text-blue-600">{attendancePercentage}%</div>
                        <div className="text-xs text-muted-foreground">Attendance Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border rounded-lg ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">College Office</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        +91 9876543210
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        office@engineeringcollege.edu.in
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Academic Advisor - {childData.advisor}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        +91 9876543211
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        priya.teacher@gramschool.edu.in
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}