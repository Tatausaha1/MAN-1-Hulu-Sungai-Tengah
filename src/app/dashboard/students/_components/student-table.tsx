"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Student, Class } from "@/lib/types";
import { StudentForm } from "./student-form";
import { deleteStudentAction } from "@/lib/actions/student";
import { useToast } from "@/hooks/use-toast";

const PAGE_SIZE = 10;

export function StudentTable({
  initialStudents,
  classes,
}: {
  initialStudents: Student[];
  classes: Class[];
}) {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filteredStudents = useMemo(() => {
    let filtered = students;

    if (searchQuery) {
      filtered = filtered.filter((student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterClass !== "all") {
      filtered = filtered.filter((student) => student.classId === filterClass);
    }

    return filtered;
  }, [students, searchQuery, filterClass]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);

  const handleOpenForm = (student: Student | null = null) => {
    setEditingStudent(student);
    setIsSheetOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus siswa ini?")) return;
    startTransition(async () => {
        const result = await deleteStudentAction(id);
        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive'});
        } else {
            toast({ title: 'Sukses', description: result.success });
            // Optimistically update UI or re-fetch. For now, filter out.
            setStudents(prev => prev.filter(s => s.id !== id));
        }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Cari nama siswa..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-64"
          />
          <Select
            value={filterClass}
            onValueChange={(value) => {
              setFilterClass(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter berdasarkan kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Siswa
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NISN</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Jenis Kelamin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nisn}</TableCell>
                  <TableCell>{student.fullName}</TableCell>
                  <TableCell>
                    {classes.find((c) => c.id === student.classId)?.name || "N/A"}
                  </TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.email || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenForm(student)}>
                          Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(student.id)}
                          disabled={isPending}
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Tidak ada siswa yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Sebelumnya
          </Button>
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Berikutnya
          </Button>
        </div>
      )}
      
      <StudentForm 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        student={editingStudent}
        classes={classes}
      />
    </div>
  );
}

// A wrapper Card component to match the prompt's visual style.
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={`bg-white rounded-lg border shadow-sm ${className}`}>{children}</div>
}
