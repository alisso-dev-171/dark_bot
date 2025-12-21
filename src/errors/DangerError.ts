export class DangerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DangerError";
    }
}
