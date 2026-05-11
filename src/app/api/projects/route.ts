import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PROJECT_SORT } from '@/lib/constants';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort(PROJECT_SORT);
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const data = await req.json();
    const project = await Project.create(data);
    
    // Force Next.js to update the static pages
    revalidatePath('/');
    revalidatePath('/projects');
    
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
