<template>
<!-- insert Pemain -->
 <form @submit.prevent="InsertBucketProfile">
    <input type="text" v-model="namaPemain">
    <input type="file" accept="image/png, image/jpeg" @change="handleFileProfileChange">
    <img v-if="profilePreview" :src="profilePreview" alt="Image Preview" class="w-20 h-20 bg-cover"/>
    <input type="submit">
</form>
</template>

<script setup>

    const supabase = useSupabaseClient()
    const total_pemain = ref([])
    const namaPemain = ref('')
    const selectedProfile = ref('')
    const profileName = ref('')
    const profilePreview = ref('')
    const CurrentUser = ref([])
    const role = ref('')

    async function FetchDataUser() {
        const { data: { user: User } } = await supabase.auth.getUser()
        CurrentUser.value = User
 
        if(!CurrentUser.value){
            navigateTo('/')
        }
        const UserId = User.id
        FetchUserRole(UserId)
    }

    async function FetchUserRole(id) {
        const {data} = await supabase
        .from('table_user_role')
        .select('*, table_role!inner(*)')
        .eq('user_id', id)
        .eq('table_role.nama_role', 'admin')

        const UserRole = data[0].table_role.nama_role
        role.value = UserRole

        console.log(role.value)
        if(role.value !== 'admin'){
            navigateTo('/')
        }


    }


    
    //Event Handler


    const handleFileProfileChange = (event) => {
        const file = event.target.files[0];
            if (file) {
                selectedProfile.value = file;
                profileName.value = file.name;

                // Create a preview URL
                const reader = new FileReader();
                reader.onload = (e) => {
                profilePreview.value = e.target.result; // Set the preview URL
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
    };

   

    //Select Function

    async function FetchDataPemain() {
        const {data, error} = await supabase
        .from('table_pemain')
        .select()
        
        total_pemain.value = data
    }

    async function FetchUrlProfile() {
        const { data } = supabase.storage
                .from('series_tumbnail')
                .getPublicUrl(`profile/${selectedProfile.value.name}`); //the img url return ass null

            // Now insert the series data
            console.log(data)
            await InsertDataActor(data.publicUrl);
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
           InsertDataActor()
        }
    }

    async function InsertDataActor(x){
        const {error} = await supabase
        .from('table_pemain')
        .insert({nama_pemain : namaPemain.value, profile_pemain : x})

        if(error){
            console.error("Error insert data:", error.message);
            namaPemain.value = ''
            selectedProfile.value = ''
            profilePreview.value = ''
        }
        else{
            alert('data has been uploaded')
            namaPemain.value = ''
            selectedProfile.value = ''
            profilePreview.value = ''
        }
    }



    onMounted(() => {
        FetchDataPemain()
        FetchDataUser()
    })
        
    
</script>