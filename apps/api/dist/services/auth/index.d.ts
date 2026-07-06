declare const authServices: {
    sync: (payload: {
        sub: string;
        email?: string;
        name?: string;
        picture?: string;
    }) => Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: "student" | "admin";
        };
    }>;
    getMe: (userId: string) => Promise<{
        id: string;
        email: string;
        name: string;
        picture: string;
        role: "student" | "admin";
    }>;
};
export default authServices;
//# sourceMappingURL=index.d.ts.map