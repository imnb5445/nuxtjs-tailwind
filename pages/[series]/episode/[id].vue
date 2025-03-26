<template>
    <div v-for="detail in EpisodeDetail" :key="detail.episode_id">
        <ScriptYouTubePlayer ref="video" :video-id="detail.episode_url" @ready="isLoaded = true" @state-change="stateChange" trigger="visible"></ScriptYouTubePlayer>
    </div>
    <div v-for="episode in EpisodeList" :key="episode.episode_id">
        <NuxtLink :to="'/'+Series+'/episode/'+episode.episode_order">{{ episode.nama_episode }}</NuxtLink>
    </div>
</template>


<script setup>
    const supabase = useSupabaseClient()
    const route = useRoute()
    const router = useRouter()
    const CurrentEpisode = route.params.id
    const Series = route.params.series
    const EpisodeDetail = ref([])
    const EpisodeList = ref([])

    console.log(Series)

    async function FetchDataEpisode() {
        const { data, error} = await supabase
        .from('table_episode')
        .select()
        .eq('episode_id', CurrentEpisode)

        EpisodeDetail.value = data
    }

    async function FetchListEpisode() {
        const {data, error} = await supabase
        .from('table_episode')
        .select()
        .eq('series_id', Series)
        .order('episode_order', {ascending: true})

        if(error){
            console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
        }

        EpisodeList.value = data
    }


    onMounted(() =>{
        FetchDataEpisode()
        FetchListEpisode()
    }
)

</script>