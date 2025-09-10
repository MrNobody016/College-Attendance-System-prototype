import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RotateCcw,
  User,
  Shield,
  Clock
} from 'lucide-react';

interface FacialRecognitionProps {
  studentName: string;
  rollNo: string;
  onAttendanceMarked: (success: boolean, timestamp: Date) => void;
  isEnabled: boolean;
  currentSession?: string;
}

export function FacialRecognition({ 
  studentName, 
  rollNo, 
  onAttendanceMarked, 
  isEnabled,
  currentSession = "Data Structures Lecture"
}: FacialRecognitionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<'success' | 'failed' | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      setIsCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsRecognizing(true);
    setRecognitionResult(null);
    setProgress(0);

    // Simulate facial recognition process
    const recognitionSteps = [
      { step: 'Capturing image...', progress: 20 },
      { step: 'Detecting face...', progress: 40 },
      { step: 'Extracting features...', progress: 60 },
      { step: 'Matching with database...', progress: 80 },
      { step: 'Verifying identity...', progress: 100 }
    ];

    for (const { step, progress } of recognitionSteps) {
      setProgress(progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Capture image from video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
    }

    // Simulate recognition result (90% success rate for demo)
    const isSuccessful = Math.random() > 0.1;
    
    setRecognitionResult(isSuccessful ? 'success' : 'failed');
    setIsRecognizing(false);

    if (isSuccessful) {
      onAttendanceMarked(true, new Date());
      // Auto stop camera after successful recognition
      setTimeout(() => {
        stopCamera();
      }, 3000);
    }
  };

  const resetRecognition = () => {
    setRecognitionResult(null);
    setProgress(0);
  };

  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-400" />
            Self Attendance - Disabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Self-attendance is currently disabled. Please wait for your professor to enable it during the lecture.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Camera className="h-5 w-5 mr-2" />
            Facial Recognition Attendance
          </div>
          <Badge variant="default">
            {currentSession}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Student Info */}
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <User className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium">{studentName}</p>
            <p className="text-sm text-muted-foreground">Roll No: {rollNo}</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Camera Section */}
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera not active</p>
                </div>
              </div>
            )}
            
            {/* Recognition overlay */}
            {isRecognizing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Recognizing face...</p>
                  <Progress value={progress} className="w-32 mx-auto mt-2" />
                </div>
              </div>
            )}

            {/* Success/Failure overlay */}
            {recognitionResult && (
              <div className={`absolute inset-0 bg-opacity-50 flex items-center justify-center ${
                recognitionResult === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <div className="text-center text-white">
                  {recognitionResult === 'success' ? (
                    <>
                      <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">Attendance Marked!</p>
                      <p className="text-sm">Identity verified successfully</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">Recognition Failed</p>
                      <p className="text-sm">Please try again</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Control buttons */}
          <div className="flex gap-2">
            {!isCameraActive ? (
              <Button onClick={startCamera} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <>
                <Button 
                  onClick={captureAndRecognize} 
                  disabled={isRecognizing || recognitionResult === 'success'}
                  className="flex-1"
                >
                  {isRecognizing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Recognizing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Attendance
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={stopCamera}>
                  Stop Camera
                </Button>
                
                {recognitionResult && (
                  <Button variant="outline" onClick={resetRecognition}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Position your face clearly in the camera frame</li>
            <li>• Ensure good lighting for accurate recognition</li>
            <li>• Look directly at the camera</li>
            <li>• Remove glasses or masks if possible</li>
          </ul>
        </div>

        {/* Recognition Status */}
        {recognitionResult === 'success' && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Success!</strong> Your attendance has been marked for {currentSession}.
            </AlertDescription>
          </Alert>
        )}

        {recognitionResult === 'failed' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Recognition failed.</strong> Please ensure proper lighting and try again, or contact your professor for manual attendance.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}