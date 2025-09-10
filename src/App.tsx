import React, { useState, createContext, useContext } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { AdminDashboard } from './components/AdminDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ParentDashboard } from './components/ParentDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AttendanceProvider } from './components/AttendanceContext';
import { School, Users, GraduationCap, User } from 'lucide-react';

// Auth Context
export const AuthContext = createContext<{
  user: any;
  login: (email: string, password: string, role: string) => void;
  logout: () => void;
} | null>(null);

// Mock user data
const mockUsers = {
  admin: { id: 1, name: 'Dr. Sarah Wilson', email: 'admin@college.edu', role: 'admin' },
  teacher: { id: 2, name: 'Prof. John Smith', email: 'professor@college.edu', role: 'teacher', department: 'Computer Science', courses: ['CS101', 'CS201'] },
  parent: { id: 3, name: 'Parent User', email: 'parent@email.com', role: 'parent', children: [{ id: 1, name: 'Alex Kumar', course: 'B.Tech Computer Science', year: '2nd Year' }] },
  student: { id: 4, name: 'Alex Kumar', email: 'student@college.edu', role: 'student', course: 'B.Tech Computer Science', year: '2nd Year', rollNo: 'CS21012', department: 'Computer Science' }
};

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const authContext = useContext(AuthContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authContext && email && password && role) {
      authContext.login(email, password, role);
    }
  };

  const quickLogin = (userRole: string) => {
    const userData = mockUsers[userRole as keyof typeof mockUsers];
    if (authContext && userData) {
      authContext.login(userData.email, 'password', userData.role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2">College Attendance System</h1>
          <p className="text-muted-foreground">Automated Attendance Management</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Professor</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <p className="text-center text-sm text-muted-foreground mb-4">Quick Demo Login:</p>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={() => quickLogin('admin')}
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Login as Admin
            </Button>
            <Button
              variant="outline"
              onClick={() => quickLogin('teacher')}
              className="w-full justify-start"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Login as Professor
            </Button>
            <Button
              variant="outline"
              onClick={() => quickLogin('parent')}
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              Login as Parent
            </Button>
            <Button
              variant="outline"
              onClick={() => quickLogin('student')}
              className="w-full justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              Login as Student
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string, role: string) => {
    // In a real app, this would validate against a backend
    const userData = mockUsers[role as keyof typeof mockUsers];
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard user={user} logout={logout} />;
      case 'teacher':
        return <TeacherDashboard user={user} logout={logout} />;
      case 'parent':
        return <ParentDashboard user={user} logout={logout} />;
      case 'student':
        return <StudentDashboard user={user} logout={logout} />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <AttendanceProvider>
        <div className="min-h-screen bg-background">
          {user ? renderDashboard() : <LoginForm />}
        </div>
      </AttendanceProvider>
    </AuthContext.Provider>
  );
}