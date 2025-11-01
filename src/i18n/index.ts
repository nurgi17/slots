import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'ru',
  fallbackLocale: 'en',
  messages: {
    ru: {
      miniSlot: '🎰 Мини-Слот 🎰',
    },
    en: {
      miniSlot: '🎰 Mini-Slot 🎰',
    },
  },
})

export default i18n
