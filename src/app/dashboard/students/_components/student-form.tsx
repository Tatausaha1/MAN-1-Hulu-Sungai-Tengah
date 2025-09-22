"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Student, Class } from "@/lib/types";
import { createStudent, updateStudentAction } from "@/lib/actions/student";
import { useToast } from "@/hooks/use-toast";

const studentFormSchema = z.object({
  nisn: z.string().min(1, "NISN is required"),
  fullName: z.string().min(1, "Full Name is required"),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  classId: z.string().min(1, "Class is required"),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  student?: Student | null;
  classes: Class[];
}

export function StudentForm({ isOpen, onOpenChange, student, classes }: StudentFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      nisn: '',
      fullName: '',
      gender: 'Laki-laki',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: '',
      classId: '',
    },
  });

  useEffect(() => {
    if (student) {
      form.reset({
        ...student,
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset();
    }
  }, [student, form, isOpen]);

  const onSubmit = (data: StudentFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const result = student
        ? await updateStudentAction(student.id, formData)
        : await createStudent(formData);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: result.success,
        });
        onOpenChange(false);
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{student ? "Edit Student" : "Add New Student"}</SheetTitle>
          <SheetDescription>
            {student ? "Update the student's details." : "Fill in the form to add a new student."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nisn">NISN</Label>
            <Input id="nisn" {...form.register("nisn")} />
            {form.formState.errors.nisn && <p className="text-destructive text-sm">{form.formState.errors.nisn.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" {...form.register("fullName")} />
            {form.formState.errors.fullName && <p className="text-destructive text-sm">{form.formState.errors.fullName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => form.setValue('gender', value as 'Laki-laki' | 'Perempuan')} value={form.watch('gender')}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
              {form.formState.errors.dateOfBirth && <p className="text-destructive text-sm">{form.formState.errors.dateOfBirth.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
              {form.formState.errors.email && <p className="text-destructive text-sm">{form.formState.errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" {...form.register("phone")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...form.register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="classId">Class</Label>
            <Select onValueChange={(value) => form.setValue('classId', value)} value={form.watch('classId')}>
              <SelectTrigger id="classId">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.classId && <p className="text-destructive text-sm">{form.formState.errors.classId.message}</p>}
          </div>
          <SheetFooter className="pt-4">
            <SheetClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </SheetClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
