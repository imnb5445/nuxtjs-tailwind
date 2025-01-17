<template>
    <div v-for="pemain in list_Pemain" :key="pemain.pemain_id">
        <p>{{ pemain.nama_pemain }}</p>
        <img :src="pemain.profile_pemain" :alt="pemain.nama_pemain">
        
        <form @submit.prevent="FetchSelectedPemain(pemain.pemain_id, pemain.nama_pemain, pemain.profile_pemain)">
            <input type="submit">
        </form>

        <button @click="DeleteData(pemain.pemain_id)">Delete</button>
    </div>

    <div v-if="isEditing">
        <form @submit.prevent="UpdateKarakter" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="namaPemainInput">
        <input type="file" accept="image/png, image/jpeg" @change="handleFileProfileChange">
        <input type="submit">
    </form>
    </div>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const router = useRouter()
    const list_Pemain = ref([])
    const namaPemainInput = ref('')
    const id_input =  ref('')
    const url_input = ref('')
    const supabase = useSupabaseClient()
    const profileChange = ref(false)
    const isEditing = ref(false)
    const selectedProfile = ref('')
    const profileName = ref('')
    const profilePreview = ref('')

    //Event Handler
    const handleFileProfileChange = (event) => {
        const file = event.target.files[0];
            if (file) {
                selectedProfile.value = file;
                profileName.value = file.name;
                profileChange.value = true


                // Create a preview URL
                const reader = new FileReader();
                reader.onload = (e) => {
                profilePreview.value = e.target.result; // Set the preview URL
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
    };
   
    //Delete Function
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_pemain')
            .delete()
            .eq('pemain_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchData()
    }
   
    //update function
    async function UpdateKarakter() {

        if(profileChange){
            await InsertBucketProfile()
        }
        const {error} = await supabase .from('table_pemain')
        .update({nama_pemain: namaPemainInput.value, profile_pemain: url_input.value})
        .eq('pemain_id', id_input.value)

        if(error){
            console.log(error)
        }
    }
  
   
    
    

    //fetch Function
    async function FetchDataSeries() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series')
        series.value = data
    }

    async function FetchSelectedPemain(pemain_id, nama_pemain, profile) {
        id_input.value = pemain_id
        namaPemainInput.value = nama_pemain
        url_input.value = profile
        isEditing.value = true
    }

    async function FetchPemain() {
        const { data, error} = await supabase
        .from('table_pemain')
        .select()

        list_Pemain.value = data

    }

    async function FetchUrlProfile() {
        const { data } = supabase.storage
                .from('series_tumbnail')
                .getPublicUrl(`profile/${selectedProfile.value.name}`); //the img url return ass null

            // Now insert the series data
            url_input.value = data.publicUrl
    }


    //Insert Function
    async function InsertBucketProfile(){
        if (selectedProfile.value) {
            const { data, error } = await supabase.storage
            .from('series_tumbnail')
            .upload(`profile/${selectedProfile.value.name}`, selectedProfile.value, {
                cacheControl: '3600',
                upsert: false,
            });

            if (error) {
            console.error('Error uploading file:', error);
            alert('Upload failed. Please try again.');
            } else {
            console.log('File uploaded successfully:', data);
            alert('File uploaded successfully!');

            FetchUrlProfile()
            }
        } else {
            alert('Please select a file to upload.');
        }
    }


    onMounted(() => {
        FetchPemain()
        FetchDataSeries()
    })
        
    
</script>