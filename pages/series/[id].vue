<template>
    <div v-for="series in SeriesDetail" :key="series.series_id">
        <p>{{ series.nama_series }}</p>
        <p>{{ series.sinopsis }}</p>
        <p></p>
        <img :src="series.cover" alt="" class="w-20 h-20 bg-cover">
        <p v-for=" genre in series.table_genre">{{ genre.nama_genre }}</p>
        <p v-for=" tempat in series.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
        <div v-for="episode in EpisodeList" :key="episode.episode_id">
            <p @click="EpisodeGoTo(episode.episode_id)">{{ episode.nama_episode }}</p>
        </div>
    </div>    
</template>

<script setup>
    const route = useRoute()
    const router = useRouter()
    const supabase = useSupabaseClient()
    const current_id = route.params.id
    const SeriesDetail = ref([])
    const EpisodeList = ref([])

    function  EpisodeGoTo(id){
        router.push({ name: 'episode-id', params: { id } });
    }

    async function FetchDataSeries() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        .eq('series_id', current_id)
        SeriesDetail.value = data
    }

    async function FetchDataEpisode() {
        const {data, error} = await supabase
        .from('table_episode')
        .select()
        .eq('series_id', current_id)

        if(error){
            console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
        }

        EpisodeList.value = data
    }


    onMounted(() =>{
        FetchDataSeries()
        FetchDataEpisode()
    })
</script>