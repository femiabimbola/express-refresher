const {createUser} = require("../src/controllers/users");

describe("random errors gotten from code", () => {
  it("should handle validation errors", async () => {
    // Mock request and response objects with validation error
    const req = {
      body: {
        // Provide invalid data to trigger validation error
        // For example:
        username: "invaliduser",
        email: "invalidemail",
        password: "short",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Call the function
    await createUser(req, res);

    // Check if the appropriate status and response were sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      expect.arrayContaining([
        // Check if the validation error array contains expected error messages
        // For example:
        {msg: "Invalid email address"},
        {msg: "Password must be at least 6 characters long"},
      ])
    );
  });

  it("should handle other errors", async () => {
    // Mock request and response objects to simulate other error
    const req = {
      body: {
        // Provide valid data
        // For example:
        username: "testuser",
        email: "test@example.com",
        password: "testpassword",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    // Simulate an error during user creation
    const error = new Error("Some error occurred");
    createUser.mockImplementationOnce(() => {
      throw error;
    });

    // Call the function
    await createUser(req, res);

    // Check if the appropriate status and response were sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(error);
  });
});
