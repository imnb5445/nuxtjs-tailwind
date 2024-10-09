<template>
    <div v-for="show in series" :key="show.series_id">
        <p>{{ show.nama_series }}</p>
        <p>{{ show.sinopsis }}</p>
        <p></p>
        <img :src="show.cover" alt="" class="w-20 h-20 bg-cover">
        <p v-for=" genre in show.table_genre">{{ genre.nama_genre }}</p>
        <p v-for=" tempat in show.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
    </div>

    <form @submit.prevent="UpdateDataGenre">
        <div v-for="genre in genres" :key="genre.genre_id">
            <input type="checkbox" name="checkbox" :value="genre.genre_id" v-model="genresInput">
            <label for="checkbox">{{ genre.nama_genre }}</label>
           
        </div>
        <input type="submit">
    </form>

    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const series = ref([])
    const genres = ref([])
    const genresInput = ref([])
    const id_input =  ref('')
    const series_id_input = 2
    const supabase = useSupabaseClient()
    const nama_series = ref('')
    const test = [1, 2]
    const test2 = 2

    // async function InsertData() {
    //     genres.forEach(InsertDataGenre);
    // }


    //update function
    async function UpdateDataGenre() {
        for( const genre of genresInput.value){
            const {error} = await supabase
            .from('table_series_genre')
            .upsert({series_id: id_input.value, genre_id : genre})
            
            console.log(genre)

            if (error) {
                alert('data Upserting failed')
            }
            
        }

        for(const genreData of genres.value){
            if(genresInput.value.includes(genreData.genre_id)){
                console.log(genreData.genre_id)
            }
            else{
                const {error: deleteError} = await supabase
                .from('table_series_genre')
                .delete()
                .eq('series_id', id_input.value)
                .eq('genre_id', genreData.genre_id)
                if(deleteError){
                    console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
                }
            }
        }

       
    }

    // delete function
    async function DeleteDataGenre() {
    try {
        // Check if genresInput is valid
        if (!Array.isArray(genresInput.value) || genresInput.value.length === 0) {
            console.warn("No genres selected for deletion.");
            return; // Exit if no genres to delete
        }

        const genreFilter = genresInput.value

        // Fetch records where genre_id is not in the input and match the series_id
        const { data, error } = await supabase
            .from('table_series_genre')
            .select('genre_id') // Select genre_id instead of series_id
            .not('genre_id', 'in', genreFilter) // Ensure the column name is correct
            .eq('series_id', id_input); // Filter by series_id


        // Check for errors
        if (error) {
            console.error("Data selection failed:", error.message);
            alert("Data selection failed");
            return; // Exit the function on error
        }

        // Proceed to delete if any genres to remove
        if (data.length > 0) {
            const genreIdsToDelete = data.map(item => item.genre_id); // Use genre_id for deletion

            const { error: deleteError } = await supabase
                .from('table_series_genre')
                .delete()
                .in('genre_id', genreIdsToDelete); // Deleting by genre_id

            if (deleteError) {
                console.error("Data deletion failed:", deleteError.message);
                alert("Data deletion failed");
            } else {
                alert("Genres deleted successfully."); // Success message
            }
        } else {
            alert("No genres to delete for this series."); // Optional alert for clarity
        }
    } catch (error) {
        console.error("Error during deletion:", error);
        alert("An unexpected error occurred during deletion.");
    }
}

    //fetch Function
    async function FetchData() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        // .filter('table_genre.genre_id', 'in', test)
        series.value = data
    }

    async function FetchDataGenre() {
        const { data, error} = await supabase
        .from('table_genre')
        .select()

        genres.value = data

    }

    

    onMounted(() => {
        FetchData()
        FetchDataGenre()
    })
        
    
</script>