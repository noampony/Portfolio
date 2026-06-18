/**
 * Technical Skills content (spec §8.6, §11.5).
 *
 * Rules:
 * - Only notes explicitly provided in §8.6 are present (AWS, Jenkins, Iceberg).
 * - Skills whose notes are marked TBD in §8.6 have no `notes` field — no empty string,
 *   no placeholder text.
 * - No `proficiency` field is set anywhere — proficiency display is TBD (§8.6).
 * - No icons yet — icon source is TBD (§6.8, §8.6); added in Task 9.2.
 */

import type { Skill } from "../types";
import { validateSkillList } from "../validate";

const skillData: unknown[] = [
  // ── Programming Languages ────────────────────────────────────────────────
  { name: "Python",     category: "Programming Languages", displayOrder: 1 },
  { name: "SQL",        category: "Programming Languages", displayOrder: 2 },
  { name: "Bash",       category: "Programming Languages", displayOrder: 3 },

  // ── Backend Frameworks ───────────────────────────────────────────────────
  { name: "FastAPI",    category: "Backend Frameworks",    displayOrder: 1 },

  // ── Cloud & Infrastructure ───────────────────────────────────────────────
  {
    name: "AWS",
    category: "Cloud & Infrastructure",
    notes: "ECS, EC2, SQS, DynamoDB, ElasticCache, ElasticSearch, S3, Athena, Iceberg, and more",
    displayOrder: 1,
  },
  { name: "Docker",     category: "Cloud & Infrastructure", displayOrder: 2 },
  { name: "Linux",      category: "Cloud & Infrastructure", displayOrder: 3 },

  // ── CI/CD & Automation ───────────────────────────────────────────────────
  {
    name: "Jenkins",
    category: "CI/CD & Automation",
    notes: "Including Jenkinsfile creation",
    displayOrder: 1,
  },
  { name: "GitHub",     category: "CI/CD & Automation",   displayOrder: 2 },

  // ── Databases ────────────────────────────────────────────────────────────
  { name: "PostgreSQL",    category: "Databases", displayOrder: 1 },
  { name: "DynamoDB",      category: "Databases", displayOrder: 2 },
  { name: "Redis",         category: "Databases", displayOrder: 3 },
  { name: "Vector DB",     category: "Databases", displayOrder: 4 },
  { name: "ElasticSearch", category: "Databases", displayOrder: 5 },
  {
    name: "Iceberg",
    category: "Databases",
    notes: "Parquet datasets",
    displayOrder: 6,
  },

  // ── Testing & Quality ────────────────────────────────────────────────────
  { name: "Pytest",               category: "Testing & Quality", displayOrder: 1 },
  { name: "Unit testing",         category: "Testing & Quality", displayOrder: 2 },
  { name: "Integration testing",  category: "Testing & Quality", displayOrder: 3 },
  { name: "Linting / formatting", category: "Testing & Quality", displayOrder: 4 },
  { name: "AWS LocalStack",       category: "Testing & Quality", displayOrder: 5 },

  // ── Monitoring & Alerting ────────────────────────────────────────────────
  { name: "Prometheus", category: "Monitoring & Alerting", displayOrder: 1 },
  { name: "Nagios",     category: "Monitoring & Alerting", displayOrder: 2 },
  { name: "Grafana",    category: "Monitoring & Alerting", displayOrder: 3 },

  // ── Security / Cybersecurity ─────────────────────────────────────────────
  { name: "Secure coding",        category: "Security / Cybersecurity", displayOrder: 1 },
  { name: "Vulnerability awareness", category: "Security / Cybersecurity", displayOrder: 2 },
];

export const skills: Skill[] = validateSkillList(skillData);
