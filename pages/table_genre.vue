<template>
    <div v-for="genre in list_genre" :key="genre.genre_id">
        <p>{{ genre.genre_id }}</p>
        <p>{{ genre.nama_genre }}</p>
        
        <form @submit.prevent="FetchSelectedGenre(genre.genre_id, genre.nama_genre)">
            <input type="submit">
        </form>

        <button @click="DeleteData(genre.genre_id)">Delete</button>
    </div>

    <div v-if="isEditing">
        <form @submit.prevent="Updategenre" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="genreInput">
        <input type="submit">
    </form>
    </div>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const router = useRouter()
    const list_genre = ref([])
    const genresInput = ref([])
    const genreInput = ref('')
    const id_input =  ref('')
    const supabase = useSupabaseClient()
    const isEditing = ref(false)
   
    
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_genre')
            .delete()
            .eq('genre_id', x)
            if(deleteError){
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            }

            FetchData()
    }
   
    //update function
    async function Updategenre() {
        const {error} = await supabase .from('table_genre')
        .update({nama_genre: genreInput.value})
        .eq('genre_id', id_input.value)
    }
  
   
    
    

    //fetch Function
    async function FetchSelectedGenre(genre_id, nama_genre) {
        id_input.value = genre_id
        genreInput.value = nama_genre
        isEditing.value = true
    }

    async function FetchGenre() {
        const { data, error} = await supabase
        .from('table_genre')
        .select()

        list_genre.value = data

    }


    onMounted(() => {
        FetchGenre()
    })
        
    
</script>