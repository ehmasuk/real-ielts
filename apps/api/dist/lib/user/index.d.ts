declare const userServices: {
    findOne: ({ filter }: {
        filter: {
            _id?: string;
            email?: string;
        };
    }) => Promise<{
        id: string;
        email: string;
    } | null>;
};
export default userServices;
//# sourceMappingURL=index.d.ts.map