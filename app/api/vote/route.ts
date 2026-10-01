import { NextResponse } from 'next/server';
import { db } from '@/db';
import { votes } from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results = await db
      .select({
        name: votes.candidateName,
        votes: sql<number>`count(${votes.id})`.mapWith(Number),
      })
      .from(votes)
      .groupBy(votes.candidateName)
      .orderBy(desc(sql`count(${votes.id})`));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri učitavanju' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { candidateName, voterIdentifier } = await req.json();

    if (!candidateName || !voterIdentifier) {
      return NextResponse.json({ error: 'Nedostaju podaci' }, { status: 400 });
    }

    // Provera pre upisa da li je korisnik vec glasao
    const existingVote = await db
      .select()
      .from(votes)
      .where(eq(votes.voterIdentifier, voterIdentifier));

    if (existingVote.length > 0) {
      return NextResponse.json({ error: 'Već si glasao!' }, { status: 403 });
    }

    await db.insert(votes).values({
      candidateName,
      voterIdentifier,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Već si glasao!' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Došlo je do greške' }, { status: 500 });
  }
}