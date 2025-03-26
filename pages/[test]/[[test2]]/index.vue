
<template>
    <div>
        <div v-for="show in series" :key="show.series_id">
            <p>{{ show.nama_series }}</p>
            <p>{{ show.sinopsis }}</p>
            <p></p>
            <img :src="show.cover" alt="" class="w-20 h-20 bg-cover" @click="SeriesGoTo(show.series_id)">
            <p v-for=" genre in show.table_genre">{{ genre.nama_genre }}</p>
            <p v-for=" tempat in show.table_tempat_tayang">{{ tempat.nama_tempat_tayang }}</p>
        </div>

        <form @submit.prevent="testUrl()">
            <input type="text" v-model="UrlInput">
            <input type="submit">
        </form>

        <p>Genre</p>
        <form @submit.prevent="FetchSeriesGenre">
            <div v-for="genre in genres">
                <input type="checkbox" name="checkbox" class="input_checkbox"   v-model="FilterTEst" :value="genre.genre_id">
                <label for="checkbox">{{ genre.nama_genre }}</label>

            </div>
            <input type="Submit">
        </form>

        
    </div>
    <p v-if="UrlTest && UrlTest !== ''">{{ UrlTest }}</p>
    <p> {{ filteredSeries }}</p>
    <p> {{ FilterTEst}}</p>
    <p>{{ innerJoin }}</p>
    
</template>

<script setup>
const supabase = useSupabaseClient()
const series = ref([])
const filterGenre = [1, 2]
const UrlInput = ref('')
const UrlTest = ref([])
const FilterTEst = ref([])
const TestArray = ref([])
const genres = ref([])
const filteredSeries = ref([])
const innerJoin = ref([])

// const filtre = Filter()

    async function Filter(){
        const innerJoin = filteredSeries.value[0].filter(item => filteredSeries.value[2].includes(item));m
    }
    

    
    async function FecthDataGenre() {
        const {data, error} = await supabase
        .from('table_genre')
        .select()

        genres.value = data
    }

    async function FetchData() {
        const { data, error} = await supabase
        .from('table_series')
        .select('series_id, nama_series, sinopsis, cover, table_genre!inner(*), table_tempat_tayang!inner(*) ')
        
        series.value = data
 
    }

    onMounted(() => {
        FetchData()
        FecthDataGenre()
    })

    function testUrl(){
        console.log(UrlInput.value)
        const regExp = /^.*(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]*\/\S*\/|\S*?v=|\S*?v%3D)([\w-]+)).*/;
        var match = UrlInput.value.match(regExp)
        console.log(match);
        
        
        if (match) {
        UrlTest.value = match[1]; // The YouTube video ID is in the second capture group
        console.log(UrlTest.value);
        } else {
        UrlTest.value = []; // No match found
    }
    }
    async function FetchSeriesGenre(){
        var i = 0
        console.log(i)
        for( const genre of FilterTEst.value){
            const { data, error} = await supabase
            .from('table_series_genre')
            .select('series_id, genre_id')
            .eq('genre_id', genre)

            filteredSeries.value[i] = data.map(item => item.series_id)
            console.log(filteredSeries.value)
            i++
            
        }
        Filter()
       
    }
</script>