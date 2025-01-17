<template>
    <div v-for="karakter in list_karakter" :key="karakter.karakter_id">
        <p>{{ karakter.karakter_id }}</p>
        <p>{{ karakter.nama_karakter }}</p>
        <p>{{ karakter.series_id }}</p>
        <p>{{ karakter.pemain_id }}</p>
        
        <form @submit.prevent="FetchSelectedKarakter(karakter.karakter_id, karakter.nama_karakter, karakter.series_id, karakter.pemain_id)">
            <input type="submit">
        </form>

        <button @click="DeleteData(genre.genre_id)">Delete</button>
    </div>

    <div v-if="isEditing">
        <form @submit.prevent="UpdateKarakter" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="namaKarakterInput">
        <select name="peamin" id="selectTest"  v-model="pemainInput">
            <option value="" disabled selected>Choose An Actor/Actress</option>
            <option v-for="pemain in total_pemain" :key="pemain.pemain_id" v-bind:value="pemain.pemain_id">{{ pemain.nama_pemain }} </option>
        </select>
        <select name="series" id="selectTest"  v-model="seriesInput">
            <option value="" disabled selected>Choose A Series</option>
            <option v-for="show in series" :key="show.series_id" v-bind:value="show.series_id">{{ show.nama_series }} </option>
        </select>
        <input type="submit">
    </form>
    </div>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const router = useRouter()
    const list_karakter = ref([])
    const genresInput = ref([])
    const list_Pemain = ref([])
    const series = ref([])
    const seriesInput = ref('')
    const namaKarakterInput = ref('')
    const pemainInput = ref('')
    const id_input =  ref('')
    const supabase = useSupabaseClient()
    const isEditing = ref(false)
   
    
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_karakter')
            .delete()
            .eq('karakter_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchData()
    }
   
    //update function
    async function UpdateKarakter() {
        const {error} = await supabase .from('table_karakter')
        .update({nama_karakter: namaKarakterInput.value, pemain_id: pemainInput.value, series_id: seriesInput.value})
        .eq('karakter_id', id_input.value)
    }
  
   
    
    

    //fetch Function
    async function FetchDataSeries() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series')
        series.value = data
    }

    async function FetchSelectedKarakter(karakter_id, nama_karakter, series, pemain) {
        id_input.value = karakter_id
        namaKarakterInput.value = nama_karakter
        seriesInput.value = series
        pemainInput.value = pemain
        isEditing.value = true
    }

    async function FetchKarakter() {
        const { data, error} = await supabase
        .from('table_karakter')
        .select()

        list_karakter.value = data

    }

    async function FetchPemain() {
        const { data, error} = await supabase
        .from('table_pemain')
        .select()

        list_Pemain.value = data

    }



    onMounted(() => {
        FetchKarakter()
        FetchPemain()
        FetchDataSeries()
    })
        
    
</script>