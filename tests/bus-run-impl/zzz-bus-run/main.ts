import { BusBunServer } from '../../../src/app/server/bus-server';
import { UserJwtPayload } from '../types';
import { serverStarter } from './starter';

const server = serverStarter.start('all') as BusBunServer<UserJwtPayload>;
server.run();
