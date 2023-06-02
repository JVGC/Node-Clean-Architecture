import { PrismaClient, UserRoles } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function main() {
    const company = await prisma.company.create({
        data:{
            name: "Tractian",
            code: "1"
        }
    })
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12)
    await prisma.user.create({
        data: {
            email: process.env.ADMIN_EMAIL!,
            name: 'SuperAdmin',
            password: hashedPassword,
            companyId: company.id,
            Role: UserRoles.SuperAdmin,
        },

  })

}

main()

  .then(async () => {
    await prisma.$disconnect()

  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)

  })