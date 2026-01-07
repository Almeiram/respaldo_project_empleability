import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../src/models/users/entities/user.entity';
import { Vacancy } from '../src/models/vacancies/entities/vacancy.entity';
import { Aplication } from '../src/models/aplications/entities/aplication.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'empleability',
  entities: [User, Vacancy, Aplication],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(User);
  const admin = await repo.findOneBy({ email: 'admin@local' });
  const gestor = await repo.findOneBy({ email: 'gestor@local' });
  const bcrypt = require('bcrypt');
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    const u = repo.create({ name: 'Admin', email: 'admin@local', password: hashed, role: 'admin' } as any);
    await repo.save(u);
    console.log('Admin seeded');
  }
  if (!gestor) {
    const hashed = await bcrypt.hash('gestor123', 10);
    const g = repo.create({ name: 'Gestor', email: 'gestor@local', password: hashed, role: 'gestor' } as any);
    await repo.save(g);
    console.log('Gestor seeded');
  }
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
