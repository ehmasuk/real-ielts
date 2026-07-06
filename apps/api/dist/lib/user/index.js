const userServices = {
    findOne: async ({ filter }) => {
        if (filter._id) {
            return { id: filter._id, email: "mock@example.com" };
        }
        return null;
    },
};
export default userServices;
//# sourceMappingURL=index.js.map