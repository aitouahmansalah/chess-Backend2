import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { ParsedUrlQuery } from 'querystring'
import { DatabaseService } from 'src/database/database.service'
import { UpdateUserDto } from './dto'
import { JwtService } from '@nestjs/jwt'

export const profileSelect = {
  id: true,
  username: true,
  image: true,
  bio: true,
}

@Injectable()
export class UserService {
  
  constructor(private db: DatabaseService,private jwt: JwtService) {}

  async getUserById(id:string){
    const user = await this.db.user.findUnique({
      where:{
        id
    }});

    if(!user){
      throw new NotFoundException('The user you are looking for does not exist')
    }

    delete user.hash;
    return user;

  }

  async getUserByToken(token:string){
    const jwt = this.jwt.decode(token) as { sub: string, email : string };
    const id = jwt.sub;
    
    const user = await this.db.user.findUnique({
      where:{
        id
    }});
    
    if(!user){
      throw new NotFoundException('The user you are looking for does not exist')
    }

    delete user.hash;
    return user;

  }

  async getUserAndStuff(username: string, { get }: ParsedUrlQuery) {
    const user = await this.db.user.findUnique({
      where: { username },
      include: {
        followers: { select: profileSelect },
        following: { select: profileSelect },
        posts: true,
        likes: true,
      },
    })

    if (!user) {
      throw new NotFoundException('The user you are looking for does not exist')
    }

    if (get === 'posts' || get === 'likes') return user[get].map(post => post)
    if (get === 'followers' || get === 'following') {
      return user[get].map(({ id, username, image, bio }: User) => {
        return { id, username, image, bio }
      })
    }

    delete user.hash
    return user
  }

  async getMultipleUsers({ search }: ParsedUrlQuery) {
    const users = await this.db.user.findMany({
      where: search ? { username: { contains: search as string } } : {},
      select: profileSelect,
    })

    if (search && users.length === 0) {
      throw new NotFoundException(
        `Cannot find any users whose username contains '${search}'`,
      )
    }

    return users
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.db.user.update({
        where: { id: userId },
        data: { ...dto },
      })

      delete user.hash
      return user
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async deleteUser(userId: string) {
    try {
      const [, { username }] = await this.db.$transaction([
       
        this.db.post.deleteMany({ where: { authorId: userId } }),
        this.db.user.delete({ where: { id: userId } }),
      ])

      return {
        statusCode: 200,
        message: `User with username ${username} successfully deleted`,
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async followOrUnfollowUser(userId: string, targetUsername: string) {
    try {
      const [target, user] = await this.db.$transaction([
        this.db.user.findUnique({ where: { username: targetUsername } }),
        this.db.user.findUnique({
          where: { id: userId },
          include: {
            following: { select: profileSelect },
          },
        }),
      ])

      if (!target) {
        throw new NotFoundException(
          'The user you are trying to follow does not exist',
        )
      }

    
      if (user.following.some(f => f.username === targetUsername)) {
        await this.db.user.update({
          where: { id: userId },
          data: {
            following: {
              disconnect: { id: target.id },
            },
          },
        })

        return {
          statusCode: 200,
          message: `${user.username} unfollowed ${targetUsername}`,
        }
      }

      // otherwise, follow the user
      await this.db.user.update({
        where: { id: userId },
        data: {
          following: {
            connect: { id: target.id },
          },
        },
      })

      return {
        status: 200,
        message: `${user.username} followed ${target.username}`,
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong')
    }
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    try {
      
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await this.db.user.update({
        where: { id: userId },
        data: {
          image: file.path, 
        },
      });
      delete updatedUser.hash
      return updatedUser;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(error);
      
    }
  }
}
