# Push this project to GitHub

Your project is already committed locally. Follow these steps to put it on GitHub.

## 1. Create the repository on GitHub

1. Open **https://github.com/new** in your browser.
2. Sign in to GitHub if you aren’t already.
3. Set **Repository name** to: `ai-discovery-prototype`.
4. Choose **Public** (or Private if you prefer).
5. **Do not** add a README, .gitignore, or license (this project already has them).
6. Click **Create repository**.

## 2. Add the remote and push

In a terminal, from this project folder, run (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd "/Users/mclaessens/Library/CloudStorage/GoogleDrive-mclaessens@coursera.org/Shared drives/Design/Prototypes/AI-Discovery/FigmaMake"

git remote add origin https://github.com/YOUR_USERNAME/ai-discovery-prototype.git
git branch -M main
git push -u origin main
```

If GitHub asks you to sign in, use your GitHub account (or a **Personal Access Token** if you use 2FA).  
After this, your code will be at: `https://github.com/YOUR_USERNAME/ai-discovery-prototype`
