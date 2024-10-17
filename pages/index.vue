<template>
    <div v-for="show in series" :key="show.series_id">
        <p>{{ show.nama_series }}</p>
        <p>{{ show.sinopsis }}</p>
        <p></p>
        <img :src="show.cover" alt="" class="w-20 h-20 bg-cover" @click="SeriesGoTo(show.series_id)">
        <p v-for=" genre in show.table_genre">{{ genre.nama_genre }}</p>
        <p v-for=" tempat in show.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
        <form @submit.prevent="FetchSeries(show.series_id)">
            <input type="submit">
        </form>
    </div>

    <div v-if="isEdting">
        <form @submit.prevent="UpdateData" >
        <label for="JudulInput">Judul</label>
        <input type="text" name="JudulInput" v-model="judulInput">

        <textarea name="sinopsis" v-model="sinopsisInput"></textarea>

        <p>Genre</p>
        <div v-for="genre in genres" :key="genre.genre_id">
            <input type="checkbox" name="checkbox" :value="genre.genre_id" v-model="genresInput">
            <label for="checkbox">{{ genre.nama_genre }}</label>
           
        </div>

        <p>Tempat Tayang</p>
        <div v-for=" tempat in tempatTayang" :key="tempat.tempat_tayang_id">
            <input type="checkbox" name="checkbox" :value="tempat.tempat_tayang_id" v-model="tempatInput">
            <label for="checkbox">{{ tempat.nama_tempat_tayang }}</label>
           
        </div>
        <input type="submit">
    </form>
    </div>
    

    <form action="">
        <input type="text" v-model="searchInput" @input="SearchEventHandler">
    </form>
    <div v-for="result in seriesSearch" :key="result.series_id">
        {{ result.nama_series }}
    </div>


    <p>{{ genre }}</p>
    <p>{{ genresInput }}</p>
    <p>{{ id_input }}</p>
    <form action="">
        <input type="submit">
    </form>
</template>

<script setup>
    const router = useRouter()
    const series = ref([])
    const genres = ref([])
    const tempatTayang = ref([])
    const tempatInput = ref([])
    const genresInput = ref([])
    const seriesSearch = ref([])
    const sinopsisInput = ref('')
    const judulInput = ref('')
    const searchInput=ref('')
    const id_input =  ref('')
    const series_id_input = 2
    const supabase = useSupabaseClient()
    const nama_series = ref('')
    const test = [1, 2]
    const test2 = 2
    const isEdting = ref(false)
    // Navigation
    function  SeriesGoTo(id){
        router.push({ name: 'series-id', params: { id } });
    }
    // Event handeling
    async function SearchEventHandler(event){

        if(searchInput.value.length < 2){
            seriesSearch.value = []
            return
        }

        const {data, error} = await supabase
        .from('table_series')
        .select()
        .ilike('nama_series', `%${searchInput.value}%`);

        if(error){
            console.error("Error fetching data:", error.message);
            seriesSearch.value = []; // Clear results on error
        }
        else{
            seriesSearch.value = data
        }

    }

   


    //update function

    async function UpdateData() {
        await UpdateDataGenre()
        await UpdateDataTempat()
        await UpdateDataSeries()

        id_input.value = ''
        isEdting.value = false
    }

    async function UpdateDataSeries() {
        const {error} = await supabase
        .from('table_series')
        .update({nama_series : judulInput.value, sinopsis : sinopsisInput})
        .eq('series_id', id_input.value)

        if(error){
            console.error("Data Update failed:", error.message);
            alert("Data Update failed");
         }
    }

    async function UpdateDataTempat() {
        for( const tempat of tempatInput.value){
            const {error} = await supabase
            .from('table_series_tempat_tayang')
            .upsert({series_id: id_input.value, tempat_tayang_id : tempat})
            
            console.log(tempat)

            if (error) {
                alert('data Upserting failed')
                return
            }

           
            
        }

        for(const tempatData of tempatTayang.value){
            if(tempatInput.value.includes(tempatData.tempat_tayang_id)){
                console.log(tempatData.tempat_tayang_id)
            }
            else{
                const {error: deleteError} = await supabase
                .from('table_series_tempat_tayang')
                .delete()
                .eq('series_id', id_input.value)
                .eq('tempat_tayang_id', tempatData.tempat_tayang_id)
                if(deleteError){
                    console.error("Data selection failed:", error.message);
                    alert("Data selection failed");
                }
            }
        }
        tempatInput.value = []
        await FetchData()
    }
    async function UpdateDataGenre() {
        for( const genre of genresInput.value){
            const {error} = await supabase
            .from('table_series_genre')
            .upsert({series_id: id_input.value, genre_id : genre})
            
            console.log(genre)

            if (error) {
                alert('data Upserting failed')
                return
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
        genresInput.value = []
        await FetchData()
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

    async function FetchDataTempat() {
        const { data, error} = await supabase
        .from('table_tempat_tayang')
        .select()

        tempatTayang.value = data

    }

    async function FetchSeries(x){
        FetchSeriesGenre(x)
        FetchSeriesTempat(x)
        id_input.value = x
        isEdting.value = true
    }

    async function FetchSeriesGenre(x) {
        const {data, error} = await supabase
        .from('table_series_genre')
        .select('genre_id')
        .eq('series_id', x)

        
        genresInput.value = data.map(item => item.genre_id)
    }

    async function FetchSeriesTempat(x) {
        const {data, error} = await supabase
        .from('table_series_tempat_tayang')
        .select('tempat_tayang_id')
        .eq('series_id', x)

        
        tempatInput.value = data.map(item => item.tempat_tayang_id)

    }

    

    onMounted(() => {
        FetchData()
        FetchDataGenre()
        FetchDataTempat()
    })
        
    
</script>