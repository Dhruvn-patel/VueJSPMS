declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    private static extractJWT;
    validate(payload: {
        id: Number;
        name: string;
        email: string;
    }): Promise<{
        id: Number;
        name: string;
        email: string;
    }>;
}
export {};
