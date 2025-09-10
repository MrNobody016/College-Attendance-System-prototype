import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AttendanceContextType {
  selfAttendanceEnabled: boolean;
  setSelfAttendanceEnabled: (enabled: boolean) => void;
  currentSession: string;
  setCurrentSession: (session: string) => void;
  sessionStartTime: Date | null;
  setSessionStartTime: (time: Date | null) => void;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ children }) => {
  const [selfAttendanceEnabled, setSelfAttendanceEnabled] = useState(false);
  const [currentSession, setCurrentSession] = useState('Data Structures Lecture');
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  return (
    <AttendanceContext.Provider
      value={{
        selfAttendanceEnabled,
        setSelfAttendanceEnabled,
        currentSession,
        setCurrentSession,
        sessionStartTime,
        setSessionStartTime,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};