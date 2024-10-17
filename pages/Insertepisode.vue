<template>
    <div>
        <form @submit.prevent="InsertData()">
            <input type="text" v-model="SeriesId">
            <input type="text" v-model="nama_episode">
            <input type="file" accept="video/*" @change="handleFileChange">
            <video v-if="VideoPreviewPreview" :src="videoPreview" alt="Image Preview" class="w-20 h-20 bg-cover">
                            
                <source :src="videoPreview" type="video/mp4">
                <source :src="videoPreview" type="video/*">
                Your browser does not support the video tag.

            </video>

            <input type="submit">
        </form>
    </div>
</template>

<script setup>

    const supabase = useSupabaseClient()
    const Videofile = ref('')
    const VideoPreview = ref('')
    const nama_episode = ref('')
    const episode_url = ref('')
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
        InsertBucketEpisode()
    }

    async function InsertDataEpisode() {
        const {error} = await supabase
        .from('table_episode')
        .insert({nama_episode: nama_episode.value, episode_url: episode_url.value, series_id: SeriesId.value})
        
    }

    async function InsertBucketEpisode(){
        if (Videofile.value) {
            const { data, error } = await supabase.storage
            .from('Video_Bucket')
            .upload(`Episode/${Videofile.value.name}`, Videofile.value, {
                cacheControl: '3600',
                upsert: false,
            });

            if (error) {
            console.error('Error uploading file:', error);
            alert('Upload failed. Please try again.');
            } else {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully!');

             FetchUrlVideo()
           
            }
        } else {
            alert('Please select a file to upload.');
        }
    }

    async function FetchUrlVideo() {
        const { data, error } = supabase.storage
        .from('Video_Bucket')
        .getPublicUrl(`Episode/${Videofile.value.name}`); //the img url return ass null

        if (error) {
            console.error('Error retriving Video:', error);
        }
        // Now insert the series data
        console.log(data)
        episode_url.value = data.publicUrl
        await InsertDataEpisode();
    }
</script>