export interface Project {
  slug: 'airflow-observer' | 'llm-eval-lab' | 'boundedscan';
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  impact: string;
  stack: string[];
  href: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  achievements: string[];
}

export interface Education {
  period: string;
  qualification: string;
  institution: string;
  detail?: string;
}

export interface SkillGroup {
  title: string;
  index: string;
  skills: string[];
}

export const projects: Project[] = [
  {
    slug: 'airflow-observer',
    number: '01',
    title: 'Airflow Observer',
    eyebrow: 'Data platform observability',
    description:
      'A self-hosted control plane that turns Airflow metadata into incidents, operational recommendations and a daily view of the DAGs that need attention.',
    impact:
      'Built around the real operational question data teams face every morning: what failed, what is drifting, and where should we act first?',
    stack: ['Python', 'FastAPI', 'Airflow', 'PostgreSQL', 'Next.js', 'Docker'],
    href: 'https://github.com/jjnv/airflow-observer'
  },
  {
    slug: 'llm-eval-lab',
    number: '02',
    title: 'LLM Eval Lab',
    eyebrow: 'Reproducible AI evaluation',
    description:
      'A local-first workbench for comparing prompts, models and lightweight RAG setups across quality, grounding, latency, cost and regressions.',
    impact:
      'Makes model decisions inspectable through deterministic test packs, per-case traces and strict regression gates.',
    stack: ['Python', 'RAG', 'Streamlit', 'SQLite', 'Ollama', 'CI'],
    href: 'https://github.com/jjnv/LLM-Eval-Lab'
  },
  {
    slug: 'boundedscan',
    number: '03',
    title: 'BoundedScan',
    eyebrow: 'Defensive security engineering',
    description:
      'A self-hosted attack-surface management platform for authorized, bounded and evidence-led security workflows.',
    impact:
      'Combines scope enforcement, distributed execution, deduplicated findings and reproducible reporting in one operational system.',
    stack: ['FastAPI', 'React', 'Celery', 'RabbitMQ', 'Redis', 'PostgreSQL'],
    href: 'https://github.com/jjnv/BoundedScan'
  }
];

export const experience: Experience[] = [
  {
    period: 'Sep 2024 — Present',
    role: 'Data Engineer',
    company: 'Vueling · via HolaCons',
    location: 'Barcelona, Spain',
    summary:
      'Building and operating high-volume data workloads that connect operational systems with analytics-ready models on AWS.',
    achievements: [
      'Design ETL/ELT pipelines in Python, SQL and Airflow, integrating REST APIs, Elasticsearch and S3 into Amazon Redshift.',
      'Re-engineered Elasticsearch extraction into incremental loading, reducing processing time and data volume by 20%.',
      'Improved observability with Grafana, Datadog and Elasticsearch, cutting incident detection and resolution time by 30%.',
      'Deploy workloads through Jenkins and Azure DevOps, and build tested internal tooling for pipeline operations.',
      'Onboard new engineers and authored the team’s Python and SQL training materials.'
    ]
  }
];

export const education: Education[] = [
  {
    period: '2025 — Present',
    qualification: 'M.Sc. in Data Engineering & Data Science',
    institution: 'UNED',
    detail: 'Deep learning, Bayesian modelling and production ML.'
  },
  {
    period: '2020 — 2024',
    qualification: 'B.Sc. in Mathematics',
    institution: 'Universidad de Granada',
    detail: 'Erasmus at VUB / ULB, Brussels · 2022–2023.'
  }
];

export const skillGroups: SkillGroup[] = [
  {
    title: 'Data engineering',
    index: '01',
    skills: ['Python', 'SQL', 'Airflow', 'AWS', 'Databricks', 'Elasticsearch', 'Docker']
  },
  {
    title: 'ML & analytics',
    index: '02',
    skills: ['TensorFlow', 'Keras', 'scikit-learn', 'PyMC', 'pandas', 'R']
  },
  {
    title: 'Delivery & reliability',
    index: '03',
    skills: ['Git', 'Jenkins', 'Azure DevOps', 'Grafana', 'Datadog', 'CI/CD']
  },
  {
    title: 'Visualisation',
    index: '04',
    skills: ['Power BI', 'Altair', 'Matplotlib']
  }
];

export const profile = {
  name: 'Juan José Navarro Villegas',
  shortName: 'Juanjo Navarro',
  role: 'Data Engineer',
  location: 'Barcelona, Spain',
  email: 'juanjose121@live.com',
  github: 'https://github.com/jjnv',
  linkedin: 'https://www.linkedin.com/in/juan-jos%C3%A9-n-884519234/'
} as const;

