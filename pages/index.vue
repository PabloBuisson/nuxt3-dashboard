<template>
  <div class="bg-slate-600 h-screen">
    <h1 class="text-4xl">My dashboard</h1>
    <section class="flex flex-wrap gap-4">
      <TilePreview :title="'Tile 1'" :id="'1'">
        <p>Some content</p>
      </TilePreview>
      <TilePreview :title="'Tile 2'" :id="'2'" />
      <TilePreview :title="'Tile 3'" :id="'3'" />
      <TilePreview :title="'Tile 4'" :id="'4'" />
    </section>
  </div>
</template>
