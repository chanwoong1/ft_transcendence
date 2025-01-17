import {
  Controller,
  Post,
  Body,
  Delete,
  Response,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserStatusType, ValidNicknameType } from 'src/util';
import { AuthService } from 'src/auth/auth.service';
import JwtTwoFactorGuard from 'src/auth/jwt/jwt-two-factor.gaurd';
import { ChattingGateway } from 'src/chatting/chatting.gateway';
import { User } from './entities/user.entity';
import { createDummyUsers } from './createDummyUsers';
import { AvatarPathUpdateDto } from './dto/avatar-path-update.dto';
import { LoginDto } from './dto/login.dto';
import { CreateDummyDto } from './dto/create-dummy.dto';
import { AvatarDefaultDto } from './dto/avatar-default.dto';
import { NicknameDto } from './dto/nickname.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    private rootGateway: ChattingGateway,
  ) {}

  @Get('/user')
  @UseGuards(JwtTwoFactorGuard)
  async getUser(@Request() req): Promise<User> {
    const user = await this.usersService.getUserById(req.user.id);
    return user;
  }

  @Post('/login')
  async login(@Response() res, @Body() loginDto: LoginDto) {
    const { code, type, state } = loginDto;
    let authId;
    let OwnerId;

    if (type === '42') {
      authId = await this.authService.getResourceOwner42Id(code);
      OwnerId = '42-' + authId;
    } else if (type === 'google') {
      authId = await this.authService.getResourceOwnerGoogleId(code);
      OwnerId = 'G-' + authId;
    } else if (type === 'naver') {
      authId = await this.authService.getResourceOwnerNaverId(code, state);
      OwnerId = 'N-' + authId;
    } else {
      throw new HttpException(
        '유효하지 않은 로그인 유형입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (authId === '-1') {
      throw new HttpException(
        "Can't get resourceOwner ID",
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if ((await this.usersService.checkUser(OwnerId)) == false) {
        await this.usersService.createUser(OwnerId);
      }
      const user = await this.usersService.getUserById(OwnerId);
      const payload = { id: OwnerId, sub: OwnerId };
      if (
        user.status === UserStatusType.OFFLINE ||
        user.status === UserStatusType.SIGNUP
      ) {
        const jwt = await this.authService.sign(payload);
        res.setHeader('Authorization', 'Bearer ' + jwt);
        res.cookie('jwt', jwt, {
          maxAge: 3600000,
        });
        this.rootGateway.refreshUsersList();
        console.log('로그인 성공');
        return res.send(user);
      } else {
        throw new HttpException('User is already online', HttpStatus.CONFLICT);
      }
    }
  }

  @Post('/nickname')
  @UseGuards(JwtTwoFactorGuard)
  async createNickname(@Request() req, @Body() nicknameDto: NicknameDto) {
    const { nickname } = nicknameDto;
    const user = await this.usersService.updateNickname(nickname, req.user.id);
    await this.usersService.updateStatus(user, UserStatusType.ONLINE);
    this.rootGateway.refreshUsersList();
    return user;
  }

  @Post('/avatarPathUpdate')
  @UseGuards(JwtTwoFactorGuard)
  async updateAvatarPath(
    @Request() req,
    @Body() avatarPathUpdateDto: AvatarPathUpdateDto,
  ) {
    const { avatarPath } = avatarPathUpdateDto;
    const user = await this.usersService.updateAvatarPath(
      req.user.id,
      avatarPath,
    );
    this.rootGateway.refreshUsersList();
    return user;
  }

  @Post('/avatar/default')
  @UseGuards(JwtTwoFactorGuard)
  async updateAvatarDefault(
    @Request() req,
    @Body() avatarDefaultDto: AvatarDefaultDto,
  ) {
    const { avatarPath } = avatarDefaultDto;
    const user = await this.usersService.updateAvatarPath(
      req.user.id,
      avatarPath,
    );
    this.rootGateway.refreshUsersList();
    return user;
  }

  @Post('/logout')
  @UseGuards(JwtTwoFactorGuard)
  async logout(@Request() req): Promise<void> {
    const user = await this.usersService.getUserById(req.user.id);
    await this.usersService.updateStatus(user, UserStatusType.OFFLINE);
    this.rootGateway.refreshUsersList();
  }

  @Delete()
  @UseGuards(JwtTwoFactorGuard)
  async resign(@Request() req): Promise<void> {
    this.usersService.deleteAvatar(req.user.id);
    const response = await this.usersService.deleteUserById(req.user.id);
    this.rootGateway.refreshUsersList();
    return response;
  }

  @Get('/login/userlist')
  @UseGuards(JwtTwoFactorGuard)
  async getLoginUserList(@Request() req): Promise<any> {
    return await this.usersService.getLoginUserList(req.user.id);
  }

  @Get('')
  @UseGuards(JwtTwoFactorGuard)
  async getAllUserList(): Promise<User[]> {
    return await this.usersService.getAllUserList();
  }

  @Get('/checkNickname')
  async checkNickname(
    @Query() checkNicknameDto: CheckNicknameDto,
  ): Promise<ValidNicknameType> {
    return await this.usersService.checkValidNickname(
      checkNicknameDto.nickname,
    );
  }

  // 더미 유저 생성
  @Post('/createDummy')
  async createDummyUser(@Body() createDummyDto: CreateDummyDto) {
    const { count } = createDummyDto;
    const dummyUsers = createDummyUsers(count);

    for (const user of dummyUsers) {
      const {
        id,
        nickname,
        win,
        lose,
        ladder_win,
        ladder_lose,
        admin,
        avatarPath,
        status,
        twoFactorAuthenticationSecret,
        isTwoFactorAuthenticationEnabled,
        rating,
      } = user;

      const userEntity = new User();
      userEntity.id = id;
      userEntity.nickname = nickname;
      userEntity.win = win;
      userEntity.lose = lose;
      userEntity.ladder_win = ladder_win;
      userEntity.ladder_lose = ladder_lose;
      userEntity.admin = admin;
      userEntity.avatarPath = avatarPath;
      userEntity.status = status as UserStatusType;
      userEntity.twoFactorAuthenticationSecret = twoFactorAuthenticationSecret;
      userEntity.isTwoFactorAuthenticationEnabled =
        isTwoFactorAuthenticationEnabled;
      userEntity.rating = rating;

      await this.usersService.createDummyUser(userEntity);
    }

    return { message: 'Dummy users created successfully!' };
  }
}
