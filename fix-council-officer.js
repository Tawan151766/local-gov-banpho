const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixCouncilOfficer() {
  try {
    console.log("Checking existing councilOfficer data...");

    // Use raw SQL to check if councilOfficer data exists
    const result = await prisma.$queryRaw`
      SELECT * FROM people_management 
      WHERE department = 'councilOfficer'
    `;

    console.log("Found councilOfficer records:", result.length);

    if (result.length > 0) {
      console.log("CouncilOfficer data exists:");
      result.forEach((record) => {
        console.log(`- ${record.full_name}: ${record.position}`);
      });
    } else {
      console.log("No councilOfficer data found. Adding...");

      // Add using raw SQL
      await prisma.$executeRaw`
        INSERT INTO people_management 
        (full_name, position, phone, department, role_type, level, sort_order, img, is_empty, is_active, created_at, updated_at)
        VALUES 
        ('นายวรยศ กิจพานิช', 'ปลัดเทศบาลตำบลบ้านโพธิ์', '099-261-2498', 'councilOfficer', 'head', 1, 1, '/image/placeholder-person.svg', false, true, NOW(), NOW()),
        ('นายภูธัชป์ โพธิ์สวัสดิ์', 'รองปลัดเทศบาล', NULL, 'councilOfficer', 'deputy', 2, 1, '/image/placeholder-person.svg', false, true, NOW(), NOW())
      `;

      console.log("CouncilOfficer data added successfully!");
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
fixCouncilOfficer()
  .then(() => {
    console.log("Operation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Failed:", error);
    process.exit(1);
  });
