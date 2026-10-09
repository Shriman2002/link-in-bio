# Link in Bio

A self-hosted link page you can put in your TikTok bio.

- `index.html`: the public page
- `config.js`: your name, bio, links, socials and theme
- `editor.html`: a visual editor with a live phone preview. Click **Download config.js** and replace the existing file.

## Customize
1. Open `editor.html` (or edit `config.js` directly).
2. To use your own photo, put it in this folder (for example `avatar.jpg`) and set the avatar to `avatar.jpg`.
3. Icons can be a platform name from [simple-icons](https://simpleicons.org) (tiktok, youtube, spotify, amazon…), `email`, `website`, or any emoji.

## Publish (free)
- **GitHub Pages**: push this folder to a repo, then go to Settings → Pages → Deploy from branch. Your URL will be `https://<user>.github.io/<repo>/`.
- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop.
- **Vercel / Cloudflare Pages**: import the repo. There's no build step.

Then in TikTok go to Edit profile → Website and paste the URL. You can delete `editor.html` from the deployed copy if you don't want it to be public.
