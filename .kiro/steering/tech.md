# Technology & Development Standards

Project: laplace
Build System: Docker (docker compose)
Port Range: 7200-7299 (Server:7201, Admin:7202, Client:7203, PMA:7204, MySQL:7205)
Shell: PowerShell 5.1+ (Windows)

## Development Protocol
- Follow Spec-Driven Development (SDD): Specify → Plan → Tasks → Implement.
- Specs directory: `.agent/specs/`
- Constitution: `.agent/memory/constitution.md`
- 15-Minute Rule: Each task must be atomic, ≤ 15 minutes, affecting ≤ 3 files.

## Environment
- Docker-First: All apps run inside containers. Never run npm/python on host directly.
- ENV vars required for all sensitive config (`.env` files).
- No hardcoded URLs, Tokens, Keys, or Credentials.

## Language
- Respond in Vietnamese (Tiếng Việt).

## Safety
- NEVER run `docker compose down -v` on Production.
- Always check logs on error: `docker compose logs -f <service>`.
