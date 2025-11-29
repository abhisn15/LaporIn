const prisma = require('../database/prisma');

async function clearLocationAndReports() {
  try {
    console.log('🧹 Mulai membersihkan data lokasi RT/RW dan laporan...\n');

    // 1. Hapus semua laporan dan data terkait
    console.log('1️⃣  Menghapus laporan dan data terkait...');
    
    // Hapus ReportStatusHistory
    const deletedStatusHistory = await prisma.reportStatusHistory.deleteMany({});
    console.log(`   ✅ ${deletedStatusHistory.count} status history dihapus`);

    // Hapus AiProcessingLog
    const deletedAiLogs = await prisma.aiProcessingLog.deleteMany({});
    console.log(`   ✅ ${deletedAiLogs.count} AI processing logs dihapus`);

    // Hapus Report
    const deletedReports = await prisma.report.deleteMany({});
    console.log(`   ✅ ${deletedReports.count} laporan dihapus`);

    // 2. Reset lokasi RT/RW untuk semua user
    console.log('\n2️⃣  Reset lokasi RT/RW untuk semua user...');
    
    // Reset lokasi untuk semua user yang memiliki rtRwLatitude, rtRwLongitude, atau rtRwRadius
    const updatedUsers = await prisma.user.updateMany({
      where: {
        OR: [
          { rtRwLatitude: { not: null } },
          { rtRwLongitude: { not: null } },
          { rtRwRadius: { not: null } }
        ]
      },
      data: {
        rtRwLatitude: null,
        rtRwLongitude: null,
        rtRwRadius: null
      }
    });
    console.log(`   ✅ ${updatedUsers.count} user lokasi di-reset`);

    console.log('\n✨ Pembersihan data lokasi dan laporan selesai!');
    console.log('\n📝 Catatan:');
    console.log('   - Semua laporan telah dihapus');
    console.log('   - Semua lokasi RT/RW telah di-reset');
    console.log('   - User, warga, dan data lainnya tetap utuh');
    console.log('   - Jalankan seeder untuk membuat data baru\n');

  } catch (error) {
    console.error('❌ Error saat membersihkan data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan script
clearLocationAndReports()
  .then(() => {
    console.log('✅ Script selesai');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script gagal:', error);
    process.exit(1);
  });

