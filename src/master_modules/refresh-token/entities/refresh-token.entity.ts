// refresh-token.entity.ts
import { User } from 'src/master_modules/user/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Many tokens belong to one user
    @ManyToOne(() => User, user => user.refreshTokens, {
        onDelete: 'CASCADE', // Optional: delete tokens if user is deleted
    })
    user: User;
}
