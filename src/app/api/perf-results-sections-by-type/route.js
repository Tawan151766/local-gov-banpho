import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('typeId');
  if (!typeId) {
    return Response.json({ success: false, error: 'Missing typeId' }, { status: 400 });
  }
  try {
    const sections = await prisma.perfResultsSection.findMany({
      where: { type_id: BigInt(typeId) },
      orderBy: { id: 'asc' },
    });
    // แปลง BigInt เป็น string
    const serializeBigInt = (obj) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return Response.json({ success: true, data: serializeBigInt(sections) });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
