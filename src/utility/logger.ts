import pino from 'pino';
import { Environment } from '@utility/environment';
import { inject, autoInjectable } from 'tsyringe';

@autoInjectable()
export class Logger {
    private readonly _logger: pino.Logger;

    public constructor(
        @inject(Environment) private readonly _environment: Environment,
        private readonly context: { key: string; value: any }[] = []
    ) {
        let logger = !this._environment.isProduction
            ? pino({
                  transport: {
                      target: 'pino-pretty',
                  },
              })
            : pino();

        // Apply any context provided
        for (const item of context) {
            logger = logger.child({ [item.key]: item.value });
        }

        this._logger = logger;
    }

    public withClassName(className: string): Logger {
        return new Logger(this._environment, [...this.context, { key: 'className', value: className }]);
    }

    public withMethodName(methodName: string): Logger {
        return new Logger(this._environment, [...this.context, { key: 'methodName', value: methodName }]);
    }

    public withContext(key: string, value: any): Logger {
        return new Logger(this._environment, [...this.context, { key, value }]);
    }

    public trace(template: string, properties: Record<string, any> = {}): void {
        this.log('trace', template, properties);
    }

    public debug(template: string, properties: Record<string, any> = {}): void {
        this.log('debug', template, properties);
    }

    public info(template: string, properties: Record<string, any> = {}): void {
        this.log('info', template, properties);
    }

    public warn(template: string, properties: Record<string, any> = {}): void {
        this.log('warn', template, properties);
    }

    public error(template: string, properties: Record<string, any> = {}): void {
        this.log('error', template, properties);
    }

    private log(level: pino.Level, template: string, properties: Record<string, any> = {}) {
        const { message, unusedProperties } = this.parseTemplate(template, properties);

        this._logger[level]({
            msg: message,
            template,
            ...unusedProperties,
        });
    }

    private parseTemplate(
        template: string,
        properties: Record<string, any>
    ): {
        message: string;
        unusedProperties: Record<string, any>;
    } {
        let message = template;
        const unusedProperties = { ...properties };

        const propertyMatches = template.match(/\{([^}]+)\}/g) || [];

        for (const match of propertyMatches) {
            const propertyName = match.slice(1, -1);
            if (propertyName in properties) {
                message = message.replace(match, String(properties[propertyName]));
                delete unusedProperties[propertyName];
            }
        }

        return { message, unusedProperties };
    }
}
