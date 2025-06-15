import { User } from 'src/master_modules/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
    OneToMany,
} from 'typeorm';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: string;

    @Index()
    @Column({ type: 'varchar', nullable: false })
    role: string;

    @Column({ type: 'varchar', nullable: false })
    roleDisplayName: string;

    @Column({ type: 'varchar', default: 'frontend' })
    roleGroup: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Index()
    @Column({ type: 'varchar', default: 'Active' })
    status: 'Active' | 'Inactive';

    @Index()
    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    // One Role has many Users
    @OneToMany(() => User, user => user.role)
    users: User[];
}
