<template>
    <div v-for="user_role in list_user_role" :key="user_role.user_id">
        <p >{{ user_role.user_id }}</p>
        <p>{{ user_role.role_id }}</p>
        
        <form @submit.prevent="FetchSelectedGenre(genre.genre_id, genre.nama_genre)">
            <input type="submit">
        </form>

        <button @click="DeleteData(user_role.user_id)">Delete</button>
    </div>
    <div>
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
    const list_user_role = ref([])
    const genresInput = ref([])
    const genreInput = ref('')
    const id_input =  ref('')
    const supabase = useSupabaseClient()
    const isEditing = ref(false)
   
    
    async function DeleteData(x){
        const {error: deleteError} = await supabase
            .from('table_user_role')
            .delete()
            .eq('user_id', x)
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

    async function FetchUserRole() {
        const { data, error} = await supabase
        .from('table_user_role')
        .select('role_id, user_id')

        console.log(data)

        if(error){
            console.log(error)
        }

        list_user_role.value = data

    }


    onMounted(() => {
        FetchUserRole()
    })
        
    
</script>