const userServices = {
  findOne: async ({ filter }: { filter: { _id?: string; email?: string } }) => {
    if (filter._id) {
      return { id: filter._id, email: "mock@example.com" };
    }
    return null;
  },
};

export default userServices;
