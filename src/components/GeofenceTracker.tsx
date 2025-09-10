import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Wifi,
  Signal
} from 'lucide-react';

interface GeofenceTrackerProps {
  onLocationUpdate?: (data: any) => void;
}

export function GeofenceTracker({ onLocationUpdate }: GeofenceTrackerProps) {
  const [studentsInside, setStudentsInside] = useState(45);
  const [studentsOutside, setStudentsOutside] = useState(8);
  const [geofenceStatus, setGeofenceStatus] = useState<'active' | 'inactive' | 'warning'>('active');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mlAlerts, setMlAlerts] = useState(2);

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate student movements
      const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      setStudentsInside(prev => Math.max(0, prev + change));
      setStudentsOutside(prev => Math.max(0, prev - change));
      setLastUpdate(new Date());
      
      // Occasionally trigger ML alerts
      if (Math.random() < 0.1) {
        setMlAlerts(prev => prev + 1);
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock geofence boundary data
  const geofenceBoundary = {
    center: { lat: 28.6139, lng: 77.2090 }, // Delhi coordinates for demo
    radius: 100, // meters
    name: 'Gram Panchayat Primary School'
  };

  const recentActivity = [
    { id: 1, student: 'Amit Singh', action: 'Entered', time: '09:15 AM', status: 'success' },
    { id: 2, student: 'Priya Sharma', action: 'Exited', time: '09:12 AM', status: 'warning' },
    { id: 3, student: 'Kavya Patel', action: 'Entered', time: '09:10 AM', status: 'success' },
    { id: 4, student: 'Ravi Kumar', action: 'ML Alert', time: '09:08 AM', status: 'alert' },
    { id: 5, student: 'Sunita Devi', action: 'Entered', time: '09:05 AM', status: 'success' }
  ];

  return (
    <div className="space-y-6">
      {/* Geofence Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Students Inside</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{studentsInside}</div>
            <p className="text-xs text-muted-foreground">Within geofence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Students Outside</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">{studentsOutside}</div>
            <p className="text-xs text-muted-foreground">Outside boundary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">ML Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{mlAlerts}</div>
            <p className="text-xs text-muted-foreground">Behavior warnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">System Status</CardTitle>
            <Signal className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Badge variant="default" className="text-xs">
              <Wifi className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">All systems online</p>
          </CardContent>
        </Card>
      </div>

      {/* Geofence Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Geofence Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Boundary Settings</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>School Name:</strong> {geofenceBoundary.name}</p>
                  <p><strong>Center Coordinates:</strong> {geofenceBoundary.center.lat}, {geofenceBoundary.center.lng}</p>
                  <p><strong>Radius:</strong> {geofenceBoundary.radius} meters</p>
                  <p><strong>Last Updated:</strong> {lastUpdate.toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Adjust Boundary
                </Button>
                <Button size="sm" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Schedule
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Monitoring Features</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Tracking</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Entry/Exit Alerts</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ML Behavior Analysis</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Parent Notifications</span>
                    <Badge variant="default">On</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Real-time Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'warning' ? 'bg-orange-500' : 
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                  <Badge 
                    variant={
                      activity.status === 'success' ? 'default' : 
                      activity.status === 'warning' ? 'secondary' : 
                      'destructive'
                    }
                    className="text-xs mt-1"
                  >
                    {activity.action}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ML Behavior Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
            AI Behavior Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Python ML models are actively monitoring student behavior patterns for safety and security.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Anomaly Detection</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Detecting unusual movement patterns
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Group Analysis</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge variant="default">Monitoring</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Analyzing student group behaviors
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="text-sm font-medium mb-2">Safety Alerts</h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Alerts</span>
                <Badge variant="destructive">{mlAlerts}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Real-time safety notifications
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}