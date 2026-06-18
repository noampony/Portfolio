import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Ignore stale build artefacts that are not part of the source.
  { ignores: [".next.bak/**"] },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;
