import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class Tenant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    key: string; // e.g., "acme-corp" (used for tenant resolution from request headers)

    @Index()
    @Column({ type: 'varchar', default: 'Active' })
    status: 'Active' | 'Inactive';

    @Index()
    @Column({ default: false })
    isDeleted: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
