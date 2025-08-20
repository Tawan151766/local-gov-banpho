import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
  const types = await prisma.local_dev_plan_types.findMany({ orderBy: { id: 'asc' } });
    // BigInt to string
    const serializeBigInt = (obj) => JSON.parse(JSON.stringify(obj, (key, value) => typeof value === 'bigint' ? value.toString() : value));
    return Response.json({ success: true, data: serializeBigInt(types) });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
