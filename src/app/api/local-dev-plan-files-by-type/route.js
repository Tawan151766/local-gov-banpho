import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('typeId');
  if (!typeId) {
    return Response.json({ success: false, error: 'Missing typeId' }, { status: 400 });
  }
  try {
    const files = await prisma.local_dev_plan_files.findMany({
      where: { type_id: BigInt(typeId) },
      orderBy: { id: 'asc' },
    });
    // BigInt to string
    const serializeBigInt = (obj) => JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    return Response.json({ success: true, data: serializeBigInt(files) });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
