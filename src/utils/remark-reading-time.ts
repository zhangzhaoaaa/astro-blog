import getReadingTime from "reading-time";
import { toString } from "mdast-util-to-string";

export function remarkReadingTime() {
  return function (tree: unknown, { data }: any) {
    const textOnPage = toString(tree);
    console.log("Remark plugin running"); // 日志确认
    console.log("Text content:", textOnPage); // 打印实际文本以调试

    // 改进字数统计：中文字符 + 英文/其他单词
    const chineseCount = (textOnPage.match(/[\u4e00-\u9fff]/g) || []).length; // 统计中文字符（每个汉字计为1）
    const nonChineseText = textOnPage.replace(/[\u4e00-\u9fff]/g, " "); // 用空格替换中文以便分词
    const nonChineseWords = nonChineseText
      .split(/\s+/)
      .filter(word => word.length > 0).length; // 统计非中文单词
    const wordCount = chineseCount + nonChineseWords; // 总字数

    console.log("Chinese count:", chineseCount);
    console.log("Non-Chinese words:", nonChineseWords);
    console.log("Total wordCount:", wordCount);

    const readingTime = getReadingTime(textOnPage, { wordsPerMinute: 250 }); // 适合中文阅读速度
    data.astro.frontmatter.minutesRead = readingTime.text;
    data.astro.frontmatter.wordCount = wordCount;
  };
}
