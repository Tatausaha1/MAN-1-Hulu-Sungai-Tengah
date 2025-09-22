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
      setScanStatus({ type: 'info', message: 'Memulai pemindai...' });

      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      const onScanSuccess = async (decodedText: string) => {
        scanner.pause();
        try {
          // Asumsi kode QR berisi studentId
          const result = await recordAttendance(decodedText, selectedClass, 'user-2'); // ID guru di-hardcode
          
          if (result.error) {
            setScanStatus({ type: 'error', message: result.error });
          } else {
            setScanStatus({ type: 'success', message: result.success!, data: result.data });
          }
        } catch (error) {
          setScanStatus({ type: 'error', message: 'Terjadi kesalahan tak terduga.' });
        }
        setTimeout(() => {
            if (scannerRef.current?.isScanning) {
                scanner.resume();
            }
            setScanStatus({ type: 'info', message: 'Siap memindai kode QR berikutnya.' });
        }, 3000);
      };

      const onScanFailure = (error: any) => {
        // Abaikan galat "QR code not found"
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      scanner.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
        .catch(err => {
          setScanStatus({ type: 'error', message: `Galat Pemindai: ${err}. Pastikan izin kamera diaktifkan.` });
        });

    } else if (!selectedClass && isScannerActive) {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
            setIsScannerActive(false);
            setScanStatus(null);
        }).catch(err => {
            console.error("Gagal menghentikan pemindai", err);
        });
      }
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(err => console.error("Pembersihan gagal", err));
      }
    };
  }, [selectedClass, isScannerActive]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Absensi Kode QR</CardTitle>
        <CardDescription>Pilih kelas dan arahkan kamera ke kode QR siswa.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kelas
          </label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger id="class-select" className="w-full">
              <SelectValue placeholder="-- Pilih kelas untuk mulai memindai --" />
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
                  {scanStatus.type === 'success' ? 'Sukses!' : scanStatus.type === 'error' ? 'Error!' : 'Status'}
                </AlertTitle>
                <AlertDescription>
                  <p>{scanStatus.message}</p>
                  {scanStatus.type === 'success' && scanStatus.data && (
                    <div className="text-sm mt-2">
                      <p><strong>Siswa:</strong> {scanStatus.data.studentName}</p>
                      <p><strong>Kelas:</strong> {scanStatus.data.className}</p>
                      <p><strong>Waktu:</strong> {scanStatus.data.time}</p>
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
