import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar } from './ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { useAttendance } from './AttendanceContext';
import { 
  Users, 
  Calendar as CalendarIcon, 
  BarChart3, 
  LogOut,
  UserCheck,
  UserX,
  Clock,
  Search,
  Download,
  FileText,
  Camera,
  Timer,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PeriodTimer } from './PeriodTimer';

interface TeacherDashboardProps {
  user: any;
  logout: () => void;
}

// Mock data
const mockStudents = [
  { id: 1, name: 'Amit Singh', rollNo: 'CS21001', present: true, arrivalTime: '09:15 AM' },
  { id: 2, name: 'Kavya Patel', rollNo: 'CS21002', present: true, arrivalTime: '09:10 AM' },
  { id: 3, name: 'Ravi Kumar', rollNo: 'CS21003', present: false, arrivalTime: null },
  { id: 4, name: 'Priya Sharma', rollNo: 'CS21004', present: true, arrivalTime: '09:20 AM' },
  { id: 5, name: 'Rajesh Gupta', rollNo: 'CS21005', present: false, arrivalTime: null },
  { id: 6, name: 'Sunita Devi', rollNo: 'CS21006', present: true, arrivalTime: '09:05 AM' },
];

const attendanceHistory = [
  { date: '2024-01-15', present: 48, absent: 4, total: 52 },
  { date: '2024-01-14', present: 50, absent: 2, total: 52 },
  { date: '2024-01-13', present: 46, absent: 6, total: 52 },
  { date: '2024-01-12', present: 52, absent: 0, total: 52 },
  { date: '2024-01-11', present: 44, absent: 8, total: 52 },
];

