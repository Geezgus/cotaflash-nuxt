<template>
  <div id="page">
    <nav>
      <ul>
        <li v-if="!useAuthStore().getToken()">
          <NuxtLink to="/login">Login</NuxtLink>
        </li>
        <li v-else>
          <NuxtLink to="/lista-cotacoes">Lista de Cotações</NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped></style>
