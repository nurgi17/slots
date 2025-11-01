<template>
  <div class="reel" :class="{ spinning: isSpinning }">
    <div class="reel-content">
      <div class="symbol-display" :style="{ transform: `translateY(${displayOffset}px)` }">
        <div class="symbol" :style="{ backgroundColor: finalSymbolData.color }">
          <span class="symbol-icon">{{ finalSymbolData.icon }}</span>
        </div>
      </div>

      <!-- Spinning overlay с множеством символов -->
      <div v-if="isSpinning" class="spin-overlay">
        <div class="reel-strip" :style="{ transform: `translateY(${spinOffset}px)` }">
          <div
            v-for="(symbol, index) in spinningSymbols"
            :key="index"
            class="symbol"
            :style="{ backgroundColor: symbol.color }"
          >
            <span class="symbol-icon">{{ symbol.icon }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Symbol } from '../types/game'
import { SYMBOLS } from '../utils/gameLogic'

interface Props {
  symbolId: string
  isSpinning: boolean
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
})

const spinOffset = ref(0)
const displayOffset = ref(0)
const SYMBOL_HEIGHT = 120

// Получаем данные финального символа
const finalSymbolData = computed(() => {
  return SYMBOLS.find((s) => s.id === props.symbolId) || SYMBOLS[0]
})

// Генерируем случайные символы для эффекта вращения
const spinningSymbols = computed(() => {
  const symbols: Symbol[] = []
  for (let i = 0; i < 30; i++) {
    symbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
  }
  // Добавляем финальный символ в конец
  symbols.push(finalSymbolData.value)
  return symbols
})

watch(
  () => props.isSpinning,
  async (spinning) => {
    if (spinning) {
      // Начинаем вращение с задержкой
      await new Promise((resolve) => setTimeout(resolve, props.delay))

      // Параметры анимации
      const duration = 5000 + Math.random() * 2000 // 5-7 секунд
      const startTime = Date.now()
      const totalDistance = spinningSymbols.value.length * SYMBOL_HEIGHT

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing функция для плавной остановки (cubic ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        spinOffset.value = -totalDistance * easeOut

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          // После завершения анимации сбрасываем offset
          setTimeout(() => {
            spinOffset.value = 0
          }, 100)
        }
      }

      animate()
    }
  },
)
</script>

<style scoped>
.reel {
  width: 240px;
  height: 240px;
  overflow: hidden;
  border: 3px solid #333;
  border-radius: 10px;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  position: relative;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
}

.reel-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.symbol-display {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.spin-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  z-index: 1;
  overflow: hidden;
}

.reel-strip {
  will-change: transform;
}

.symbol {
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%);
}

.symbol-icon {
  font-size: 96px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.spinning .symbol-icon {
  animation: symbolBlur 0.3s ease-in-out infinite;
}

@keyframes symbolBlur {
  0%,
  100% {
    filter: blur(0px) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }
  50% {
    filter: blur(3px) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
  }
}
</style>
