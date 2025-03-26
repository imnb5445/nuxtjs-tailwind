<template>
    <div>
        <form @submit.prevent="InsertData()">
            <select name="series" id="selectTest"  v-model="SeriesId">
                <option value="" disabled selected>Choose A Series</option>
                <option v-for="show in series" :key="show.series_id" v-bind:value="show.series_id">{{ show.nama_series }} </option>
            </select>
            <input type="text" v-model="nama_episode">
            <input type="text" v-model="episode_url">
            <input type="number" v-model="order">
            <input type="submit">
            <p>{{ SeriesId }}</p>
        </form>
    </div>

    
</template>

<script setup>

    const supabase = useSupabaseClient()
    const series = ref([])
    const Videofile = ref('')
    const VideoPreview = ref('')
    const nama_episode = ref('')
    const episode_url = ref('')
    const order = ref('')
    const SeriesId = ref('')

   
    const handleFileChange = (event) => {
        Videofile.value = event.target.files[0] || null

        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
        VideoPreview.value = e.target.result; // Set the preview URL
        };
        reader.readAsDataURL(files); // Read the file as a data URL

    }

    async function InsertData() {
        FetchUrl()
    }

    async function InsertDataEpisode() {
        const {error} = await supabase
        .from('table_episode')
        .insert({nama_episode: nama_episode.value, episode_url: episode_url.value, series_id: SeriesId.value, episode_order: order.value})

        if(error){
            alert("failed to upload episode")
            nama_episode.value = ""
            episode_url.value = ""
            SeriesId.value = ""
            order.value = ""
        }
        else{
            alert("episode has been uploaded")
            nama_episode.value = ""
            episode_url.value = ""
            SeriesId.value = ""
            order.value = ""
        }
        
    }


    async function FetchUrl(){
        const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]*\/\S*\/|\S*?v=|\S*?v%3D)([\w-]+)).*/;
        var match = episode_url.value.match(regExp)
        console.log(match);
    
        if (match) {
        episode_url.value = match[1]; // The YouTube video ID is in the second capture group
        await InsertDataEpisode();
        } else {
        episode_url.value = []; // No match found
    }}

    async function FetchDataSeries() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series')
        series.value = data
    }

    onMounted(() => {
        FetchDataSeries()
    })
        
</script>