import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtPayload } from './types/jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  //passport-jwtからインポートしたStrategyを利用
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: jwtPayload) {
    return {
      id: payload.sub,
      name: payload.username,
      status: payload.status,
    };
  }
}
