// backend/api/uploadWaiver.ts
import { supabase } from '../lib/supabase';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const registrationId = formData.get('registrationId') as string;

    if (!file || !registrationId) {
      return new Response(JSON.stringify({ error: 'Missing file or registrationId' }), { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `waivers/${registrationId}-${randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage.from('waivers').upload(filePath, file.stream(), {
      contentType: file.type,
      upsert: true,
    });

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
    }

    // ✅ Get public URL
    const { data } = supabase.storage.from('waivers').getPublicUrl(filePath);

    // ✅ Update registration with the URL
    await prisma.registration.update({
      where: { id: registrationId },
      data: { waiverUrl: data.publicUrl },
    });

    return new Response(JSON.stringify({ message: 'Waiver uploaded and linked!', url: data.publicUrl }), {
      status: 200,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
