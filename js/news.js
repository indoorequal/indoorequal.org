import newsFiles from '../news/*.md';

const news = Object.values(newsFiles)
  .map(n => {
    n.default.date = new Date(n.default.date);
    return n.default;
  }).sort((a, b) => {
    return b.date - a.date;
  });

const LAST_READ_NEWS_AT_LOCAL_STORAGE = 'lastReadNewsAt';

const state = {
  hasNews: true,
}

export default {
  data() {
    return {
      news,
      internalState: state,
    };
  },

  created() {
    const lastReadNewsAt = localStorage.getItem(LAST_READ_NEWS_AT_LOCAL_STORAGE);
    if (lastReadNewsAt) {
      const date = new Date();
      date.setTime(lastReadNewsAt);
      state.hasNews = news[0].date > date;
    }
  },

  computed: {
    hasNews() {
      return this.internalState.hasNews;
    }
  },

  methods: {
    markAsRead() {
      localStorage.setItem(LAST_READ_NEWS_AT_LOCAL_STORAGE, news[0].date.getTime());
      state.hasNews = false;
    }
  }
};
