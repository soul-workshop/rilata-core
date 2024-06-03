import { BusBunServer } from '../../../src/api/server/bus-server';
import { serverStarter } from './starter';

const server = serverStarter.start('all') as BusBunServer;
server.run();
