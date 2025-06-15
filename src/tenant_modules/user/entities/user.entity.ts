import { Entity, Column, PrimaryGeneratedColumn, Index, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { compareSync, hashSync, genSaltSync, genSalt } from 'bcrypt';
import { RefreshToken } from 'src/tenant_modules/refresh-token/entities/refresh-token.entity';
import { Role } from 'src/tenant_modules/role/entities/role.entity';

@Entity({ name: "users" })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Index()
    @Column({ type: 'varchar', default: 'Active' })
    status: 'Active' | 'Inactive';

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // One user has many refresh tokens
    @OneToMany(() => RefreshToken, token => token.user, {
        cascade: true,
    })
    refreshTokens: RefreshToken[];

    // Many Users belong to one Role
    @ManyToOne(() => Role, role => role.users, { nullable: true })
    role: Role;

    // 🔒 Automatically hash password before insert/update
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            const salt = await genSalt(10);
            this.password = hashSync(this.password, salt);
        }
    }
}
