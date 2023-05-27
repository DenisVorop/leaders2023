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



export function formatTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = Math.abs(now.getTime() - timestamp.getTime());
  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
  
    if (diff < minute) {
      const seconds = Math.round(diff / 1000);
      return `${seconds} ${seconds === 1 ? 'секунду' : 'секунд'} назад`;
    } else if (diff < hour) {
      const minutes = Math.round(diff / minute);
      return `${minutes} ${minutes === 1 ? 'минуту' : 'минуты'} назад`;
    } else if (diff < day) {
      const hours = Math.round(diff / hour);
      return `${hours} ${hours === 1 ? 'час' : 'часа'} назад`;
    } else if (diff < month) {
      const days = Math.round(diff / day);
      return `${days} ${days === 1 ? 'день' : 'дня'} назад`;
    } else if (diff < year) {
      const months = Math.round(diff / month);
      return `${months} ${months === 1 ? 'месяц' : 'месяца'} назад`;
    } else {
      const years = Math.round(diff / year);
      return `${years} ${years === 1 ? 'год' : 'года'} назад`;
    }
  }
export const toProject = (projectTag: string) => {
    return `/content/projects/${projectTag}`
}

export const openLinkInNewWindow = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
