import * as dotenv from 'dotenv';
import process from 'process';
import { singleton } from 'tsyringe';

@singleton()
export class Environment {
    constructor() {
        dotenv.config();
    }

    get isProduction() {
        return process.env.NODE_ENV === 'production';
    }

    get applicationPort() {
        return process.env.PORT ? parseInt(process.env.PORT) : 8080;
    }
}
