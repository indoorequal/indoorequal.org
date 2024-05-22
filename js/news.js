import { ref } from 'vue';
import newsFiles from '../news/*.md';

const news = Object.values(newsFiles)
  .map(n => {
    n.default.date = new Date(n.default.date);
    return n.default;
  }).sort((a, b) => {
    return b.date - a.date;
  });

const LAST_READ_NEWS_AT_LOCAL_STORAGE = 'lastReadNewsAt';

function initHasUnreadNews() {
  const lastReadNewsAt = localStorage.getItem(LAST_READ_NEWS_AT_LOCAL_STORAGE);
  if (lastReadNewsAt) {
    const date = new Date();
    date.setTime(lastReadNewsAt);
    return news[0].date > date;
  }
  return true;
}

const hasUnreadNews = ref(initHasUnreadNews());

function markAsRead() {
  localStorage.setItem(LAST_READ_NEWS_AT_LOCAL_STORAGE, news[0].date.getTime());
  hasUnreadNews.value = false;
}

export function useNews() {
  return { hasUnreadNews, news, markAsRead };
}
