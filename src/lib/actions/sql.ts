
"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function runSQL(query: string) {
  const supabase = await createClient();

  try {
    // Jalankan SQL query via RPC "exec_sql"
    // Pastikan Anda sudah membuat fungsi `exec_sql` di Supabase SQL Editor.
    const { data, error } = await supabase.rpc("exec_sql", { query });

    if (error) {
      console.error("SQL Error:", error);
      return { error: `Gagal menjalankan query: ${error.message}`, data: null };
    }
    
    // Cek apakah fungsi postgres mengembalikan error aplikasi
    if (data && data.error) {
        return { error: `Kesalahan pada database: ${data.error}`, data: null };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("RPC Error:", err);
    return { error: `Terjadi kesalahan saat memanggil fungsi database: ${err.message}`, data: null };
  }
}
