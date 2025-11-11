import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: {
      miniSlot: 'MINI-SLOT',
      startGame: 'начать игру',
      tryAgain: 'попробуй ещё',
      congrats: 'поздравляем!',
      newGame: 'новая игра',
      ok: 'ок',
      start: 'старт',
      spin: 'вращение',
    },
    en: {
      miniSlot: 'MINI-SLOT',
      startGame: 'начать игру',
      tryAgain: 'попробуй ещё',
      congrats: 'поздравляем!',
      newGame: 'новая игра',
      ok: 'ок',
      start: 'start',
      spin: 'spinnig',
    },
  },
})

export default i18n
