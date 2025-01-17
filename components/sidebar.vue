<template>
    <div class="sidebar">
        <NuxtLink to="/">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Series</p>
            </div>
        </NuxtLink>
        
        <NuxtLink to="/table_genre">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Genre</p>
            </div>
        </NuxtLink>

        <NuxtLink to="/table_tempat">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Tempat</p>
            </div>
        </NuxtLink>

        <NuxtLink to="/table_karakter">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Karakter</p>
            </div>
        </NuxtLink>

        <NuxtLink to="/table_pemain">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Pemain</p>
            </div>
        </NuxtLink>

        <NuxtLink to="/table_episode">
            <div class="option-sidebar">
                <img src="" alt="">
                <p>Episode</p>
            </div>
        </NuxtLink>
       
        
        
        
        
    </div>
</template>

<style>
    .sidebar {
    width: 15rem;
    height: 100%;
    color: rgb(207, 203, 203);
    background-color: black;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    left: 0;
    }

    .option-sidebar{
        width: 100%;
        height: 4rem;
    }
</style>
