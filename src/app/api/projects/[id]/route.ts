import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { deleteS3Object } from '@/lib/s3';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const data = await req.json();
    
    // Get original project to check for image change
    const oldProject = await Project.findById(id);
    if (!oldProject) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    console.log('Project update attempt:', id);
    console.log('Old image:', oldProject.image);
    console.log('New image:', data.image);

    // If image URL changed and old image exists, delete the old one
    if (data.image && oldProject.image && data.image !== oldProject.image) {
      console.log('Detected image change, deleting old image from R2...');
      await deleteS3Object(oldProject.image);
    }

    const project = await Project.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    
    // Force Next.js to update the static pages
    revalidatePath('/');
    revalidatePath('/projects');
    if (project?.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }
    
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete the image from R2
    if (project.image) {
      await deleteS3Object(project.image);
    }

    await Project.findByIdAndDelete(id);
    
    // Force Next.js to update the static pages
    revalidatePath('/');
    revalidatePath('/projects');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
