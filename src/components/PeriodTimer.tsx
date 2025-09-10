import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Bell,
  Calendar,
  Timer,
  AlertCircle
} from 'lucide-react';

interface PeriodTimerProps {
  onPeriodChange?: (period: any) => void;
}

export function PeriodTimer({ onPeriodChange }: PeriodTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isActive, setIsActive] = useState(true);
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBreak, setIsBreak] = useState(false);

  // College lecture timetable
  const timetable = [
    { id: 1, name: 'Lecture 1 - Data Structures', start: '09:00', end: '10:30', duration: 90, type: 'lecture' },
    { id: 2, name: 'Break', start: '10:30', end: '10:45', duration: 15, type: 'break' },
    { id: 3, name: 'Lecture 2 - Algorithms', start: '10:45', end: '12:15', duration: 90, type: 'lecture' },
    { id: 4, name: 'Lunch Break', start: '12:15', end: '01:15', duration: 60, type: 'break' },
    { id: 5, name: 'Lecture 3 - Database Systems', start: '01:15', end: '02:45', duration: 90, type: 'lecture' },
    { id: 6, name: 'Break', start: '02:45', end: '03:00', duration: 15, type: 'break' },
    { id: 7, name: 'Lab Session - Programming', start: '03:00', end: '05:00', duration: 120, type: 'lab' },
    { id: 8, name: 'Tutorial Session', start: '05:00', end: '06:00', duration: 60, type: 'tutorial' }
  ];

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate current period and time left
  useEffect(() => {
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 0; i < timetable.length; i++) {
      const period = timetable[i];
      const [startHour, startMin] = period.start.split(':').map(Number);
      const [endHour, endMin] = period.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (currentTimeMinutes >= startTime && currentTimeMinutes < endTime) {
        setCurrentPeriod(i);
        setTimeLeft(endTime - currentTimeMinutes);
        setIsBreak(period.type === 'break');
        
        if (onPeriodChange) {
          onPeriodChange(period);
        }
        break;
      }
    }
  }, [currentTime, onPeriodChange]);

  const getCurrentPeriodData = () => {
    return timetable[currentPeriod] || null;
  };

  const getNextPeriodData = () => {
    return timetable[currentPeriod + 1] || null;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const formatTimeLeft = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getProgressPercentage = () => {
    const period = getCurrentPeriodData();
    if (!period) return 0;
    
    const elapsed = period.duration - timeLeft;
    return Math.round((elapsed / period.duration) * 100);
  };

  const handleStartPeriod = () => {
    setIsActive(true);
    // In real implementation, this would sync with backend
  };

  const handlePausePeriod = () => {
    setIsActive(false);
  };

  const handleResetPeriod = () => {
    // Reset to beginning of current period
    const period = getCurrentPeriodData();
    if (period) {
      setTimeLeft(period.duration);
    }
  };

  const currentPeriodData = getCurrentPeriodData();
  const nextPeriodData = getNextPeriodData();

  return (
    <div className="space-y-6">
      {/* Current Time & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Lecture Timer System
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Paused"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-mono mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <p className="text-sm text-muted-foreground">Current Time</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-mono mb-2 text-blue-600">
                {formatTimeLeft(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
            </div>
            
            <div className="text-center">
              <div className="text-lg mb-2">
                {currentPeriodData ? currentPeriodData.name : 'Classes Ended'}
              </div>
              <p className="text-sm text-muted-foreground">Current Session</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Period Details */}
      {currentPeriodData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Timer className="h-5 w-5 mr-2" />
              Current Session: {currentPeriodData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Progress</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Start Time</p>
                  <p className="font-medium">{currentPeriodData.start}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">End Time</p>
                  <p className="font-medium">{currentPeriodData.end}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{currentPeriodData.duration} minutes</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <Badge variant={currentPeriodData.type === 'break' ? 'secondary' : 'default'}>
                    {currentPeriodData.type}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleStartPeriod} 
                  disabled={isActive}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
                <Button 
                  onClick={handlePausePeriod} 
                  disabled={!isActive}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button 
                  onClick={handleResetPeriod}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Break Time Alert */}
      {isBreak && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            <strong>Break Time:</strong> Students are currently on break. Next session will begin automatically.
          </AlertDescription>
        </Alert>
      )}

      {/* Next Period Preview */}
      {nextPeriodData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Next: {nextPeriodData.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Starts at</p>
                <p className="font-medium">{nextPeriodData.start}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{nextPeriodData.duration} minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timetable.map((period, index) => {
              const isCurrent = index === currentPeriod;
              const isPast = index < currentPeriod;
              
              return (
                <div 
                  key={period.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrent ? 'bg-blue-50 border-blue-200' : 
                    isPast ? 'bg-gray-50 border-gray-200' : 
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isCurrent ? 'bg-blue-600' : 
                      isPast ? 'bg-gray-400' : 
                      'bg-gray-300'
                    }`} />
                    <div>
                      <p className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>
                        {period.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {period.start} - {period.end}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={period.type === 'break' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {period.duration}m
                    </Badge>
                    {isCurrent && (
                      <Badge variant="default" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
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

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <span>✓ Automatic session transitions enabled</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span>📱 Professor notifications sent</span>
              <Badge variant="default">On</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span>🔔 Break time announcements</span>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
              <span>📊 Attendance tracking synchronized</span>
              <Badge variant="default">Live</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}