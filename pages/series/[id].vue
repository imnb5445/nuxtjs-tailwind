<template>
    <div v-for="series in SeriesDetail" :key="series.series_id">
        <p>{{ series.nama_series }}</p>
        <p>{{ series.sinopsis }}</p>
        <p></p>
        <img :src="series.cover" alt="" class="w-20 h-20 bg-cover">
        <p v-for=" genre in series.table_genre">{{ genre.nama_genre }}</p>
        <p v-for=" tempat in series.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
    </div>    
</template>

<script setup>
    const route = useRoute()
    const supabase = useSupabaseClient()
    const id = route.params.id
    const SeriesDetail = ref([])

    async function FetchDataSeries() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        .eq('series_id', id)
        SeriesDetail.value = data
    }


    onMounted(() =>{
        FetchDataSeries()
    })
</script>