export class AppError extends Error {
    public readonly success: boolean = false;
    public readonly statusCode: number;
    public readonly data: [] = [];

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = this.constructor.name;
        this.statusCode = statusCode;

        // Fix prototype chain (quan trọng khi extend Error trong TS)
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default AppError;
