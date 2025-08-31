const users = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "user",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    name: "Admin User",
    email: "admin@tabison.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
    role: "user",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
]

module.exports = users
