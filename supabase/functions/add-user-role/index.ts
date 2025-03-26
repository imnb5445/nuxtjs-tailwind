

// Setup type definitions for built-in Supabase Runtime APIs

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from '@supabase/supabase-js'

console.log("Hello from Functions!")
const supUrl = Deno.env.get("_SUPABASE_URL") as string
const supKey = Deno.env.get("_SUPABASE_SERVICE_KEY") as string
const supabase = createClient(supUrl, supKey)
const CurrentUser = ref([])

Deno.serve(async (req) => {
 
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  const { data: { user: User } } = await supabase.auth.getUser()
        CurrentUser.value = User
 
        if(!CurrentUser.value){
            return
        }
        const UserId = User.id
        AddUserRole(UserId)
  
  async function AddUserRole(x){
    let {error} = await supabase
    .from('table_user_role')
    .insert({user_id : x})
  }
 
  

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add-user-role' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
