# CS232 — CantBeSafer Backend

> **Project Name:** [TU Thereat]
> **Team Name:** [ปลอดภัยไม่ไหวแล้ว(Can't Be Safer)]
> **Repository:** [CS232_CantBeSafer_BE](https://github.com/Gikeeeeeee/CS232_CantBeSafer_BE)

---

## Team Members

| No. | Full Name | Student ID | Primary Role |
|:---:|-----------|:----------:|--------------|
| 1 | [นายจักรพงษ์ สนไสล] | [6709616384] | [Backend Developer] |
| 2 | [ชญานนท์ พันธุโชค] | [6709616392] | [Frontend Developer] |
| 3 | [ทรงพล อนงค์สถาพร] | [6709616509] | [Frontend Developer] |
| 4 | [พลกฤต ไชยมณี] | [6709616681] | [Tech Lead / Backend Developer] |
| 5 | [พัชรพล ศรีประเสริฐ] | [6709616707] | [Backend Developer / Database] |
| 6 | [พัสกร ศรสังข์] | [6709616749] | [Frontend Developer / Cloud Architecter] |
| 7 | [อิทธิพล จับชิ้น] | [6709616970] | [ฺBackend Developer / Documentation] |
| 8 | [ธัชกฤช สตารัตน์] | [6709681081] | [Team Lead / Frontend Developer / Cloud Engineer] |

---

## Feature Distribution

| Feature Name | Responsibility | Tech Stack | Status |
|--------------|---------------|------------|:------:|
| User Authentication & Authorization | [พลกฤต ไชยมณี / จักรพงษ์ สุนไสล] | Node.js, Express, JWT, bcrypt | ✅ Done |
| Report Management (CRUD) | [จักรพงษ์ สุนไสล / อิทธิพล จับชิ้น] | TypeScript, Express, PostgreSQL | ✅ Done |
| File Upload to AWS S3 | [พัชรพล ศรีประเสริฐ] | AWS SDK v3 (`@aws-sdk/client-s3`), Multer | ✅ Done |
| Push Notifications (SNS) | [พัชรพล ศรีประเสริฐ] | AWS SDK v3 (`@aws-sdk/client-sns`) | ✅ Done |
| Database Schema Design | [พัสกร ศรสังข์ / พัชรพล ศรีประเสริฐ] | PostgreSQL, `init.sql` | ✅ Done |
| REST API Design & Swagger Docs | [พลกฤต ไชยมณี] | Express, `swagger-ui-express` | ✅ Done |
| Containerization & Deployment | [จักรพงษ์ สุนไสล] | Docker, Docker Compose, AWS Lambda, `serverless-http` | ✅ Done |
| Location / Mapping Integration | [อิทธิพล จับชิ้น] | AWS Location Service (`@aws-sdk/client-location`) | ✅ Done
> **Status Legend:** ✅ Done &nbsp;|&nbsp; 🔄 In Progress &nbsp;|&nbsp; ⏳ Pending &nbsp;|&nbsp; ❌ Blocked

---

## 🤝 Contribution Guidelines

### 🌿 Branching Strategy

Always branch off from `main`. Use the following naming conventions:

| Branch Type | Pattern | Example |
|-------------|---------|---------|
| New Feature | `feature/<short-description>` | `feature/user-authentication` |
| Bug Fix | `bugfix/<short-description>` | `bugfix/fix-jwt-expiry` |

```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name
```

---

### ✍️ Commit Message Convention

Follow the **Conventional Commits** standard for all commit messages:

```
<type>(<scope>): <short summary>
```

| Type | When to Use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Code formatting (no logic change) |
| `refactor` | Code restructuring (no feature/fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, dependency updates, config |
| `perf` | Performance improvements |

**Examples:**

```bash
git commit -m "feat(auth): add JWT refresh token endpoint"
git commit -m "fix(report): resolve null image_url after S3 upload"
git commit -m "docs: add contribution guidelines"
git commit -m "chore: update aws-sdk to v3.1024"
```

---

### 🔀 Pull Request Process

1. **Sync your branch** with the latest `main` before submitting:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your branch** to the remote repository:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub targeting the `main` branch.

4. **Fill in the PR description** with:
   - 📋 **What** was changed and **why**
   - 🔗 Related issue number (if any), e.g., `Closes #12`
   - 🧪 How to test the changes

5. **Request at least one reviewer** from the team before merging.

6. **Address all review comments** before the PR is approved.

7. **Do not merge your own PR** — another team member must approve and merge it.

8. **Delete the branch** after merging to keep the repository clean.

---

### ⚙️ Local Development Setup

Refer to [README.md](./README.md) for the full setup guide. Quick start:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env with your local values

# 3. Start the database (requires Docker)
docker-compose up -d

# 4. Run in development mode
npm run dev
```

---

> _Last updated: May 2026 — CS232 CantBeSafer Team_
