# GitHub Pages Deployment

To host this repository on GitHub Pages automatically, we will use a GitHub Actions workflow that triggers whenever changes are pushed to the `main` branch.

## Prerequisites

- The local Git repository must be mapped to a remote GitHub repository.
- GitHub Pages must be configured to use GitHub Actions instead of deploying from a specific branch.

### GitHub Repository Settings Setup

1. Navigate to your Repository on GitHub.
2. Go to **Settings** > **Pages** (under the "Code and automation" sidebar section).
3. Under **Build and deployment**, set the Source to **GitHub Actions**.

## Continuous Deployment Workflow

We will use a standard GitHub Actions workflow designed for static HTML projects. It packages the repository and deploys it automatically.

Create a file at `.github/workflows/deploy.yml` with the following content:

```yaml
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload the dist folder
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Automated Process

Once this configuration is committed and pushed, GitHub Actions will handle everything automatically:

1. It triggers immediately on any push to `main`.
2. It checks out the latest code and packages the root directory.
3. It deploys the changes to GitHub Pages.

Your site will transparently update at `https://<your-username>.github.io/paste-as-simple-markdown/` a few seconds after every push!
