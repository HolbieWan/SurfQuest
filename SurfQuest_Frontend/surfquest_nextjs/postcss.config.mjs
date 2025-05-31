/**
 * postcss.config.mjs
 * -------------------
 * This configuration file sets up PostCSS for the Next.js project.
 * PostCSS processes your CSS (including Tailwind’s directives) before
 * compiling it to the final CSS bundle that the browser consumes.
 * 
 * -- Plugins:
 *  • tailwindcss: Integrates Tailwind CSS so that its utility classes
 *    can be processed from your CSS files (e.g., tailwind directives like
 *    @tailwind base, @tailwind components, @tailwind utilities).
 *
 * Usage:
 *  • Next.js (with the built‐in PostCSS support) will automatically pick
 *    up this file when building or running in development mode.
 *  • If you add other PostCSS plugins (e.g., autoprefixer, cssnano),
 *    simply include them in this plugins object.
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Tailwind CSS plugin: transforms Tailwind directives into real CSS
    tailwindcss: {},
    // If you later want autoprefixer, add:
    // autoprefixer: {},
  },
};

export default config;