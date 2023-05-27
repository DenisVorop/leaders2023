import { ESortDirections } from "@/services/content/api";
import { STRAPI_PROXY } from "./paths"

export const toStatic = (suffix: string): string => {
    if (suffix?.includes('upload')) {
        return `/${STRAPI_PROXY}${suffix}`
    }

    return `/${suffix}`
}

const translitMap: Record<string, string> = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
    "ф": "f", "х": "h", "ц": "c", "ч": "ch", "ш": "sh", "щ": "shch", "ъ": "",
    "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
};


export const transliterate = (text: string) => text
    .toLowerCase()
    .split("")
    .map((char) => translitMap[char] || char)
    .join("")
    .toLowerCase().replace(/[^a-zа-яё\s-]/g, "")
    .replace(/\s+/g, "-")

export const changeSortDirection = (sortDirection: ESortDirections): ESortDirections =>
    sortDirection === ESortDirections.ASC ? ESortDirections.DESC : ESortDirections.ASC

export const getArticleIdFromPath = (path: string): number => {
    const splittedPath = path.split('-')
    return Number(splittedPath[splittedPath.length - 1])
}

export const toTestCase = (testCaseId: number) => {
    return `/curator-panel/test-cases/${testCaseId}`
}

export const toProject = (projectTag: string) => {
    return `/content/projects/${projectTag}`
}

export const openLinkInNewWindow = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