export function TeacherDashboard({ user, logout }: TeacherDashboardProps) {
  const { selfAttendanceEnabled, setSelfAttendanceEnabled, currentSession, setCurrentSession } = useAttendance();
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessionTimeLeft, setSessionTimeLeft] = useState(30); // minutes

  const handleLogout = () => {
    logout();
  };

  const toggleAttendance = (studentId: number) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present, arrivalTime: !student.present ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null }
        : student
    ));
  };

  const markAllPresent = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStudents(prev => prev.map(student => ({ 
      ...student, 
      present: true, 
      arrivalTime: currentTime 
    })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ 
      ...student, 
      present: false, 
      arrivalTime: null 
    })));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  );

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;
  const attendancePercentage = Math.round((presentCount / students.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-lg">Professor Dashboard</h1>
                <p className="text-sm text-muted-foreground">CS201 - Data Structures</p>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
            <TabsTrigger value="self-attendance">Self Attendance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="periods">Lectures</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{students.length}</div>
                  <p className="text-xs text-muted-foreground">Enrolled in course</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Present Today</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{presentCount}</div>
                  <p className="text-xs text-muted-foreground">Students present</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Absent Today</CardTitle>
                  <UserX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-red-600">{absentCount}</div>
                  <p className="text-xs text-muted-foreground">Students absent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Attendance %</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{attendancePercentage}%</div>
                  <p className="text-xs text-muted-foreground">Today's rate</p>
                </CardContent>
              </Card>
            </div>



            {/* Attendance Marking */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div>
                    <CardTitle>Mark Attendance - {new Date().toLocaleDateString()}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Current time: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={markAllPresent} size="sm" className="bg-green-600 hover:bg-green-700">
                      <UserCheck className="h-4 w-4 mr-2" />
                      Mark All Present
                    </Button>
                    <Button onClick={markAllAbsent} variant="outline" size="sm">
                      <UserX className="h-4 w-4 mr-2" />
                      Mark All Absent
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      AI Recognition
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Arrival Time</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </TableCell>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>
                          <Badge variant={student.present ? "default" : "secondary"}>
                            {student.present ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.arrivalTime || '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={student.present}
                              onCheckedChange={() => toggleAttendance(student.id)}
                            />
                            <Label className="text-sm">
                              {student.present ? "Present" : "Absent"}
                            </Label>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="self-attendance" className="space-y-6">
            {/* Self Attendance Control */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <CardTitle>Student Self-Attendance System</CardTitle>
                  </div>
                  <Badge variant={selfAttendanceEnabled ? "default" : "secondary"}>
                    {selfAttendanceEnabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Control when students can mark their own attendance using facial recognition technology
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">Enable Self-Attendance</p>
                          {selfAttendanceEnabled && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Current Session: {currentSession}
                        </p>
                        {selfAttendanceEnabled && (
                          <p className="text-xs text-blue-600">
                            Auto-disable in {sessionTimeLeft} minutes
                          </p>
                        )}
                      </div>
                      <Switch
                        checked={selfAttendanceEnabled}
                        onCheckedChange={setSelfAttendanceEnabled}
                      />
                    </div>

                    {selfAttendanceEnabled && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Self-attendance is now ACTIVE!</strong><br />
                          Students can now mark their attendance using facial recognition on their devices.
                        </AlertDescription>
                      </Alert>
                    )}

                    {!selfAttendanceEnabled && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Self-attendance is DISABLED.</strong><br />
                          Students cannot mark their own attendance. Only you can mark attendance manually.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">System Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Facial Recognition System</span>
                          <Badge variant="default" className="text-xs">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Geofence Verification</span>
                          <Badge variant="default" className="text-xs">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Security Level</span>
                          <Badge variant="default" className="text-xs">High</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Students Eligible</span>
                          <Badge variant="secondary" className="text-xs">{students.length}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Only enable during active lecture periods</li>
                        <li>• Students must be within campus geofence</li>
                        <li>• System uses AI to verify student identity</li>
                        <li>• All attempts are logged for security</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">How Self-Attendance Works</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm mx-auto mb-2">1</div>
                      <p className="text-sm font-medium text-blue-900">Teacher Enables</p>
                      <p className="text-xs text-blue-700 mt-1">You enable self-attendance during lecture</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm mx-auto mb-2">2</div>
                      <p className="text-sm font-medium text-green-900">Student Access</p>
                      <p className="text-xs text-green-700 mt-1">Students see facial recognition option</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm mx-auto mb-2">3</div>
                      <p className="text-sm font-medium text-purple-900">AI Verification</p>
                      <p className="text-xs text-purple-700 mt-1">System verifies student identity</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg text-center">
                      <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm mx-auto mb-2">4</div>
                      <p className="text-sm font-medium text-orange-900">Auto Record</p>
                      <p className="text-xs text-orange-700 mt-1">Attendance marked automatically</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Self-Attendance Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Self-Attendance Activity</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Students who have marked attendance using facial recognition today
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Verification Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=AmitSingh" />
                          <AvatarFallback>AS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Amit Singh</p>
                          <p className="text-xs text-muted-foreground">CS21001</p>
                        </div>
                      </TableCell>
                      <TableCell>09:15 AM</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Camera className="h-3 w-3" />
                          <span className="text-xs">Facial Recognition</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=KavyaPatel" />
                          <AvatarFallback>KP</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Kavya Patel</p>
                          <p className="text-xs text-muted-foreground">CS21002</p>
                        </div>
                      </TableCell>
                      <TableCell>09:18 AM</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Camera className="h-3 w-3" />
                          <span className="text-xs">Facial Recognition</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma" />
                          <AvatarFallback>PS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Priya Sharma</p>
                          <p className="text-xs text-muted-foreground">CS21004</p>
                        </div>
                      </TableCell>
                      <TableCell>09:22 AM</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Camera className="h-3 w-3" />
                          <span className="text-xs">Facial Recognition</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2>Attendance Reports</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceHistory.map((record, index) => {
                      const percentage = Math.round((record.present / record.total) * 100);
                      return (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-green-600">{record.present}</TableCell>
                          <TableCell className="text-red-600">{record.absent}</TableCell>
                          <TableCell>{record.total}</TableCell>
                          <TableCell>
                            <Badge variant={percentage >= 85 ? "default" : "secondary"}>
                              {percentage}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Analysis</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Days Present</TableHead>
                      <TableHead>Days Absent</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student) => {
                      const daysPresent = Math.floor(Math.random() * 20) + 15;
                      const totalDays = 20;
                      const daysAbsent = totalDays - daysPresent;
                      const attendanceRate = Math.round((daysPresent / totalDays) * 100);
                      
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span>{student.name}</span>
                          </TableCell>
                          <TableCell className="text-green-600">{daysPresent}</TableCell>
                          <TableCell className="text-red-600">{daysAbsent}</TableCell>
                          <TableCell>{attendanceRate}%</TableCell>
                          <TableCell>
                            <Badge variant={attendanceRate >= 85 ? "default" : attendanceRate >= 75 ? "secondary" : "destructive"}>
                              {attendanceRate >= 85 ? "Good" : attendanceRate >= 75 ? "Average" : "Poor"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
                      Attendance for {date?.toLocaleDateString() || 'Selected Date'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {date ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl text-green-600">22</div>
                            <div className="text-sm text-muted-foreground">Present</div>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl text-red-600">4</div>
                            <div className="text-sm text-muted-foreground">Absent</div>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl text-blue-600">85%</div>
                            <div className="text-sm text-muted-foreground">Rate</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>Lecture 1: 09:00 AM - 10:30 AM</p>
                          <p>Break: 10:30 AM - 10:45 AM</p>
                          <p>Lecture 2: 10:45 AM - 12:15 PM</p>
                          <p>Lunch Break: 12:15 PM - 01:15 PM</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Please select a date to view attendance details.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="periods" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-green-600" />
                <h2>Lecture Management</h2>
              </div>
            </div>
            <PeriodTimer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}