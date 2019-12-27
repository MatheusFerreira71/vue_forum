<template>
    <div class="col-full" :class="$style.textCenter">
        <h1 :class="$style.headingLarge">Not Found</h1>
        <p :class="$style.textCenter">Oooops, não conseguimos encontrar o que você está procurando. Ir para a
            <router-link :to="{name: 'Home'}"> página principal ?</router-link>
        </p>
    </div>
</template>

<script>
export default {}
</script>

<style module>
    .headingLarge {
        font-size: 100px;
    }
    .textLarge {
        font-size: 50px;
        font-weight: 100;
    }
    .textCenter {
        text-align: center;
    }
</style>
