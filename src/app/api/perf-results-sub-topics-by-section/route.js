import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get('sectionId');
  if (!sectionId) {
    return Response.json({ success: false, error: 'Missing sectionId' }, { status: 400 });
  }
  try {
    const subTopics = await prisma.perfResultsSubTopic.findMany({
      where: { section_id: BigInt(sectionId) },
      orderBy: { id: 'asc' },
      include: {
        files: true,
      },
    });
    // แปลง BigInt เป็น string
    const serializeBigInt = (obj) => JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));
    return Response.json({ success: true, data: serializeBigInt(subTopics) });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
