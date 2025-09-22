"use client";

import { useState, useEffect, useRef, useTransition } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { useToast } from '@/hooks/use-toast';
import { recordAttendance } from '@/lib/actions/attendance';
import type { Class } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface QrScannerProps {
  availableClasses: Class[];
}

export function QrScanner({ availableClasses }: QrScannerProps) {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<{ type: 'info' | 'success' | 'error'; message: string; data?: any } | null>(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedClass && !isScannerActive) {
      setIsScannerActive(true);
      setScanStatus({ type: 'info', message: 'Starting scanner...' });

      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      const onScanSuccess = async (decodedText: string) => {
        scanner.pause();
        try {
          // Assuming QR code contains studentId
          const result = await recordAttendance(decodedText, selectedClass, 'user-2'); // Hardcoded teacher ID
          
          if (result.error) {
            setScanStatus({ type: 'error', message: result.error });
          } else {
            setScanStatus({ type: 'success', message: result.success!, data: result.data });
          }
        } catch (error) {
          setScanStatus({ type: 'error', message: 'An unexpected error occurred.' });
        }
        setTimeout(() => {
            if (scannerRef.current?.isScanning) {
                scanner.resume();
            }
            setScanStatus({ type: 'info', message: 'Ready to scan next QR code.' });
        }, 3000);
      };

      const onScanFailure = (error: any) => {
        // Ignore "QR code not found" errors
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      scanner.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch(err => {
          setScanStatus({ type: 'error', message: `Scanner Error: ${err}. Please ensure camera access is allowed.` });
        });

    } else if (!selectedClass && isScannerActive) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
            setIsScannerActive(false);
            setScanStatus(null);
        }).catch(err => {
            console.error("Failed to stop scanner", err);
        });
      }
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Cleanup failed", err));
      }
    };
  }, [selectedClass, isScannerActive]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">QR Code Attendance</CardTitle>
        <CardDescription>Select a class and point the camera at the student's QR code.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Class
          </label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="class-select" className="w-full">
              <SelectValue placeholder="-- Choose a class to start scanning --" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass && (
          <div className="space-y-4">
            <div id="reader" className="w-full border-2 border-dashed rounded-lg bg-muted/50 aspect-square"></div>
            
            {scanStatus && (
              <Alert variant={scanStatus.type === 'error' ? 'destructive' : 'default'} className={scanStatus.type === 'success' ? 'bg-green-100 dark:bg-green-900 border-green-500' : ''}>
                {scanStatus.type === 'success' && <CheckCircle className="h-4 w-4" />}
                {scanStatus.type === 'error' && <XCircle className="h-4 w-4" />}
                <AlertTitle>
                  {scanStatus.type === 'success' ? 'Success!' : scanStatus.type === 'error' ? 'Error!' : 'Status'}
                </AlertTitle>
                <AlertDescription>
                  <p>{scanStatus.message}</p>
                  {scanStatus.type === 'success' && scanStatus.data && (
                    <div className="text-sm mt-2">
                      <p><strong>Student:</strong> {scanStatus.data.studentName}</p>
                      <p><strong>Class:</strong> {scanStatus.data.className}</p>
                      <p><strong>Time:</strong> {scanStatus.data.time}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
