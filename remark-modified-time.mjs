import {statSync} from 'fs';
export function remarkModifiedTime() {
    return (tree, file)=>{
        const filePath = file.history[0];
        const result = statSync(filePath);
        file.data.astro.frontmatter.lastModified = result.mtime.toISOString();
        if (!file.data.astro.frontmatter.pubDatetime) {
            file.data.astro.frontmatter.pubDatetime = new Date().toISOString(); // e.g., "2025-08-31T12:00:00.000Z"
        }
    }
}