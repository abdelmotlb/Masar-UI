---
description: "Use when adding, moving, or organizing ASP.NET Core backend code. Keep feature-specific controllers, services, repositories, contracts, and models together by feature."
applyTo: "backend/SoldierAio.Api/**/*.cs"
---
# Backend Feature Organization

- Organize backend code by feature, not by technical layer.
- Keep each feature's controller, service, repository, interfaces, request/response contracts, and models together under `Features/<FeatureName>/`.
- Do not add feature-specific files to shared `Controllers/`, `Services/`, or `Repositories/` folders.
- Keep application startup and genuinely cross-feature infrastructure outside feature folders. Keep code local to a feature when only that feature uses it.
- Follow the existing `Features/Tasks/` layout when adding a new feature.