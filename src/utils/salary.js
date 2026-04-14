function calculateSalary(salary, country) {
  let deduction = 0;

  if (country === "India") deduction = 0.1;
  else if (country === "United States") deduction = 0.12;

  return salary - salary * deduction;
}

module.exports = { calculateSalary };