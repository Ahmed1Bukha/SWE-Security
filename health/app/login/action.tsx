'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const dataInput = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data } = await supabase.auth.signInWithPassword(dataInput)

  if (error) {
    redirect('/error')
  }
  const res = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

    if(res.data?.role==="admin"){
        redirect('/admin/dashboard')      
    }


  

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}