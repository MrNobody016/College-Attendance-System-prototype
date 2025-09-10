import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  School, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Radar
} from 'lucide-react';
import { GeofenceTracker } from './GeofenceTracker';

interface AdminDashboardProps {
  user: any;
  logout: () => void;
}

// Mock data
const mockColleges = [
  { id: 1, name: 'Engineering College Delhi', location: 'New Delhi', students: 2500, faculty: 180, attendance: 85 },
  { id: 2, name: 'Science & Technology Institute', location: 'Mumbai', students: 1800, faculty: 125, attendance: 92 },
  { id: 3, name: 'Commerce & Management College', location: 'Pune', students: 2200, faculty: 150, attendance: 78 }
];

const mockFaculty = [
  { id: 1, name: 'Dr. Priya Sharma', college: 'Engineering College Delhi', department: 'Computer Science', phone: '+91 9876543210' },
  { id: 2, name: 'Prof. Rajesh Kumar', college: 'Science & Technology Institute', department: 'Physics', phone: '+91 9876543211' },
  { id: 3, name: 'Dr. Sunita Devi', college: 'Commerce & Management College', department: 'Business Administration', phone: '+91 9876543212' }
];

const mockStudents = [
  { id: 1, name: 'Amit Singh', course: 'B.Tech Computer Science', college: 'Engineering College Delhi', year: '3rd Year', attendance: 90 },
  { id: 2, name: 'Kavya Patel', course: 'B.Sc Physics', college: 'Science & Technology Institute', year: '2nd Year', attendance: 95 },
  { id: 3, name: 'Ravi Kumar', course: 'MBA', college: 'Commerce & Management College', year: '1st Year', attendance: 82 }
];

export function AdminDashboard({ user, logout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <School className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-lg">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">College Attendance System</p>
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Colleges</TabsTrigger>
            <TabsTrigger value="teachers">Faculty</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="geofence">Geofence</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Colleges</CardTitle>
                  <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">3</div>
                  <p className="text-xs text-muted-foreground">Active colleges</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">6500</div>
                  <p className="text-xs text-muted-foreground">Enrolled students</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Faculty</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">455</div>
                  <p className="text-xs text-muted-foreground">Active faculty</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Avg Attendance</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">85%</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Schools Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Colleges Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockColleges.map((college) => (
                    <div key={college.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{college.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {college.location}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span>{college.students} Students</span>
                          <span>{college.faculty} Faculty</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={college.attendance >= 85 ? "default" : "secondary"}>
                          {college.attendance}% Attendance
                        </Badge>
                        <Progress value={college.attendance} className="w-20 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2>College Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add College
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockColleges.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell>{college.name}</TableCell>
                        <TableCell>{college.location}</TableCell>
                        <TableCell>{college.students}</TableCell>
                        <TableCell>{college.faculty}</TableCell>
                        <TableCell>
                          <Badge variant={college.attendance >= 85 ? "default" : "secondary"}>
                            {college.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2>Faculty Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Faculty
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFaculty.map((teacher) => (
                <Card key={teacher.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} />
                        <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{teacher.name}</h3>
                        <p className="text-sm text-muted-foreground">{teacher.department}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm flex items-center">
                        <School className="h-3 w-3 mr-2" />
                        {teacher.college}
                      </p>
                      <p className="text-sm flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {teacher.phone}
                      </p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2>Student Management</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>College</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.college}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge variant={student.attendance >= 85 ? "default" : "secondary"}>
                              {student.attendance}%
                            </Badge>
                            <Progress value={student.attendance} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geofence" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Radar className="h-5 w-5 text-blue-600" />
                <h2>Geofence & AI Monitoring</h2>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Configure Zone
              </Button>
            </div>
            <GeofenceTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}