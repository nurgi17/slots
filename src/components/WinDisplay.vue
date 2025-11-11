<template>
  <div class="flex flex-col justify-center items-center text-center">
    <img src="../assets/images/logo.svg" alt="logo" class="mb-[180px]! mt-[140px]!" />
    <div
      class="flex flex-col justify-center items-center text-center w-[900px] h-[1424px] rounded-[60px] border-10 border-solid border-[#AE00FF] result-back"
    >
      <div class="mt-[200px]! flex flex-col justify-center items-center">
        <div class="flex items-center gap-[50px]">
          <div class="font-medium text-white text-[500px] leading-120">
            {{ totalWin }}
          </div>
          <div class="mt-30!">
            <img src="../assets/images/coin.svg" alt="" class="w-[199px] h-[216px]" />
          </div>
        </div>
        <div class="font-bold text-white text-[96px] mt-8! uppercase">
          {{ totalWin > 0 ? $t('congrats') : $t('tryAgain') }}
        </div>
      </div>
      <div class="mt-[100px]!">
        <button
          @click="totalWin > 0 ? goToStart() : playAgain()"
          class="uppercase text-[96px] text-white font-bold pb-5! px-24! rounded-[10000px] bg-linear-to-tr from-[#3C1082] to-[#AE00FF] border-10 border-solid border-[#AE00FF]"
        >
          {{ totalWin > 0 ? $t('ok') : $t('newGame') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameResult } from '../types/game'

interface Props {
  result: GameResult | null
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  playAgain: []
  goToStart: []
}>()

// const isJackpot = computed(() => props.result?.isJackpot || false)
const totalWin = computed(() => props.result?.totalWin || 0)
// const winningLines = computed(() => props.result?.winningLines || [])

function playAgain() {
  emit('playAgain')
}

function goToStart() {
  emit('goToStart')
}
</script>

<style scoped>
.result-back {
  background-image: url('../assets/images/result-back.png');
}
</style>
