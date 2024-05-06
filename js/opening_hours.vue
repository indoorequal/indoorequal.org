<template>
  <v-list-item v-if="alwaysOpen">
    <template v-slot:prepend>
      <v-icon dense>{{ mdiClockOutline }}</v-icon>
    </template>
    <v-list-item-title>24/7</v-list-item-title>
  </v-list-item>
  <v-list-group
    v-else
    no-action
  >
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props">
        <template v-slot:prepend>
          <v-icon dense>{{ mdiClockOutline }}</v-icon>
        </template>
        <v-list-item-title>
          {{ $t(`${namespace}.state_until_date`, { state: $t(`${namespace}.state.${state}`), date: formatNextDate}) }}
        </v-list-item-title>
      </v-list-item>
    </template>

    <v-list-item
      v-for="(interval, day) in weekDays"
    >
      <v-list-item-title>
        {{ $t(`days.${day}`) }}:
        {{ interval }}
      </v-list-item-title>
    </v-list-item>
  </v-list-group>
</template>

<script>
import { mdiClockOutline } from '@mdi/js';
import OpeningHours from 'opening_hours';

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    namespace: {
      type: String,
      required: false,
      default: 'details.opening_hours'
    },
    mode: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data() {
    return { mdiClockOutline };
  },

  computed: {
    openingHours() {
      try {
        return new OpeningHours(this.value, null, { mode: this.mode });
      } catch(e) {}
    },
    state() {
      return this.openingHours.getState() ? 'open' : 'closed';
    },
    weekDays() {
      return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].reduce((memo, day, index) => {
        memo[day] = this.formatIntervals(this.openingHours.getOpenIntervals(...this.getDayOfWeek(index + 1)));
        return memo;
      }, {});
    },
    alwaysOpen() {
      return this.nextChange ? false : true;
    },
    nextChange() {
      return this.openingHours.getNextChange();
    },
    formatNextDate() {
      const format = {
        weekday: this.isToday(this.nextChange) || this.isTomorrow(this.nextChange) ? undefined : 'long'
      };
      const next = this.formatDate(this.nextChange, format);
      if (this.isTomorrow(this.nextChange)) {
        const tomorrow = this.$t(`${this.namespace}.tomorrow`);
        return `${tomorrow} ${next}`;
      }
      return next;
    }
  },

  methods: {
    getDayOfWeek(day) {
      const start = new Date();
      start.setDate(start.getDate() + (day + 7 - start.getDay()) % 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setDate(end.getDate() + (day + 7 - end.getDay()) % 7);
      end.setHours(24, 0, 0, 0);
      return [start, end];
    },

    formatIntervals(intervals) {
      if (intervals.length === 0) {
        return this.$t(`${this.namespace}.state.closed`);
      }
      return intervals.map((interval) => {
        return interval.slice(0, 2).map(this.formatDate).join('-');
      }).join(' ');
    },

    formatDate(date, format={}) {
      return date.toLocaleString(this.$i18n.locale, { hour: '2-digit', minute: '2-digit', ...format });
    },

    isToday(date) {
      const today = new Date()
      return this.isSameDay(today, date);
    },

    isTomorrow(date) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1);
      return this.isSameDay(tomorrow, date);
    },

    isSameDay(date1, date2) {
      return date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate();
    }
  }
}
</script>
