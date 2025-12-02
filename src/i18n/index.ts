import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'ru',
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
      startGame: 'start game',
      tryAgain: 'try again',
      congrats: 'congratulations!',
      newGame: 'new game',
      ok: 'ок',
      start: 'start',
      spin: 'spinning',
    },
  },
})

export default i18n
