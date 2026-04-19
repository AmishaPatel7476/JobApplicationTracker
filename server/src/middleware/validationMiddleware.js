// EMAIL REGEX
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ================= REGISTER =================
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  next();
};

// ================= APPLICATION =================
const validateApplication = (req, res, next) => {
  const { roleTitle, applicationDate, company, salaryExpectation } = req.body;

  if (!roleTitle || !applicationDate || !company) {
    res.status(400);
    throw new Error("Role title, application date and company are required");
  }

  if (salaryExpectation && Number(salaryExpectation) < 0) {
    res.status(400);
    throw new Error("Salary cannot be negative");
  }

  next();
};

module.exports = {
  validateRegister,
  validateApplication
};