const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

const validateApplication = (req, res, next) => {
  const { roleTitle, applicationDate, company, salaryExpectation } = req.body;

  if (req.method === "POST") {
    if (!roleTitle || !applicationDate || !company) {
      res.status(400);
      throw new Error("Role title, application date and company are required");
    }
  }

  if (salaryExpectation !== undefined && Number(salaryExpectation) < 0) {
    res.status(400);
    throw new Error("Salary cannot be negative");
  }

  next();
};

const isValidWebsite = (website) =>
  /^https?:\/\/.+/i.test(website);

const validateCompany = (req, res, next) => {
  const { name, industry, location, website } = req.body;

  if (req.method === "POST") {
    if (!name || !industry || !location) {
      res.status(400);
      throw new Error("Name, industry and location are required");
    }
  }

  if (website && !isValidWebsite(website)) {
    res.status(400);
    throw new Error("Invalid website format");
  }

  next();
};

const validateInterview = (req, res, next) => {
  const { application, interviewDate, mode } = req.body;

  if (req.method === "POST") {
    if (!application || !interviewDate || !mode) {
      res.status(400);
      throw new Error("Application, interview date and mode are required");
    }
  }

  next();
};


module.exports = {
  validateRegister,
  validateApplication,
  validateCompany,
  validateInterview
};