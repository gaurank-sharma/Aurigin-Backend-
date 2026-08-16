export const DEPARTMENT_COLOR = {
  leadership: "#013fd2",
  engineering: "#0e7490",
  design: "#be185d",
  marketing: "#15803d",
  sales: "#b91c1c",
  hr: "#be3a0a",
};

export const LEAVE_TYPE_QUOTAS = {
  casual: 12,
  sick: 8,
  earned: 15,
};

export function emptyLeaveBalances() {
  return {
    casual: { quota: LEAVE_TYPE_QUOTAS.casual, used: 0 },
    sick: { quota: LEAVE_TYPE_QUOTAS.sick, used: 0 },
    earned: { quota: LEAVE_TYPE_QUOTAS.earned, used: 0 },
  };
}

export const WFH_WEEKLY_QUOTA = 2;

export const WELCOME_MEET_TEAM_TITLE = "Meet the team";
export const WELCOME_POLICIES_TITLE = "Read & acknowledge company policies";

export const ONBOARDING_TASK_TEMPLATE = [
  { category: "Welcome", title: WELCOME_MEET_TEAM_TITLE, owner: "self" },
  { category: "Welcome", title: WELCOME_POLICIES_TITLE, owner: "self" },
  { category: "Documentation", title: "Sign offer letter & employment contract", owner: "hr" },
  { category: "Documentation", title: "Submit ID proof & address verification", owner: "hr" },
  { category: "Documentation", title: "Submit PAN & bank details for payroll", owner: "hr" },
  { category: "IT Setup", title: "Laptop & equipment issued", owner: "it" },
  { category: "IT Setup", title: "Company email & Slack account created", owner: "it" },
  { category: "IT Setup", title: "Access granted to internal tools", owner: "it" },
  { category: "Training", title: "Role-specific tools & process training", owner: "manager" },
  { category: "Training", title: "1:1 kickoff with reporting manager", owner: "manager" },
  { category: "Culture", title: "Buddy assigned & intro meeting", owner: "hr" },
  { category: "Culture", title: "Welcome kit delivered", owner: "hr" },
];

export function buildOnboardingTasks(newHireId) {
  return ONBOARDING_TASK_TEMPLATE.map((task) => ({ ...task, newHireId, status: "Pending" }));
}
