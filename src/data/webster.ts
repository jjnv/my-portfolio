export type WebsterView =
  | 'home'
  | 'about'
  | 'projects'
  | 'project-airflow-observer'
  | 'project-llm-eval-lab'
  | 'project-boundedscan'
  | 'experience'
  | 'stack'
  | 'education'
  | 'contact';

export interface WebsterHint {
  message: string;
  action?: {
    label: string;
    view: WebsterView;
  };
}

export const websterGreeting =
  "webster.service online. I'll point out the useful bits — click me whenever you need a hint.";

export const websterTerminalHint =
  'The terminal is real: try `help`, `ls projects` or tab completion.';

export const websterHints: Record<WebsterView, WebsterHint> = {
  home: {
    message: 'Start with Selected Work, or type `help` in the terminal.',
    action: { label: 'Explore work', view: 'projects' }
  },
  about: {
    message: 'This is the human behind the system: role, focus and operating principles.'
  },
  projects: {
    message: 'Three open-source systems. Open any README for the problem, design and impact.'
  },
  'project-airflow-observer': {
    message: 'Follow the path from Airflow metadata to incidents and daily actions.'
  },
  'project-llm-eval-lab': {
    message: 'This lab makes prompt and model choices measurable and reproducible.'
  },
  'project-boundedscan': {
    message: 'Scope comes first here: bounded execution, evidence and reproducible reports.'
  },
  experience: {
    message: 'Read this like a service log: production work first, measurable impact underneath.'
  },
  stack: {
    message: 'The stack is grouped by job, so you can scan capabilities instead of buzzwords.'
  },
  education: {
    message: 'A compact timeline from mathematics into data engineering and data science.'
  },
  contact: {
    message: 'You reached the clean exit: email, GitHub and LinkedIn are all here.'
  }
};
