import {statSync} from 'fs';
export function remarkModifiedTime() {
    return (tree, file)=>{
        const filePath = file.history[0];
        const result = statSync(filePath);
        file.data.astro.frontmatter.lastModified = result.mtime.toISOString();
    }
}