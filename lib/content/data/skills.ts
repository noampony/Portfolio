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
  { name: "Linting (Ruff)",   category: "Programming", displayOrder: 6 },

  // ── Tools & Infrastructure ───────────────────────────────────────────────
  { name: "Docker",               category: "Tools & Infrastructure", displayOrder: 1 },
  { name: "Linux",                category: "Tools & Infrastructure", displayOrder: 2 },
  { name: "Jenkins",              category: "Tools & Infrastructure", displayOrder: 3 },
  { name: "GitHub",               category: "Tools & Infrastructure", displayOrder: 4 },
  { name: "Prometheus",           category: "Tools & Infrastructure", displayOrder: 5 },
  { name: "Nagios",               category: "Tools & Infrastructure", displayOrder: 6 },
  { name: "Grafana",              category: "Tools & Infrastructure", displayOrder: 7 },
  { name: "Vulnerability Scanning", category: "Tools & Infrastructure", displayOrder: 8 },
  { name: "Vercel",               category: "Tools & Infrastructure", displayOrder: 9 },
  { name: "AWS LocalStack",       category: "Tools & Infrastructure", displayOrder: 10 },

  // ── Databases ────────────────────────────────────────────────────────────
  { name: "DynamoDB",        category: "Databases", displayOrder: 1 },
  { name: "PostgreSQL",      category: "Databases", displayOrder: 2 },
  { name: "Redis",           category: "Databases", displayOrder: 3 },
  { name: "VectorDB (Vespa.ai)", category: "Databases", displayOrder: 4 },
  { name: "Elasticsearch",   category: "Databases", displayOrder: 5 },
  { name: "Parquet",         category: "Databases", displayOrder: 6 },
  { name: "Apache Iceberg",  category: "Databases", displayOrder: 7 },

  // ── Concepts & Methodologies ─────────────────────────────────────────────
  { name: "Computer Networking",    category: "Concepts & Methodologies", displayOrder: 1 },
  { name: "OSI Network Architecture", category: "Concepts & Methodologies", displayOrder: 2 },
  { name: "REST API Design",        category: "Concepts & Methodologies", displayOrder: 3 },
  { name: "Multi-Threading",        category: "Concepts & Methodologies", displayOrder: 4 },
  { name: "Microservices",          category: "Concepts & Methodologies", displayOrder: 5 },
  { name: "OOP",                    category: "Concepts & Methodologies", displayOrder: 6 },
  { name: "Clean Code",             category: "Concepts & Methodologies", displayOrder: 7 },

  // ── Cloud ────────────────────────────────────────────────────────────────
  { name: "AWS ECS",             category: "Cloud", displayOrder: 1 },
  { name: "AWS EC2",             category: "Cloud", displayOrder: 2 },
  { name: "AWS SQS",             category: "Cloud", displayOrder: 3 },
  { name: "AWS DynamoDB",        category: "Cloud", displayOrder: 4 },
  { name: "AWS ElastiCache",     category: "Cloud", displayOrder: 5 },
  { name: "AWS OpenSearch",      category: "Cloud", displayOrder: 6 },
  { name: "AWS S3",              category: "Cloud", displayOrder: 7 },
  { name: "AWS CloudFormation",   category: "Cloud", displayOrder: 8 },
  { name: "AWS Kinesis Firehose", category: "Cloud", displayOrder: 9 },
  { name: "AWS RDS",             category: "Cloud", displayOrder: 10 },
  { name: "AWS Secrets Manager", category: "Cloud", displayOrder: 11 },
  { name: "AWS API Gateway",     category: "Cloud", displayOrder: 12 },
  { name: "AWS Lambda",          category: "Cloud", displayOrder: 13 },
  { name: "AWS Glue",            category: "Cloud", displayOrder: 14 },
  { name: "AWS Athena",          category: "Cloud", displayOrder: 15 },
  { name: "AWS KMS",             category: "Cloud", displayOrder: 16 },
  { name: "AWS EventBridge",     category: "Cloud", displayOrder: 17 },
  { name: "AWS ECR",             category: "Cloud", displayOrder: 18 },

  // ── AI Development ───────────────────────────────────────────────────────
  { name: "Claude Code",          category: "AI Development", displayOrder: 1 },
  { name: "Codex",                category: "AI Development", displayOrder: 2 },
  { name: "GitHub Copilot",       category: "AI Development", displayOrder: 3 },
  { name: "Cursor",               category: "AI Development", displayOrder: 4 },
  { name: "Token Optimization",   category: "AI Development", displayOrder: 5 },
  { name: "Prompt Engineering",   category: "AI Development", displayOrder: 6 },
  { name: "Agent Orchestration",  category: "AI Development", displayOrder: 7 },
];

export const skills: Skill[] = validateSkillList(skillData);
