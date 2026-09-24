<script setup lang="ts">
import ShowroomHeader from './components/ShowroomHeader.vue'
import ShowroomIntro from './components/ShowroomIntro.vue'
import MultimediaExperience from './components/MultimediaExperience.vue'
import ShowroomContent from './components/ShowroomContent.vue'
import ShowroomCta from './components/ShowroomCta.vue'
</script>

<template>
  <a href="#conteudo" class="showroom-skip-link">Pular para o conteúdo</a>
  <ShowroomHeader />
  <main>
    <ShowroomIntro />
    <div class="showroom-gsap-preserved" aria-label="Experiência interativa da central multimídia">
      <MultimediaExperience />
    </div>
    <ShowroomContent />
  </main>
  <ShowroomCta />
</template>
