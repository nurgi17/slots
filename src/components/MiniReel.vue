<template>
  <div class="reel border-8! border-solid! border-[#7617b4]! rounded-[30px]">
    <div class="reel-content">
      <div class="spin-overlay">
        <div class="reel-strip" :style="{ transform: `translateY(${spinOffset}px)` }">
          <div
            v-for="(symbol, index) in spinningSymbols"
            :key="index"
            class="symbol flex items-center justify-center text-center"
          >
            <span v-if="!symbol.img" class="symbol-icon">{{ symbol.icon }}</span>
            <img v-else class="w-full h-auto" :src="symbol.img" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { Symbol } from '../types/game'
import { SYMBOLS } from '../utils/gameLogic'

interface Props {
  symbolId: string
  isSpinning: boolean
  delay?: number
}

const props = withDefaults(defineProps<Props>(), { delay: 0 })

const spinOffset = ref(0)
const SYMBOL_HEIGHT = 240

const finalSymbolData = computed(() => {
  return SYMBOLS.find((s) => s.id === props.symbolId) || SYMBOLS[0]
})

// Генерация ленты: все случайные символы + фиксированный финальный
const spinningSymbols = ref<Symbol[]>([])

function generateSpinningSymbols() {
  const symbols: (Symbol & { idx: number })[] = []

  for (let i = 0; i < 20; i++) {
    const sym = { ...SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]!, idx: i }
    symbols.push(sym)
  }

  // Финальный символ с idx = 20
  symbols.push({ ...finalSymbolData.value!, idx: 20 })

  // Сортируем по idx
  symbols.sort((a, b) => a.idx - b.idx)

  spinningSymbols.value = symbols
}

// Функция плавного анимирования с easing
function animateTo(target: number, duration: number) {
  const start = spinOffset.value
  const change = target - start
  const startTime = performance.now()

  const animate = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    spinOffset.value = start + change * easeOut

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      spinOffset.value = target // точное конечное положение
    }
  }

  requestAnimationFrame(animate)
}

watch(
  () => props.isSpinning,
  async (spinning) => {
    if (spinning) {
      generateSpinningSymbols() // формируем ленту с финальным символом
      await new Promise((resolve) => setTimeout(resolve, props.delay))
      const totalDistance = (spinningSymbols.value.length - 1) * SYMBOL_HEIGHT
      const duration = 4000 + Math.random() * 2000

      animateTo(-totalDistance, duration)
    }
  },
)

onMounted(() => {
  generateSpinningSymbols() // формируем ленту с финальным символом
})
</script>

<style scoped>
.reel {
  width: 240px;
  height: 240px;
  overflow: hidden;
  position: relative;
}

.reel-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.spin-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #19184f;
  overflow: hidden;
}

.reel-strip {
  will-change: transform;
}

.symbol {
  width: 240px;
  height: 240px;
}

.symbol-icon {
  font-size: 96px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}
</style>
