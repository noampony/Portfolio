/**
 * Technical Skills content (spec §8.6, §11.5).
 *
 * Rules:
 * - No `proficiency` field is set anywhere — proficiency display is TBD (§8.6).
 * - No icons yet — icon source is TBD (§6.8, §8.6); added in Task 9.2.
 */

import type { Skill } from "../types";
import { validateSkillList } from "../validate";

const skillData: unknown[] = [
  // ── Programming ──────────────────────────────────────────────────────────
  { name: "Python", category: "Programming", displayOrder: 1 },
  { name: "SQL",    category: "Programming", displayOrder: 2 },
  { name: "Bash",   category: "Programming", displayOrder: 3 },
  { name: "Flask",  category: "Programming", displayOrder: 4 },
  { name: "Pytest", category: "Programming", displayOrder: 5 },
  { name: "Lint",   category: "Programming", displayOrder: 6 },

  // ── Tools & Infrastructures ──────────────────────────────────────────────
  { name: "Docker",               category: "Tools & Infrastructures", displayOrder: 1 },
  { name: "Linux",                category: "Tools & Infrastructures", displayOrder: 2 },
  { name: "Jenkins",              category: "Tools & Infrastructures", displayOrder: 3 },
  { name: "GitHub",               category: "Tools & Infrastructures", displayOrder: 4 },
  { name: "Prometheus",           category: "Tools & Infrastructures", displayOrder: 5 },
  { name: "Nagios",               category: "Tools & Infrastructures", displayOrder: 6 },
  { name: "Grafana",              category: "Tools & Infrastructures", displayOrder: 7 },
  { name: "Vulnerability Scanning", category: "Tools & Infrastructures", displayOrder: 8 },
  { name: "Vercel",               category: "Tools & Infrastructures", displayOrder: 9 },
  { name: "AWS LocalStack",       category: "Tools & Infrastructures", displayOrder: 10 },

  // ── Databases ────────────────────────────────────────────────────────────
  { name: "DynamoDB",        category: "Databases", displayOrder: 1 },
  { name: "PostgreSQL",      category: "Databases", displayOrder: 2 },
  { name: "Redis",           category: "Databases", displayOrder: 3 },
  { name: "VectorDB (Vespa.ai)", category: "Databases", displayOrder: 4 },
  { name: "Elastic Search",  category: "Databases", displayOrder: 5 },
  { name: "Parquet DB",      category: "Databases", displayOrder: 6 },

  // ── Concepts & Methodologies ─────────────────────────────────────────────
  { name: "Computer Networking",    category: "Concepts & Methodologies", displayOrder: 1 },
  { name: "OSI Network Architecture", category: "Concepts & Methodologies", displayOrder: 2 },
  { name: "REST API Design",        category: "Concepts & Methodologies", displayOrder: 3 },
  { name: "Multi-Threading",        category: "Concepts & Methodologies", displayOrder: 4 },
  { name: "Microservices",          category: "Concepts & Methodologies", displayOrder: 5 },

  // ── Cloud ────────────────────────────────────────────────────────────────
  { name: "AWS ECS",             category: "Cloud", displayOrder: 1 },
  { name: "AWS EC2",             category: "Cloud", displayOrder: 2 },
  { name: "AWS SQS",             category: "Cloud", displayOrder: 3 },
  { name: "AWS DynamoDB",        category: "Cloud", displayOrder: 4 },
  { name: "AWS ElasticCache",    category: "Cloud", displayOrder: 5 },
  { name: "AWS OpenSearch",      category: "Cloud", displayOrder: 6 },
  { name: "AWS S3",              category: "Cloud", displayOrder: 7 },
  { name: "AWS CloudFormation",  category: "Cloud", displayOrder: 8 },
  { name: "AWS Firehose",        category: "Cloud", displayOrder: 9 },
  { name: "AWS RDS",             category: "Cloud", displayOrder: 10 },
  { name: "AWS Secrets Manager", category: "Cloud", displayOrder: 11 },
  { name: "AWS API Gateway",     category: "Cloud", displayOrder: 12 },
  { name: "AWS Lambda",          category: "Cloud", displayOrder: 13 },
  { name: "AWS Iceberg",         category: "Cloud", displayOrder: 14 },
  { name: "AWS Athena",          category: "Cloud", displayOrder: 15 },
  { name: "AWS KMS",             category: "Cloud", displayOrder: 16 },
  { name: "AWS EventBridge",     category: "Cloud", displayOrder: 17 },
  { name: "AWS ECR",             category: "Cloud", displayOrder: 18 },

  // ── AI Development ───────────────────────────────────────────────────────
  { name: "Claude Code",          category: "AI Development", displayOrder: 1 },
  { name: "Codex",                category: "AI Development", displayOrder: 2 },
  { name: "GitHub Copilot",       category: "AI Development", displayOrder: 3 },
  { name: "Cursor",               category: "AI Development", displayOrder: 4 },
  { name: "Tokens Optimizations", category: "AI Development", displayOrder: 5 },
  { name: "Prompt Engineering",   category: "AI Development", displayOrder: 6 },
  { name: "Agents Orchestration", category: "AI Development", displayOrder: 7 },
];

export const skills: Skill[] = validateSkillList(skillData);
