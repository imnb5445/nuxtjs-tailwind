<template>
    <div v-for="episode in list_episode" :key="episode.episode_id">
        <p>{{ episode.episode_id }}</p>
        <p>{{ episode.nama_episode }}</p>
        <ScriptYouTubePlayer ref="video" :video-id="episode.episode_url" @ready="isLoaded = true" @state-change="stateChange" trigger="none"></ScriptYouTubePlayer>
        
        <form @submit.prevent="FetchSelectedEpisode(episode.episode_id, episode.nama_episode, episode.episode_url, episode.episode_order)">
            <input type="submit">
        </form>

        <button @click="DeleteData(episode.episode_id)">Delete</button>
    </div>

    <div v-if="isEditing">
        <form @submit.prevent="UpdateEpisode" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="namaEpisodeInput">
        <input type="text" name="JudulInput" v-model="episode_url_input">
        <input type="number" name="JudulInput" v-model="episode_order_input">
        <input type="submit">
    </form>
    </div>
    <div v-else>

    </div>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const router = useRouter()
    const list_episode = ref([])
    const genresInput = ref([])
    const namaEpisodeInput = ref('')
    const id_input =  ref('')
    const check_url = ref('')
    const episode_url_input = ref('')
    const episode_order_input = ref('')
    const supabase = useSupabaseClient()
    const isEditing = ref(false)
   
    
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_episode')
            .delete()
            .eq('episode_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchEpisode()
    }
   
    //update function
    async function UpdateEpisode() {
        try{
            if (check_url.value !== episode_url_input.value){
            FetchUrl()
        }
        }catch(err){
            return 0
        }
       
        const {error} = await supabase .from('table_episode')
        .update({nama_episode: namaEpisodeInput.value, episode_url: episode_url_input.value, episode_order: episode_order_input.value})
        .eq('episode_id', id_input.value)
        isEditing.value = false
        FetchEpisode()
    }
  

    //fetch Function
    async function FetchSelectedEpisode(episode_id, nama_episode, url, order) {
        id_input.value = episode_id
        namaEpisodeInput.value = nama_episode
        episode_order_input.value = order
        episode_url_input.value = url
        check_url.value = url
        isEditing.value = true
    }

    async function FetchEpisode() {
        const { data, error} = await supabase
        .from('table_episode')
        .select()

        list_episode.value = data

    }

    async function FetchUrl(){
        const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]*\/\S*\/|\S*?v=|\S*?v%3D)([\w-]+)).*/;
        var match = episode_url_input.value.match(regExp)
        console.log(match);
    
        if (match) {
        episode_url_input.value = match[1]; // The YouTube video ID is in the second capture group
        }
        else{
            return 0
        }
    }

    


    onMounted(() => {
        FetchEpisode()
    })
        
    
</script>