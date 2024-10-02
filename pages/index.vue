<template>
    <div v-for="show in series" :key="show.series_id">
        <p>{{ show.nama_series }}</p>
        <p>{{ show.sinopsis }}</p>
        <p></p>
        <img :src="show.cover" alt="" class="w-20 h-20 bg-cover">
        <p v-for=" genre in show.table_genre">{{ genre.nama_genre }}</p>
        <p v-for=" tempat in show.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
    </div>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const series = ref([])
    const genres = [1, 2]
    const series_id_input = 2
    const supabase = useSupabaseClient()
    const nama_series = ref('')
    const test = [1, 2]
    const test2 = 2

    // async function InsertData() {
    //     genres.forEach(InsertDataGenre);
    // }


    //fetch Function
    async function FetchData() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        // .filter('table_genre.genre_id', 'in', test)
        series.value = data
    }

    

    onMounted(() => {
        FetchData()
    })
        
    
</script>