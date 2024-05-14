import { BusBunServer } from '../../../src/app/server/bus-server';
import { serverStarter } from './starter';

const server = serverStarter.start('all') as BusBunServer;
server.run();
