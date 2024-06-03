export class Result {
    traceId: string;
    payload: {
        data: any | any[];
        total?: number;
    };
    message?: string;
    status?: number;
}
