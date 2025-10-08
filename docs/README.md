# GitHub Pages Deployment

This folder contains the deployed version of the Employee Management application for GitHub Pages.

## How it works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Copies `index.html` to this folder
2. Copies the `src/` directory to this folder
3. Creates a `.nojekyll` file to ensure proper serving of files starting with underscore
4. Commits and pushes the changes

## GitHub Pages Configuration

To enable GitHub Pages for this repository:
1. Go to repository Settings
2. Navigate to Pages section
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main`
5. Select folder: `/docs`
6. Click Save

The site will be available at: `https://sedatates.github.io/lit-employee/`

## Local Development

For local development, work in the root directory:
- Edit files in `/src`
- Edit `index.html` in the root
- Run `npm run serve` to test locally

Do not edit files in this `/docs` folder directly - they will be overwritten by the deployment workflow.
