import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FacialRecognition } from './FacialRecognition';
import { useAttendance } from './AttendanceContext';
import { 
  User, 
  LogOut,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Calendar,
  Camera,
  BookOpen
} from 'lucide-react';

interface StudentDashboardProps {
  user: any;
  logout: () => void;
}

export function StudentDashboard({ user, logout }: StudentDashboardProps) {
  const { selfAttendanceEnabled, currentSession } = useAttendance();
  const [isInGeofence, setIsInGeofence] = useState(false);
  const [attendanceStarted, setAttendanceStarted] = useState(false);
  const [timeInSchool, setTimeInSchool] = useState(0);
  const [isOnline, setIsOnline] = useState(true);
  const [suspiciousBehavior, setSuspiciousBehavior] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([
    { date: '2024-01-15', status: 'present', method: 'facial-recognition', time: '09:15 AM' },
    { date: '2024-01-14', status: 'present', method: 'geofence', time: '09:10 AM' },
    { date: '2024-01-13', status: 'absent', method: null, time: null },
    { date: '2024-01-12', status: 'present', method: 'facial-recognition', time: '09:20 AM' },
  ]);

  // Mock student data
  const studentData = {
    id: user.id || 1,
    name: user.name || 'Alex Kumar',
    course: user.course || 'B.Tech Computer Science',
    year: user.year || '2nd Year',
    rollNo: user.rollNo || 'CS21012',
    college: 'Engineering College Delhi',
    department: user.department || 'Computer Science',
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'AlexKumar'}`
  };

  // Mock timetable data
  const timetable = [
    { time: '09:00 - 10:30', subject: 'Data Structures', teacher: 'Prof. Priya Sharma', current: true },
    { time: '10:30 - 10:45', subject: 'Break', teacher: '', current: false },
    { time: '10:45 - 12:15', subject: 'Algorithms', teacher: 'Prof. Rajesh Kumar', current: false },
    { time: '12:15 - 01:15', subject: 'Lunch Break', teacher: '', current: false },
    { time: '01:15 - 02:45', subject: 'Database Systems', teacher: 'Prof. Amit Singh', current: false },
    { time: '02:45 - 03:00', subject: 'Break', teacher: '', current: false },
    { time: '03:00 - 05:00', subject: 'Programming Lab', teacher: 'Prof. Kavya Patel', current: false },
    { time: '02:30 - 03:15', subject: 'Art & Craft', teacher: 'Mr. Ravi Gupta' }
  ];

  const handleLogout = () => {
    logout();
  };

  // Handle facial recognition attendance
  const handleAttendanceMarked = (success: boolean, timestamp: Date) => {
    if (success) {
      setAttendanceMarked(true);
      const newRecord = {
        date: timestamp.toISOString().split('T')[0],
        status: 'present' as const,
        method: 'facial-recognition' as const,
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAttendanceHistory(prev => [newRecord, ...prev]);
    }
  };

  // Simulate geofence checking
  const checkGeofence = () => {
    // Mock geolocation check - in real app would use actual GPS
    setIsInGeofence(true);
    if (!attendanceStarted) {
      setAttendanceStarted(true);
    }
  };

  // Timer effect for time in school
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (attendanceStarted && isInGeofence) {
      interval = setInterval(() => {
        setTimeInSchool(prev => prev + 1);
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [attendanceStarted, isInGeofence]);

  // Mock ML behavior detection
  useEffect(() => {
    const behaviorCheck = setInterval(() => {
      // Random suspicious behavior detection for demo
      setSuspiciousBehavior(Math.random() < 0.1); // 10% chance
    }, 30000); // Check every 30 seconds

    return () => clearInterval(behaviorCheck);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-lg">Student Portal</h1>
                <p className="text-sm text-muted-foreground">College Attendance System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm">{studentData.name}</p>
                <p className="text-xs text-muted-foreground">Roll No: {studentData.rollNo}</p>
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
            <TabsTrigger value="attendance">Mark Attendance</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">Attendance History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        {/* Student Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={studentData.photo} />
                <AvatarFallback>{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl">{studentData.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm text-muted-foreground">
                  <p><strong>Course:</strong> {studentData.course}</p>
                  <p><strong>Year:</strong> {studentData.year}</p>
                  <p><strong>Roll No:</strong> {studentData.rollNo}</p>
                  <p><strong>College:</strong> {studentData.college}</p>
                  <p><strong>Department:</strong> {studentData.department}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Badge variant={isInGeofence ? "default" : "secondary"} className="justify-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {isInGeofence ? 'On Campus' : 'Off Campus'}
                </Badge>
                <Badge variant={attendanceStarted ? "default" : "secondary"} className="justify-center">
                  {attendanceStarted ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
                  {attendanceStarted ? 'Attendance Active' : 'Not Started'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ML Behavior Alert */}
        {suspiciousBehavior && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Attention:</strong> Our AI system has detected unusual behavior patterns. Please ensure you're following school guidelines.
            </AlertDescription>
          </Alert>
        )}

        {/* Attendance Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Geofence Status</CardTitle>
              <MapPin className={`h-4 w-4 ${isInGeofence ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl ${isInGeofence ? 'text-green-600' : 'text-red-600'}`}>
                {isInGeofence ? 'Inside' : 'Outside'}
              </div>
              <p className="text-xs text-muted-foreground">Campus boundary</p>
              {!isInGeofence && (
                <Button onClick={checkGeofence} size="sm" className="mt-2 w-full">
                  Check Location
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Time on Campus</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{formatTime(timeInSchool)}</div>
              <p className="text-xs text-muted-foreground">Today's duration</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Current Session</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg">{currentSession}</div>
              <p className="text-xs text-muted-foreground">Now active</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How Attendance Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">1</div>
                <div>
                  <p className="text-sm"><strong>Enter School Premises:</strong> Your attendance starts automatically when you enter the school geofence.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">2</div>
                <div>
                  <p className="text-sm"><strong>Time Tracking:</strong> The system tracks your time in school continuously while you're within the boundary.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">3</div>
                <div>
                  <p className="text-sm"><strong>Automatic Monitoring:</strong> AI monitors behavior patterns to ensure safety and compliance.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">4</div>
                <div>
                  <p className="text-sm"><strong>Real-time Updates:</strong> Parents and teachers receive live updates about your attendance status.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Timetable */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timetable.map((period, index) => {
                const isActive = period.subject === currentSession;
                return (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${isActive ? 'bg-blue-50 border-blue-200' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      <div>
                        <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>{period.subject}</p>
                        <p className="text-xs text-muted-foreground">{period.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {period.teacher && (
                        <p className="text-xs text-muted-foreground">{period.teacher}</p>
                      )}
                      {isActive && (
                        <Badge variant="default" className="text-xs mt-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Geofence System</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">ML Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">Network Connection</span>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <FacialRecognition
              studentName={studentData.name}
              rollNo={studentData.rollNo}
              onAttendanceMarked={handleAttendanceMarked}
              isEnabled={selfAttendanceEnabled}
              currentSession={currentSession}
            />
            
            {attendanceMarked && (
              <Alert>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <strong>Success!</strong> Your attendance has been marked for today's session.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timetable.map((period, index) => {
                    const isActive = period.current;
                    return (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${isActive ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`} />
                          <div>
                            <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>{period.subject}</p>
                            <p className="text-xs text-muted-foreground">{period.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {period.teacher && (
                            <p className="text-xs text-muted-foreground">{period.teacher}</p>
                          )}
                          {isActive && (
                            <Badge variant="default" className="text-xs mt-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
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
                        {record.method && (
                          <p className="text-xs text-muted-foreground">
                            {record.method === 'facial-recognition' && <Camera className="h-3 w-3 inline mr-1" />}
                            {record.method === 'geofence' && <MapPin className="h-3 w-3 inline mr-1" />}
                            {record.time && `${record.time} - ${record.method.replace('-', ' ')}`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}