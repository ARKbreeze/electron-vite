import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOptionsTestStore = defineStore('options', {
  state: () => {
    return {
      counter: 0
    };
  },
  actions: {
    increment() {
      this.counter++;
    },
    decrement() {
      this.counter--;
    }
  }
});

export const useTestStore = defineStore('setup', () => {
  const counter = ref(0);

  let increment = () => {
    counter.value++;
  };

  let decrement = () => {
    counter.value--;
  };

  return { counter, increment, decrement };
});
