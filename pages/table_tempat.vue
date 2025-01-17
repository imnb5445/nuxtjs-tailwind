<template>
    <div v-for="tempat in list_tempat" :key="tempat.tempat_tayang_id">
        <p>{{ tempat.tempat_tayang_id }}</p>
        <p>{{ tempat.nama_tempat_tayang }}</p>
        
        <button @click="FetchSelectedTempat(tempat.tempat_tayang_id, tempat.nama_tempat_tayang)">Submit</button>

        <button @click="DeleteData(tempat.tempat_tayang_id)">Delete</button>
    </div>

    <div  v-if="isEditing">
        <form @submit.prevent="UpdateTempat" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="tempatInput">
        <input type="submit">
    </form>
    </div>

</template>

<script setup>
    const router = useRouter()
    const list_tempat = ref([])
    const genresInput = ref([])
    const tempatInput = ref('')
    const id_input =  ref('')
    const supabase = useSupabaseClient()
    const isEditing = ref(false)
   
    
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_tempat_tauang')
            .delete()
            .eq('tempat_tayang_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchData()
    }
   
    //update function
    async function UpdateTempat() {
        const {error} = await supabase .from('table_tempat_tayang')
        .update({nama_tempat_tayang: tempatInput.value})
        .eq('tempat_tayang_id', id_input.value )
    }
  
   
    
    

    //fetch Function
    async function FetchSelectedTempat(id, nama_tempat){
        id_input.value = id
        tempatInput.value = nama_tempat
        isEditing.value = true
    }

    async function FetchTempat() {
        const { data, error} = await supabase
        .from('table_tempat_tayang')
        .select()

        list_tempat.value = data

    }


    onMounted(() => {
        FetchTempat()
    })
        
    
</script>