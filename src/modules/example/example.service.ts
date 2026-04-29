export type HealthStatus = {
    status: 'ok';
    timestamp: string;
    service: 'example';
};

export class ExampleService {
    public async getHealth(): Promise<HealthStatus> {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'example',
        };
    }
}
