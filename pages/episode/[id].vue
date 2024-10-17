<template>
    <div v-for="detail in EpisodeDetail" :key="detail.episode_id">
        <video :src="detail.episode_url" controls></video>
    </div>
</template>


<script setup>
    const supabase = useSupabaseClient()
    const route = useRoute()
    const router = useRouter()
    const CurrentEpisode = route.params.id
    const EpisodeDetail = ref([])

    async function FetchDataEpisode() {
        const { data, error} = await supabase
        .from('table_episode')
        .select()
        .eq('episode_id', CurrentEpisode)

        EpisodeDetail.value = data
    }

    onMounted(() =>{
        FetchDataEpisode()
    }
)

</script>